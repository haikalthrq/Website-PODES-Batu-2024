# 🚀 Quick Deploy: Fullstack ke Render

## Super Simple - 10 Menit! ⏱️

### 1️⃣ Push ke GitHub
```bash
git add .
git commit -m "feat: setup fullstack deployment"
git push origin main
```

### 2️⃣ Deploy di Render
1. Buka [render.com](https://render.com) → Login GitHub
2. **New Web Service** → Pilih repo ini
3. **Settings:**
   - Name: `podes-batu-fullstack`
   - Root Directory: **(kosongkan)**
   - Build Command: `npm run render:build`
   - Start Command: `npm run render:start`
   - Plan: **Free**
4. **Create Web Service**
5. Tunggu ±10-15 menit
6. ✅ **Done!** → Buka URL: `https://podes-batu-fullstack.onrender.com`

---

## 🎯 Yang Sudah Otomatis:

✅ Build frontend (Vite React)  
✅ Start backend (Express)  
✅ Serve frontend dari backend  
✅ API di `/api/*`  
✅ HTTPS gratis  
✅ No CORS issues!  

---

## 📖 Panduan Lengkap
Lihat: [`docs/RENDER_FULLSTACK.md`](./RENDER_FULLSTACK.md)

---

**Total Setup:** ~10-15 menit  
**Total Cost:** 🆓 GRATIS!  
**Maintenance:** Auto-deploy setiap push GitHub
