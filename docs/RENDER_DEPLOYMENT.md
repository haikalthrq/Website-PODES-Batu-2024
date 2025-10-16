# 🚀 Panduan Deploy ke Render

Panduan lengkap untuk deploy aplikasi **Website PODES Batu 2024** ke Render.com.

## 📋 Arsitektur Deployment

- **Backend (Express.js)** → Render Web Service
- **Frontend (Vite React)** → Render Static Site

---

## 🔧 PART 1: Deploy Backend (Express API)

### 1️⃣ Persiapan

✅ **Sudah selesai:**
- CORS configuration sudah diupdate
- Server sudah menggunakan `process.env.PORT`
- Data JSON sudah di folder `server/data/`

### 2️⃣ Deploy ke Render

1. **Buka [Render.com](https://render.com)** dan login/daftar dengan GitHub

2. **Klik "New +" → "Web Service"**

3. **Connect Repository:**
   - Pilih repository: `haikalthrq/Website-PODES-Batu-2024`
   - Klik "Connect"

4. **Konfigurasi Web Service:**
   ```
   Name: podes-batu-api (atau nama bebas)
   Region: Singapore (terdekat)
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Plan:**
   - Pilih **"Free"** (gratis)

6. **Environment Variables:** (Opsional)
   - Klik "Advanced" → "Add Environment Variable"
   ```
   Key: FRONTEND_URL
   Value: https://podes-batu.onrender.com (isi setelah frontend deploy)
   ```
   - Atau biarkan kosong dulu (CORS set ke `*` secara default)

7. **Klik "Create Web Service"**

8. **Tunggu deployment selesai** (±5-10 menit pertama kali)
   - Status akan berubah jadi "Live" dengan badge hijau
   - URL backend Anda: `https://podes-batu-api.onrender.com`

9. **Test Backend:**
   - Buka: `https://podes-batu-api.onrender.com/api/health`
   - Buka: `https://podes-batu-api.onrender.com/api/villages`
   - Harus return data JSON

⚠️ **CATAT URL BACKEND INI** - akan dipakai untuk frontend!

---

## 🎨 PART 2: Deploy Frontend (Vite React)

### 1️⃣ Persiapan

✅ **Sudah selesai:**
- API URL sudah menggunakan environment variable
- File `.env.example` sudah dibuat

### 2️⃣ Deploy ke Render

1. **Klik "New +" → "Static Site"**

2. **Connect Repository:**
   - Pilih repository yang sama: `haikalthrq/Website-PODES-Batu-2024`
   - Klik "Connect"

3. **Konfigurasi Static Site:**
   ```
   Name: podes-batu (atau nama bebas)
   Region: Singapore
   Branch: main
   Root Directory: client
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Environment Variables:**
   - Klik "Advanced" → "Add Environment Variable"
   ```
   Key: VITE_API_URL
   Value: https://podes-batu-api.onrender.com/api
   ```
   ⚠️ **Ganti dengan URL backend Anda dari Part 1 Step 9!**
   ⚠️ **Jangan lupa tambahin `/api` di akhir!**

5. **Klik "Create Static Site"**

6. **Tunggu deployment selesai** (±3-5 menit)
   - Status akan berubah jadi "Live"
   - URL frontend Anda: `https://podes-batu.onrender.com`

7. **Test Website:**
   - Buka URL frontend
   - Cek apakah data muncul
   - Cek console browser untuk error (F12)

---

## 🔄 Update CORS Backend (Opsional tapi Recommended)

Setelah frontend deploy, update CORS backend agar lebih aman:

1. **Buka dashboard backend di Render**
2. **Go to "Environment"**
3. **Add/Edit variable:**
   ```
   Key: FRONTEND_URL
   Value: https://podes-batu.onrender.com
   ```
   ⚠️ **Ganti dengan URL frontend Anda!**

4. **Save Changes** → Backend akan auto-redeploy

---

## ✅ Checklist Testing

Setelah deploy selesai, test ini:

- [ ] Backend health check: `https://your-backend.onrender.com/api/health`
- [ ] Backend API villages: `https://your-backend.onrender.com/api/villages`
- [ ] Frontend bisa dibuka
- [ ] Data KPI Cards muncul
- [ ] Chart/grafik muncul
- [ ] Filter berfungsi
- [ ] Peta geospasial muncul dan interactive
- [ ] Tidak ada error di Console (F12)

---

## 🐛 Troubleshooting

### Backend tidak deploy:
- Check build logs di Render dashboard
- Pastikan `Root Directory: server` benar
- Pastikan `package.json` ada di folder `server/`

### Frontend tidak muncul data:
- Check console browser (F12)
- Pastikan `VITE_API_URL` benar (ada `/api` di akhir)
- Pastikan backend sudah live dan bisa diakses
- Check CORS error → pastikan backend CORS allow frontend URL

### "Service Unavailable" di Render Free Tier:
- Render free tier "sleep" setelah 15 menit tidak ada traffic
- Saat pertama dibuka akan lambat (cold start ±30 detik)
- Ini normal untuk free tier

---

## 🔗 URL Final

Setelah selesai deploy, Anda akan punya 2 URL:

- **Backend API**: `https://podes-batu-api.onrender.com`
- **Frontend Website**: `https://podes-batu.onrender.com`

Share URL frontend ke user! 🎉

---

## 💡 Tips

1. **Custom Domain:** Bisa add custom domain di Render (gratis)
2. **Auto Deploy:** Setiap push ke GitHub main branch = auto redeploy
3. **Logs:** Bisa lihat logs realtime di dashboard Render
4. **Monitoring:** Render free tier punya basic metrics

---

## 📝 Catatan Penting

- ⚠️ **Render Free Tier Limitations:**
  - Backend "sleep" after 15 min idle (cold start ~30s)
  - 750 hours/month (cukup untuk 1 service 24/7)
  - Untuk 2 services (backend + frontend): backend might sleep

- ✅ **Solution:** Gunakan uptime monitoring (misalnya: UptimeRobot) untuk ping backend setiap 10-14 menit agar tetap awake

---

**Created:** October 17, 2025  
**Project:** Website PODES Batu 2024  
**Team:** BPS Kota Batu - Tim PKL
