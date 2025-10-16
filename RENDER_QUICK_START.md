# 🚀 Quick Start: Deploy ke Render

## TL;DR - Ringkasan Super Cepat

### 1️⃣ Deploy Backend (5 menit)
- Buka [render.com](https://render.com) → Login GitHub
- New Web Service → Pilih repo ini
- **Settings:**
  - Root Directory: `server`
  - Build: `npm install`
  - Start: `npm start`
  - Plan: Free
- Deploy! → Catat URL: `https://xxx.onrender.com`

### 2️⃣ Deploy Frontend (5 menit)
- New Static Site → Pilih repo yang sama
- **Settings:**
  - Root Directory: `client`
  - Build: `npm install && npm run build`
  - Publish: `dist`
- **Environment Variable:**
  - `VITE_API_URL` = `https://xxx.onrender.com/api` (URL backend + /api)
- Deploy! → Buka URL frontend

### 3️⃣ Done! ✅
Website live di: `https://yyy.onrender.com`

---

📖 **Panduan Lengkap:** Lihat [`docs/RENDER_DEPLOYMENT.md`](./RENDER_DEPLOYMENT.md)

⏱️ **Total waktu:** ~10-15 menit  
💰 **Biaya:** Gratis (Free Tier)  
⚠️ **Catatan:** Free tier backend akan "sleep" setelah 15 menit idle
