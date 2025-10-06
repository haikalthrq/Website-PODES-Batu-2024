# 💻 Development Setup

> **Panduan lengkap setup development environment untuk programmer junior**

## 🎯 Prerequisites

### 1. Install Node.js
```bash
# Download dari https://nodejs.org/ (versi LTS terbaru)
# Atau menggunakan nvm (Node Version Manager)

# Check installation
node --version    # Should be v16+ 
npm --version     # Should be v8+
```

### 2. Install Git
```bash
# Download dari https://git-scm.com/
# Atau install via package manager

# Check installation
git --version
```

### 3. Code Editor
- **VS Code** (Recommended): https://code.visualstudio.com/
- **WebStorm**: https://www.jetbrains.com/webstorm/
- **Sublime Text**: https://www.sublimetext.com/

## 🚀 Project Setup

### 1. Clone Repository
```bash
# Clone project
git clone <repository-url>
cd podes_batu_webapp

# Check folder structure
ls -la
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd server
npm install

# Expected packages:
# - express: Web framework
# - cors: Cross-origin requests
# - helmet: Security middleware
# - morgan: Request logging
```

#### Frontend Setup  
```bash
cd ../client
npm install

# Expected packages:
# - react: UI library
# - vite: Build tool
# - @mui/material: UI components
# - apexcharts: Chart library
# - react-router-dom: Routing
```

### 3. Environment Configuration

#### Backend Environment
```bash
# Create server/.env file
cd server
touch .env

# Add to .env:
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

#### Frontend Environment
```bash
# Create client/.env.local file
cd ../client  
touch .env.local

# Add to .env.local:
VITE_API_BASE_URL=http://localhost:5000/api
VITE_VIZ_DEBUG=true
```

## 🏃‍♂️ Running the Application

### Development Mode

#### Terminal 1: Backend Server
```bash
cd server
npm run dev     # or npm start

# Expected output:
# Server running on http://localhost:5000
# API available at http://localhost:5000/api
```

#### Terminal 2: Frontend Dev Server
```bash
cd client
npm run dev

# Expected output:  
# Local:   http://localhost:3000
# Network: http://192.168.1.100:3000
```

#### Terminal 3: Optional - Watch Mode
```bash
# For automatic server restart on changes
cd server
npm run watch   # if available
```

### Production Build

#### Build Frontend
```bash
cd client
npm run build

# Creates 'dist' folder with optimized files
# Output: dist/index.html, dist/assets/...
```

#### Serve Production Build
```bash
# Option 1: Using server's static serving
cd ../server
npm start   # Serves both API and static files

# Option 2: Using separate static server
cd ../client
npm run preview  # Preview production build
```

## 🧪 Development Workflow

### 1. Daily Development
```bash
# Start development (2 terminals)
cd server && npm run dev     # Terminal 1
cd client && npm run dev     # Terminal 2

# Code changes auto-reload in browser
# API changes restart server automatically
```

### 2. Code Quality Checks
```bash
cd client

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking (if using TypeScript)
npm run type-check
```

### 3. Testing
```bash
# Run tests (if available)
npm run test

# Run tests in watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🛠️ VS Code Setup

### Recommended Extensions
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",      // Code formatting
    "dbaeumer.vscode-eslint",      // JavaScript linting  
    "bradlc.vscode-tailwindcss",   // Tailwind support
    "ms-vscode.vscode-typescript", // TypeScript support
    "formulahendry.auto-rename-tag", // HTML tag rename
    "christian-kohler.path-intellisense", // Path autocomplete
    "ms-vscode.vscode-json"        // JSON support
  ]
}
```

### Workspace Settings
Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.workingDirectories": ["client"],
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### Debug Configuration
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/client/node_modules/vite/bin/vite.js",
      "args": ["--mode", "development"],
      "cwd": "${workspaceFolder}/client"
    },
    {
      "name": "Debug Backend", 
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/server.js",
      "env": {
        "NODE_ENV": "development"
      },
      "cwd": "${workspaceFolder}/server"
    }
  ]
}
```

## 🔧 Development Tools

### Browser DevTools

#### React DevTools
```bash
# Install browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/

# Usage:
# 1. Open DevTools (F12)
# 2. Go to "Components" tab
# 3. Inspect React component tree
# 4. View props, state, hooks
```

#### Network Tab for API Debugging
```bash
# Steps:
# 1. Open DevTools → Network tab
# 2. Filter by "XHR" or "Fetch"  
# 3. Interact with dashboard
# 4. Check API requests/responses
# 5. Look for errors (red entries)
```

### Console Debugging
```javascript
// Add these in components for debugging
console.log('Component props:', props);
console.log('Current state:', state);
console.log('API response:', response);

// Production build removes console.logs automatically
```

## 📦 Package Management

### Adding New Dependencies

#### Frontend Dependencies
```bash
cd client

# UI Libraries
npm install @mui/icons-material    # Material icons
npm install react-hook-form        # Form handling
npm install date-fns              # Date utilities

# Development Dependencies  
npm install -D @types/react       # TypeScript types
npm install -D prettier           # Code formatting
```

#### Backend Dependencies
```bash
cd server

# Runtime Dependencies
npm install express-validator      # Input validation
npm install compression           # Response compression
npm install rate-limiter-flexible # Rate limiting

# Development Dependencies
npm install -D nodemon            # Auto-restart server
npm install -D jest               # Testing framework
```

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest
```

## 🐛 Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Problem: Error: listen EADDRINUSE :::5000

# Solution 1: Kill process using port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <process-id> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill

# Solution 2: Change port in .env
PORT=5001
```

### Issue: Module Not Found
```bash
# Problem: Cannot resolve module 'xyz'

# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or clear npm cache
npm cache clean --force
```

### Issue: CORS Errors
```bash
# Problem: Access to fetch blocked by CORS policy

# Solution: Check server CORS configuration
# In server/server.js:
app.use(cors({
  origin: 'http://localhost:3000',  // Frontend URL
  credentials: true
}));
```

### Issue: Build Errors
```bash
# Problem: Build fails with errors

# Solution 1: Check ESLint/TypeScript errors
npm run lint
npm run type-check

# Solution 2: Clear build cache
rm -rf dist .vite
npm run build
```

## 📊 Performance Monitoring

### Development Performance
```javascript
// Add to components for performance tracking
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log('Component:', id, 'Phase:', phase, 'Duration:', actualDuration);
}

<Profiler id="Dashboard" onRender={onRenderCallback}>
  <DashboardComponent />
</Profiler>
```

### Bundle Analysis
```bash
cd client

# Install bundle analyzer
npm install -D rollup-plugin-analyzer

# Analyze bundle size
npm run build:analyze
```

## 🧹 Code Quality

### Pre-commit Hooks
```bash
# Install husky for git hooks
npm install -D husky lint-staged

# Add to package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}

# Setup pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

### Code Formatting
```bash
# Format all files
npx prettier --write .

# Check formatting
npx prettier --check .
```

---

**💡 Tips for Smooth Development**

1. **Always run both servers**: Frontend needs backend API
2. **Check console regularly**: Errors appear in browser console
3. **Use React DevTools**: Great for debugging component issues
4. **Hot reload is your friend**: Changes appear immediately
5. **Keep dependencies updated**: Run `npm outdated` weekly
6. **Read error messages**: They usually tell you exactly what's wrong
7. **Use debugger statements**: Better than console.log for complex debugging