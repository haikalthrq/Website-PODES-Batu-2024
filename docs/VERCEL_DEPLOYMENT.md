# Vercel Deployment Guide - PODES Batu 2024

## 📋 Overview

This guide covers deploying the PODES Batu 2024 dashboard (Vite frontend + Express backend) to Vercel as a unified serverless application.

**Architecture:**
- **Frontend**: Vite (React) → Static files served from `/client/dist`
- **Backend**: Express routes → Vercel Serverless Functions under `/api`
- **Single Domain**: All traffic on one domain, no CORS issues
- **SPA Routing**: Client-side routes work on hard refresh

---

## 🚀 Quick Start

### 1. Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub repository connected to Vercel
- Vercel CLI installed (optional for local testing): `npm i -g vercel`

### 2. Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository: `haikalthrq/Website-PODES-Batu-2024`
3. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as repository root)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: Leave default or use `npm install --prefix client`

4. **Environment Variables**: None required for this project (data is bundled)

5. Click **Deploy**

#### Option B: Via Vercel CLI

```bash
# Login to Vercel
vercel login

# From repository root
vercel

# Follow prompts:
# - Link to existing project or create new
# - Confirm settings detected from vercel.json

# Deploy to production
vercel --prod
```

---

## 🔧 Configuration Files

### `vercel.json` (Repository Root)

```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build",
  "outputDirectory": "client/dist",
  "framework": "vite",
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

**Key settings:**
- **buildCommand**: Installs dependencies and builds Vite app
- **outputDirectory**: Where Vite outputs static files
- **functions**: Configures serverless function limits
- **routes**: SPA fallback - all non-API routes serve `index.html`

---

## 📁 Project Structure

```
Website-PODES-Batu-2024/
├── api/                          # Serverless Functions
│   ├── _lib/
│   │   └── dataLoader.js         # Shared utilities
│   ├── health.js                 # GET /api/health
│   ├── villages/
│   │   ├── index.js              # GET /api/villages
│   │   ├── compare.js            # GET /api/villages/compare
│   │   └── metadata.js           # GET /api/villages/metadata
│   └── package.json
├── client/                       # Vite Frontend
│   ├── src/
│   ├── public/
│   ├── dist/                     # Build output (deployed)
│   ├── package.json
│   └── vite.config.js
├── server/                       # Original Express (not deployed)
│   ├── data/
│   │   └── data_podes_2024.json  # Used by /api functions
│   └── ...
├── vercel.json                   # Vercel configuration
└── .vercelignore                 # Files to exclude
```

---

## 🌐 API Endpoints

All API routes are accessible under `/api/*`:

### Health Check
```
GET /api/health
Response: { status: 'OK', message: '...', timestamp: '...', dataCount: 24 }
```

### Get All Villages
```
GET /api/villages
Query Params:
  - kecamatan (optional): Filter by kecamatan
  - indicator (optional): Calculate KPIs for indicator
  - category (optional): Filter by category

Response: { success: true, data: [...], count: 24, filters: {...}, kpis: {...} }
```

### Compare Villages
```
GET /api/villages/compare?ids=1,2,3
Query Params:
  - ids (required): Comma-separated village IDs

Response: { success: true, data: [...], count: 3, analysis: {...} }
```

### Get Metadata
```
GET /api/villages/metadata
Response: { success: true, data: { totalVillages, kecamatans, categories, ... } }
```

---

## 🔐 Environment Variables

**Current Status**: No environment variables required.

The PODES data (`data_podes_2024.json`) is bundled with the deployment since it's public data. The serverless functions read it directly from the file system.

**If you need to add secrets later:**

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add variables for each environment:
   - **Development**: Used during `vercel dev`
   - **Preview**: Used for PR deployments
   - **Production**: Used for main branch deployments

3. Access in serverless functions:
```javascript
const apiKey = process.env.API_KEY;
```

4. **Never** commit secrets to `.env` files in the repository.

---

## 🧪 Testing Deployment

### Test Locally with Vercel CLI

```bash
# Install dependencies
cd client && npm install
cd ../api && npm install
cd ..

# Run Vercel dev server (simulates serverless + static)
vercel dev

# Visit http://localhost:3000
# - Frontend: /
# - API: /api/health, /api/villages, etc.
```

### Test Production Deployment

After deploying, test these URLs:

**Frontend (should load without 404):**
- `https://your-app.vercel.app/`
- `https://your-app.vercel.app/analysis` (SPA route)
- `https://your-app.vercel.app/comparison` (SPA route)

**API (should return JSON):**
- `https://your-app.vercel.app/api/health`
- `https://your-app.vercel.app/api/villages`
- `https://your-app.vercel.app/api/villages/metadata`
- `https://your-app.vercel.app/api/villages/compare?ids=1,2`

**Check browser console**: No CORS errors when frontend calls API

**Check Vercel Dashboard**:
- Functions → View logs for `/api/*` calls
- Deployments → Build logs show successful build

---

## 🔄 Preview Deployments

**Automatic Preview URLs** are created for every PR:

1. Push changes to a feature branch
2. Open PR on GitHub
3. Vercel automatically deploys to a unique preview URL
4. Preview URL includes both frontend and API
5. Comment on PR shows preview link

**Testing PRs:**
- Preview URLs work exactly like production
- Each PR gets its own isolated environment
- Great for testing features before merge

---

## 📦 Build Process

Vercel executes these steps on each deployment:

1. **Install**: `npm install --prefix client`
2. **Build**: `cd client && npm run build` → outputs to `client/dist`
3. **Functions**: Automatically bundles `/api/**/*.js` as serverless functions
4. **Deploy**: 
   - Static files from `client/dist` → CDN
   - Serverless functions → Regional compute (Singapore: sin1)

**Build time**: ~1-2 minutes  
**Cold start**: <500ms for API functions

---

## 🐛 Troubleshooting

### Issue: "404 Not Found" on API routes

**Solution**: Check `vercel.json` rewrites are correctly mapping routes:
```json
{
  "rewrites": [
    { "source": "/api/villages", "destination": "/api/villages/index.js" }
  ]
}
```

### Issue: "Cannot find module" in API functions

**Solution**: 
- Check `api/package.json` includes all dependencies
- Run `vercel dev` locally to test serverless functions
- Check function logs in Vercel Dashboard

### Issue: SPA routes return 404 on hard refresh

**Solution**: Verify `routes` in `vercel.json`:
```json
{
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Issue: CORS errors in browser console

**Solution**: API functions should set CORS headers:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
```
Check headers are set in all `/api/**/*.js` files.

### Issue: Build fails with "Output directory not found"

**Solution**:
- Verify `client/dist` exists after build
- Check build command runs successfully locally
- Ensure `vite.config.js` outputs to correct directory

### Issue: Data not loading (empty arrays)

**Solution**:
- Check `server/data/data_podes_2024.json` exists in repository
- Verify path in `api/_lib/dataLoader.js` is correct
- Check function logs in Vercel Dashboard for file read errors

---

## 🚦 Performance Optimization

### Caching
- Static assets (HTML, CSS, JS, images) cached at CDN edge
- API responses: Consider adding `Cache-Control` headers for GET requests

### Function Performance
- Data is loaded once per cold start and cached in memory
- Optimize by keeping functions small and focused
- Current memory: 1024 MB, max duration: 10s

### Bundle Size
- Monitor `client/dist` size: `du -sh client/dist`
- Large bundles increase deployment time
- Use code splitting and lazy loading in React

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] All API endpoints tested locally with `vercel dev`
- [ ] Frontend fetches use relative `/api/*` paths (no hardcoded URLs)
- [ ] SPA routes work on hard refresh locally
- [ ] No sensitive data in repository (check `.env` files)
- [ ] Build succeeds locally: `cd client && npm run build`
- [ ] `vercel.json` configuration reviewed
- [ ] `.vercelignore` excludes unnecessary files
- [ ] Test preview deployment first (deploy a PR)
- [ ] Monitor first production deployment in Vercel Dashboard
- [ ] Verify all pages and API endpoints work in production

---

## 🎯 Success Criteria

Deployment is successful when:

✅ Build completes without errors  
✅ All frontend routes render correctly (including hard refresh)  
✅ All API endpoints respond with valid JSON  
✅ No CORS errors in browser console  
✅ Geospatial map loads with village data  
✅ Analysis pages display indicators correctly  
✅ Comparison feature works across villages  
✅ Preview deployments work for PRs  
✅ Function logs show successful API calls  
✅ Performance is acceptable (<2s page load, <500ms API)  

---

**Deployment Date**: October 8, 2025  
**Maintained By**: BPS Kota Batu - Tim PKL  
**Support**: Check Vercel Dashboard logs for runtime issues
