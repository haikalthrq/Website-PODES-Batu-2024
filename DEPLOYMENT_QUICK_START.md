# ⚡ Vercel Deployment - Quick Reference

## 🚀 Deploy Now

```bash
# 1. Commit changes
git add .
git commit -m "feat: add Vercel serverless deployment"
git push origin main

# 2. Go to Vercel Dashboard
https://vercel.com/new

# 3. Import Repository
Select: haikalthrq/Website-PODES-Batu-2024

# 4. Configure (auto-detected from vercel.json)
Framework: Vite
Build: cd client && npm install && npm run build
Output: client/dist

# 5. Deploy!
```

---

## 📁 What Was Changed

### New Files
```
✨ api/                           # Serverless functions
✨ vercel.json                    # Vercel configuration
✨ .vercelignore                  # Deployment exclusions
✨ docs/VERCEL_DEPLOYMENT.md     # Full deployment guide
✨ docs/LOCAL_DEVELOPMENT.md     # Dev workflow guide
✨ VERCEL_SETUP_SUMMARY.md       # Implementation summary
```

### Modified Files
```
📝 client/src/services/api.js           # localhost:5001 → /api
📝 client/src/components/GeospatialMap.jsx  # localhost:5001 → /api
📝 client/vite.config.js                # Added proxy for local dev
```

---

## 🧪 Test Locally

### Option 1: Traditional (Development)
```bash
# Terminal 1
cd server && npm start

# Terminal 2
cd client && npm run dev

# Visit: http://localhost:5173
```

### Option 2: Vercel Dev (Production-like)
```bash
# Install Vercel CLI
npm i -g vercel

# Run
vercel dev

# Visit: http://localhost:3000
```

---

## 🌐 After Deployment

### Test These URLs

**Frontend:**
```
https://your-app.vercel.app/
https://your-app.vercel.app/analysis
https://your-app.vercel.app/comparison
```

**API:**
```
https://your-app.vercel.app/api/health
https://your-app.vercel.app/api/villages
https://your-app.vercel.app/api/villages/metadata
https://your-app.vercel.app/api/villages/compare?ids=1,2
```

**Check:**
- ✅ All pages load without 404
- ✅ Hard refresh works on SPA routes
- ✅ API returns JSON
- ✅ No CORS errors in console
- ✅ Map displays villages

---

## 🔧 API Endpoints

```javascript
GET /api/health
→ { status: 'OK', dataCount: 24, ... }

GET /api/villages
Query: ?kecamatan=BATU&indicator=jumlah_sd
→ { success: true, data: [...], kpis: {...} }

GET /api/villages/compare?ids=1,2,3
→ { success: true, data: [...], analysis: {...} }

GET /api/villages/metadata
→ { success: true, data: { totalVillages, kecamatans, ... } }
```

---

## 🐛 Quick Troubleshooting

### Build Fails
```bash
# Test build locally
cd client
npm run build
# Should create client/dist/
```

### API 404 Errors
- Check `vercel.json` rewrites
- View Function logs in Vercel Dashboard
- Test with `vercel dev` locally

### SPA Routes 404
- Verify `routes` in `vercel.json`
- Check `/(.*) → /index.html` fallback exists

### CORS Errors
- Ensure using relative `/api/*` paths
- Check headers in serverless functions
- Verify same domain in browser network tab

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| `VERCEL_SETUP_SUMMARY.md` | Complete implementation overview |
| `docs/VERCEL_DEPLOYMENT.md` | Detailed deployment guide |
| `docs/LOCAL_DEVELOPMENT.md` | Local development workflow |

---

## ✅ Pre-Flight Checklist

Before deploying:
- [ ] All files committed and pushed
- [ ] Tested locally with `vercel dev`
- [ ] Build succeeds: `cd client && npm run build`
- [ ] No hardcoded `localhost` URLs remain
- [ ] `.vercelignore` excludes unnecessary files

---

## 🎯 Success Criteria

Deployment successful when:
- ✅ Build completes without errors
- ✅ All routes render correctly
- ✅ API endpoints respond with JSON
- ✅ No CORS errors
- ✅ Maps load with village data
- ✅ Function logs show successful calls

---

**Status**: ✅ Ready to Deploy  
**Next**: Push to GitHub → Import to Vercel → Deploy  
**Time**: ~2 minutes to deploy
