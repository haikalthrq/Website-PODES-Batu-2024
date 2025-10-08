# Local Development Guide

## 🏃‍♂️ Running the Application Locally

You have **two options** for local development:

### Option 1: Traditional Development (Separate Frontend + Backend)

Run frontend and backend separately during development:

#### Terminal 1 - Backend Server
```bash
cd server
npm install
npm start
# Server runs on http://localhost:5001
```

#### Terminal 2 - Frontend Dev Server
```bash
cd client
npm install
npm run dev
# Vite dev server runs on http://localhost:5173
# API calls to /api/* are proxied to http://localhost:5001
```

**Usage**: Open http://localhost:5173 in your browser

**Advantages**:
- Hot module reload (HMR) for instant frontend updates
- Fast development workflow
- Backend logs visible in separate terminal

---

### Option 2: Vercel Dev (Simulate Production Locally)

Test the full Vercel deployment setup locally:

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Run Vercel Development Server
```bash
# From repository root
vercel dev
```

Vercel CLI will:
1. Build the frontend (or watch for changes)
2. Run serverless functions from `/api`
3. Serve everything on http://localhost:3000

**Usage**: Open http://localhost:3000 in your browser

**Advantages**:
- Exactly matches production environment
- Tests serverless functions locally
- Catches deployment issues early
- Single unified server

**When to use**:
- Before deploying to production
- Testing serverless function changes
- Debugging deployment-specific issues

---

## 📝 Development Workflow

### Daily Development (Option 1 Recommended)

1. **Make changes** to frontend code in `client/src/`
2. **Vite HMR** updates browser instantly
3. **Backend changes** require server restart

### Pre-Deployment Testing (Use Option 2)

1. **Run** `vercel dev` to test full setup
2. **Verify** all routes work (frontend + API)
3. **Check** browser console for errors
4. **Test** SPA routing (navigate and hard refresh)

---

## 🔧 Configuration

### Vite Proxy (for Option 1)

`client/vite.config.js` proxies API calls during development:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5001',  // Backend server
      changeOrigin: true,
    }
  }
}
```

This allows frontend code to use relative `/api/*` paths that work in both development and production.

---

## 🧪 Testing API Endpoints

### With Backend Server (Option 1)
```bash
# Health check
curl http://localhost:5001/api/health

# Get all villages
curl http://localhost:5001/api/villages

# Get metadata
curl http://localhost:5001/api/villages/metadata

# Compare villages
curl "http://localhost:5001/api/villages/compare?ids=1,2,3"
```

### With Vercel Dev (Option 2)
```bash
# Same endpoints, different port
curl http://localhost:3000/api/health
curl http://localhost:3000/api/villages
```

---

## 📦 Installing Dependencies

### Frontend
```bash
cd client
npm install
```

### Backend (for traditional development)
```bash
cd server
npm install
```

### API (for Vercel deployment)
```bash
cd api
npm install  # Currently no dependencies needed
```

---

## 🚀 Building for Production

### Build Frontend Only
```bash
cd client
npm run build
# Output: client/dist/
```

### Preview Production Build Locally
```bash
cd client
npm run preview
# Serves built files on http://localhost:4173
```

---

## 🐛 Common Issues

### Issue: "Cannot connect to backend"

**Solution**: 
- Ensure backend server is running on port 5001
- Check `server/server.js` started successfully
- Verify no other process using port 5001

### Issue: "404 on /api/* during local dev"

**Solution**:
- Check Vite proxy configuration in `client/vite.config.js`
- Ensure backend is running
- Restart Vite dev server

### Issue: "Module not found" errors

**Solution**:
```bash
# Reinstall dependencies
cd client && rm -rf node_modules package-lock.json
npm install

cd ../server && rm -rf node_modules package-lock.json
npm install
```

---

## 📚 File Structure

```
client/               → Frontend (Vite + React)
  src/                → Source code
  public/             → Static assets
  dist/               → Build output (gitignored)
  
server/               → Backend (Express) - for local dev only
  data/               → PODES data JSON
  routes/             → Express routes
  controllers/        → Business logic
  
api/                  → Serverless functions (for Vercel)
  _lib/               → Shared utilities
  villages/           → Village endpoints
  health.js           → Health check
```

---

## 🎯 Development Commands Cheatsheet

```bash
# Frontend development
cd client
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend development
cd server
npm start            # Start Express server
npm run dev          # Start with nodemon (auto-restart)

# Vercel deployment testing
vercel dev           # Run local Vercel environment
vercel               # Deploy to preview
vercel --prod        # Deploy to production
```

---

**Happy Coding! 🎉**
