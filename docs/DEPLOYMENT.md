# 🚀 Deployment Guide

> **Panduan deployment aplikasi Dashboard PODES ke production**

## 🎯 Deployment Options

### 1. **Simple Deployment** (Recommended for beginners)
- **Vercel** (Frontend) + **Railway** (Backend)
- Zero configuration, auto-deploy from GitHub
- Free tier available

### 2. **VPS Deployment** (For advanced users)
- **DigitalOcean/AWS/GCP** + **PM2** + **Nginx**
- Full control, custom domain support
- Requires server management knowledge

### 3. **Docker Deployment** (For production)
- **Docker** + **Docker Compose**
- Containerized, scalable, reproducible
- Requires Docker knowledge

---

## 🌟 Option 1: Vercel + Railway (Easiest)

### Backend Deployment (Railway)

#### 1. Setup Railway Account
```bash
# 1. Go to https://railway.app/
# 2. Sign up with GitHub account
# 3. Create new project
```

#### 2. Deploy Backend
```bash
# 1. In Railway dashboard, click "New Project"
# 2. Select "Deploy from GitHub repo"
# 3. Choose your repository
# 4. Set root directory to "server"
# 5. Railway auto-detects Node.js project
```

#### 3. Environment Variables
```bash
# In Railway project settings, add:
NODE_ENV=production
PORT=5000  # Railway will override this
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

#### 4. Custom Start Command
```bash
# In Railway settings, set start command:
npm start
```

### Frontend Deployment (Vercel)

#### 1. Setup Vercel Account
```bash
# 1. Go to https://vercel.com/
# 2. Sign up with GitHub account
# 3. Import your repository
```

#### 2. Project Configuration
```bash
# Framework Preset: Vite
# Root Directory: client
# Build Command: npm run build
# Output Directory: dist
# Install Command: npm install
```

#### 3. Environment Variables
```bash
# In Vercel project settings, add:
VITE_API_BASE_URL=https://your-backend-domain.railway.app/api
VITE_APP_ENV=production
```

#### 4. Deploy
```bash
# Vercel automatically deploys on git push to main branch
# First deployment might take 2-3 minutes
```

### Domain Configuration

#### Custom Domain (Optional)
```bash
# In Vercel:
# 1. Go to project settings
# 2. Add custom domain
# 3. Update DNS records at domain provider

# In Railway:
# 1. Go to project settings  
# 2. Add custom domain
# 3. Update CORS_ORIGIN environment variable
```

---

## 🖥️ Option 2: VPS Deployment

### Prerequisites
- Ubuntu 20.04+ VPS (DigitalOcean, AWS, etc.)
- Domain name (optional)
- Basic Linux knowledge

### 1. Server Setup

#### Initial Server Configuration
```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx (Reverse Proxy)
apt install -y nginx

# Install Certbot (SSL Certificates)
apt install -y certbot python3-certbot-nginx
```

#### Create Application User
```bash
# Create non-root user
adduser podes
usermod -aG sudo podes

# Switch to application user
su - podes
```

### 2. Application Deployment

#### Clone and Setup
```bash
# Clone repository
git clone <your-repo-url>
cd podes_batu_webapp

# Setup backend
cd server
npm install --production
```

#### Environment Configuration
```bash
# Create production environment file
cat > .env << EOF
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com
EOF
```

#### PM2 Configuration
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'podes-api',
    script: 'server.js',
    cwd: '/home/podes/podes_batu_webapp/server',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOF

# Start application with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup  # Follow the instructions
```

### 3. Nginx Configuration

#### Create Nginx Config
```bash
sudo cat > /etc/nginx/sites-available/podes << EOF
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Frontend static files
    location / {
        root /home/podes/podes_batu_webapp/client/dist;
        try_files \$uri \$uri/ /index.html;
        add_header Cache-Control "public, max-age=31536000";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/podes /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

### 4. Frontend Build & Deploy

#### Build Frontend
```bash
cd ../client
npm install
npm run build

# Files are built to 'dist' directory
# Nginx serves these static files
```

#### SSL Certificate
```bash
# Get free SSL certificate from Let's Encrypt
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (add to cron)
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🐳 Option 3: Docker Deployment

### 1. Create Dockerfiles

#### Backend Dockerfile
```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["npm", "start"]
```

#### Frontend Dockerfile
```dockerfile
# client/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Config for Docker
```nginx
# client/nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;

        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend:5000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### 2. Docker Compose

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./server
    container_name: podes-api
    environment:
      - NODE_ENV=production
      - PORT=5000
      - CORS_ORIGIN=http://localhost
    ports:
      - "5000:5000"
    restart: unless-stopped

  frontend:
    build: ./client
    container_name: podes-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  # Optional: Add monitoring
  # watchtower:
  #   image: containrrr/watchtower
  #   volumes:
  #     - /var/run/docker.sock:/var/run/docker.sock
  #   command: --interval 300
```

### 3. Deploy with Docker

#### Local Testing
```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

#### Production Deployment
```bash
# On production server
git clone <your-repo>
cd podes_batu_webapp

# Create production environment
cp .env.example .env
# Edit .env with production values

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔧 Environment Variables

### Production Environment Variables

#### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=info
API_RATE_LIMIT=100
```

#### Frontend (.env.production)
```bash
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_APP_ENV=production
VITE_VIZ_DEBUG=false
VITE_ANALYTICS_ID=your-analytics-id
```

---

## 📊 Monitoring & Maintenance

### 1. Health Checks

#### API Health Check
```bash
# Check if API is responding
curl https://yourdomain.com/api/health

# Expected response:
{"status":"OK","message":"Server is running"}
```

#### Frontend Check  
```bash
# Check if frontend loads
curl -I https://yourdomain.com

# Expected: HTTP/1.1 200 OK
```

### 2. Log Monitoring

#### PM2 Logs
```bash
# View application logs
pm2 logs podes-api

# View error logs only
pm2 logs podes-api --err

# Clear logs
pm2 flush
```

#### Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs  
sudo tail -f /var/log/nginx/error.log
```

### 3. Performance Monitoring

#### Server Resources
```bash
# CPU and memory usage
pm2 monit

# Disk usage
df -h

# Network connections
netstat -tulpn | grep :80
```

#### Application Metrics
```bash
# API response times
curl -w "%{time_total}\n" -s -o /dev/null https://yourdomain.com/api/villages

# Bundle size check
npm run build:analyze
```

---

## 🔄 Deployment Automation

### GitHub Actions (CI/CD)

#### Create .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install and Build
      run: |
        cd client
        npm ci
        npm run build
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./client
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Fails
```bash
# Problem: Frontend build errors
# Solution: Check dependencies and environment variables
cd client
npm run build  # Check for specific errors
```

#### 2. API Not Accessible
```bash
# Problem: 502 Bad Gateway
# Solution: Check if backend is running
pm2 status
pm2 restart podes-api
```

#### 3. CORS Errors in Production
```bash
# Problem: Cross-origin requests blocked
# Solution: Update CORS_ORIGIN environment variable
echo "CORS_ORIGIN=https://yourdomain.com" >> server/.env
pm2 restart podes-api
```

#### 4. SSL Certificate Issues
```bash
# Problem: Certificate expired
# Solution: Renew certificate
sudo certbot renew
sudo systemctl reload nginx
```

---

**💡 Production Checklist**

- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Domain DNS properly configured
- [ ] API health check passing
- [ ] Frontend loads correctly
- [ ] Error monitoring setup
- [ ] Backup strategy implemented
- [ ] Update process documented
- [ ] Performance monitoring active
- [ ] Security headers configured