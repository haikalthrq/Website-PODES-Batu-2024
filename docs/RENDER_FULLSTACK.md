# 🚀 Deploy Fullstack ke Render (Opsi B - Simple!)

Panduan deploy aplikasi **Website PODES Batu 2024** sebagai **satu Web Service** yang menggabungkan frontend + backend.

---

## ✨ Keuntungan Opsi Fullstack:

- ✅ **Satu URL saja** (misalnya: `https://podes-batu.onrender.com`)
- ✅ **Lebih mudah** - tidak perlu setup CORS atau environment variable
- ✅ **Gratis** - cukup 1 Web Service Render
- ✅ **Auto serve** - backend otomatis serve frontend

---

## 🔧 Arsitektur:

```
https://podes-batu.onrender.com/
  ├── / → Frontend (React build)
  ├── /api/villages → Backend API
  ├── /api/health → Backend API
  └── static files (CSS, JS, images)
```

---

## 📝 Step-by-Step Deploy

### 1️⃣ **Persiapan di GitHub**

✅ **Sudah selesai!** File-file berikut sudah diupdate:
- `package.json` (root) - Build & start scripts
- `server/server.js` - Serve static files
- `client/src/services/api.js` - Relative path `/api`
- `client/src/components/GeospatialMap.jsx` - Relative path

**Commit & push** perubahan ini ke GitHub:

```bash
git add .
git commit -m "feat: setup fullstack deployment for Render"
git push origin main
```

---

### 2️⃣ **Deploy ke Render**

#### A. Buat Web Service

1. **Buka [render.com](https://render.com)** dan login dengan GitHub

2. **Klik "New +" → "Web Service"**

3. **Connect Repository:**
   - Pilih repository: `haikalthrq/Website-PODES-Batu-2024`
   - Klik "Connect"

#### B. Konfigurasi Web Service

**Isi form dengan detail berikut:**

```
Name: podes-batu-fullstack
(atau nama bebas, akan jadi subdomain: podes-batu-fullstack.onrender.com)

Region: Singapore
(pilih yang terdekat)

Branch: main

Root Directory: (kosongkan / leave blank)

Runtime: Node

Build Command:
npm run render:build

Start Command:
npm run render:start

Plan: Free
(pilih Free tier)
```

#### C. Environment Variables (Opsional)

Tidak perlu environment variable! Karena:
- Frontend dan backend di domain yang sama
- API pakai relative path `/api`
- CORS tidak diperlukan

Tapi jika ingin lebih spesifik (opsional):

```
Key: FRONTEND_URL
Value: * (atau kosongkan)

Key: NODE_ENV
Value: production
```

#### D. Deploy!

4. **Klik "Create Web Service"**

5. **Tunggu proses deployment** (±10-15 menit pertama kali):
   - Installing dependencies...
   - Building frontend...
   - Starting server...
   - Status: "Live" ✅

6. **URL Final:** `https://podes-batu-fullstack.onrender.com`

---

## ✅ Testing

Setelah status "Live", test website Anda:

### Test Checklist:

- [ ] **Buka URL:** `https://podes-batu-fullstack.onrender.com`
- [ ] **Landing page muncul** - hero section terlihat
- [ ] **Klik "Mulai Analisis"** - redirect ke dashboard
- [ ] **Data KPI Cards muncul** - lihat angka statistik
- [ ] **Chart/grafik muncul** - bars, lines, donut charts
- [ ] **Filter berfungsi** - pilih kategori, kecamatan, desa
- [ ] **Peta geospasial muncul** - map interaktif di mode peta
- [ ] **Tidak ada error di Console** - tekan F12 untuk check

### Test API Endpoint:

- **Health Check:** `https://podes-batu-fullstack.onrender.com/api/health`
  - Harus return: `{"status": "OK", ...}`
  
- **Villages Data:** `https://podes-batu-fullstack.onrender.com/api/villages`
  - Harus return: `{"success": true, "data": [...], ...}`

---

## 🐛 Troubleshooting

### ❌ Build Failed

**Error:** `npm ERR! missing script: render:build`

**Solusi:**
- Pastikan file `package.json` di root sudah ada script `render:build` dan `render:start`
- Commit dan push lagi ke GitHub
- Trigger manual deploy di Render dashboard

---

### ❌ Frontend Tidak Muncul (Blank Page)

**Penyebab:** Build folder tidak ditemukan

**Solusi:**
1. Check logs di Render dashboard
2. Pastikan build command: `npm run render:build`
3. Pastikan build berhasil (no errors)
4. Check apakah folder `client/dist` dibuat saat build

**Debugging:**
- Buka Network tab (F12) di browser
- Check apakah file `.js` dan `.css` ke-load
- Check Console untuk error messages

---

### ❌ API Call Failed

**Error di Console:** `GET /api/villages 404 Not Found`

**Solusi:**
1. Test API endpoint langsung di browser: `/api/health`
2. Check server logs di Render dashboard
3. Pastikan server start command: `npm run render:start`
4. Pastikan `server/server.js` sudah load data PODES

---

### ⏱️ Website Lambat / Cold Start

**Gejala:** Loading 30-60 detik pertama kali dibuka

**Penyebab:** Render Free Tier "sleep" setelah 15 menit idle

**Solusi (Opsional):**
1. Gunakan uptime monitoring (misalnya [UptimeRobot](https://uptimerobot.com))
2. Ping URL setiap 10-14 menit agar tidak sleep
3. Atau upgrade ke Render Paid Plan ($7/month)

**Ini normal untuk free tier!** User pertama akan tunggu, user kedua langsung cepat.

---

## 🔄 Update Website

Setelah deploy, setiap kali Anda push ke GitHub:

1. **Edit code** di local
2. **Commit:**
   ```bash
   git add .
   git commit -m "fix: update fitur XYZ"
   git push origin main
   ```
3. **Auto Deploy** - Render otomatis re-build & re-deploy!
4. **Tunggu ±5-10 menit** untuk proses selesai

---

## 📊 Monitoring

### Di Render Dashboard:

- **Logs:** Real-time server logs
- **Metrics:** CPU, Memory usage (basic)
- **Events:** Deploy history
- **Settings:** Re-deploy manual, environment variables

---

## 💡 Tips & Best Practices

### 1. Custom Domain (Opsional)
- Setting → Custom Domains → Add your domain
- Update DNS CNAME record
- **Gratis!** Tidak ada biaya tambahan

### 2. HTTPS
- ✅ **Sudah otomatis!** Render include SSL certificate gratis

### 3. Performance
- Frontend sudah di-compress (Vite build optimization)
- Backend pakai `compression` middleware
- Static files di-cache otomatis

### 4. Security
- ✅ Helmet.js untuk security headers
- ✅ HTTPS by default
- ✅ Environment variables aman (tidak ter-expose)

---

## 🆚 Perbandingan: Fullstack vs Split Deployment

| Aspek | Fullstack (Opsi B) | Split (Opsi A) |
|-------|-------------------|----------------|
| **URL** | 1 URL | 2 URL berbeda |
| **Setup** | ✅ Lebih mudah | Butuh env variable |
| **CORS** | ✅ Tidak perlu | Harus setup |
| **Cost** | 🆓 1 Service | 🆓 2 Services |
| **Maintenance** | ✅ Lebih simple | Lebih fleksibel |
| **Cold Start** | 1x (±30s) | 2x (backend + frontend) |
| **Scaling** | Monolith | Microservices |

**Rekomendasi:** Fullstack untuk project ini karena lebih simple!

---

## 📞 Support

Jika ada masalah:

1. **Check Logs:** Render Dashboard → Logs tab
2. **Browser Console:** F12 → Console tab
3. **Network Tab:** F12 → Network tab
4. **Render Status:** [status.render.com](https://status.render.com)

---

## 🎉 Done!

Website Anda sudah live di internet! Share URL ke:
- Tim BPS Kota Batu
- Dosen pembimbing
- Public (jika diizinkan)

**URL Final:** `https://podes-batu-fullstack.onrender.com`

---

**Created:** October 17, 2025  
**Project:** Website PODES Batu 2024  
**Team:** BPS Kota Batu - Tim PKL  
**Deployment:** Render Fullstack (Opsi B)
