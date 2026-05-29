# 🚀 PANDUAN SETUP LENGKAP - TOKO MAS DAFFA

## 📋 Daftar Isi
1. [Persiapan Awal](#persiapan-awal)
2. [Setup Supabase Database](#setup-supabase-database)
3. [Setup Project Lokal](#setup-project-lokal)
4. [Upload Foto Produk](#upload-foto-produk)
5. [Konfigurasi Admin](#konfigurasi-admin)
6. [Deploy ke Vercel](#deploy-ke-vercel)
7. [Troubleshooting](#troubleshooting)

---

## 1️⃣ Persiapan Awal

### Yang Anda Butuhkan:
- ✅ Akun Supabase (gratis) - [Daftar di sini](https://supabase.com)
- ✅ Node.js versi 18+ - [Download](https://nodejs.org)
- ✅ Git (opsional) - [Download](https://git-scm.com)
- ✅ Foto produk perhiasan (format: JPG, PNG, WEBP)

---

## 2️⃣ Setup Supabase Database

### Langkah 1: Buat Project Baru
1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Klik **"New Project"**
3. Isi:
   - **Name**: `tokodaffa-gold`
   - **Database Password**: (simpan password ini!)
   - **Region**: Singapore (terdekat dengan Indonesia)
4. Klik **"Create new project"** (tunggu 2-3 menit)

### Langkah 2: Jalankan SQL Schema
1. Di Supabase Dashboard, buka **SQL Editor** (sidebar kiri)
2. Klik **"New query"**
3. Buka file `SUPABASE_SCHEMA.sql` di project ini
4. **Copy SEMUA isi file** dan paste ke SQL Editor
5. Klik **"Run"** (tombol hijau di kanan atas)
6. Tunggu sampai muncul **"Success. No rows returned"**

✅ **Database sudah siap!** Semua tabel, data awal, dan policies sudah dibuat.

### Langkah 3: Buat Storage Bucket untuk Foto
1. Di Supabase Dashboard, buka **Storage** (sidebar kiri)
2. Klik **"New bucket"**
3. Isi:
   - **Name**: `images`
   - **Public bucket**: ✅ **CENTANG INI** (penting!)
4. Klik **"Create bucket"**

### Langkah 4: Ambil API Keys
1. Di Supabase Dashboard, buka **Settings** > **API**
2. Copy 2 nilai ini:
   - **Project URL** (contoh: `https://abc123.supabase.co`)
   - **anon public** key (key yang panjang)
3. Simpan di notepad, akan dipakai nanti

---

## 3️⃣ Setup Project Lokal

### Langkah 1: Install Dependencies
```bash
cd /home/daffarizky/tokodaffa
npm install
```

### Langkah 2: Buat File Environment
```bash
cp .env.example .env.local
```

### Langkah 3: Edit .env.local
Buka file `.env.local` dan isi:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_ADMIN_PIN=240708
```

**Ganti** `abc123.supabase.co` dan key dengan nilai yang Anda copy tadi.

### Langkah 4: Jalankan Development Server
```bash
npm run dev
```

Buka browser: **http://localhost:3000**

✅ **Website sudah jalan!**

---

## 4️⃣ Upload Foto Produk

### Cara 1: Via Admin Panel (Recommended)
1. Buka **http://localhost:3000/admin**
2. Login dengan PIN: **240708**
3. Klik menu **"Produk"**
4. Klik **"Edit"** pada produk yang ingin diubah
5. Klik tombol **"📁 Upload Foto Utama"**
6. Pilih foto produk (max 10MB)
7. Tunggu sampai foto terupload
8. Klik **"💾 Update Produk"**

### Cara 2: Upload Manual ke Supabase Storage
1. Buka Supabase Dashboard > **Storage** > **images**
2. Buat folder baru: **products**
3. Upload semua foto produk ke folder `products/`
4. Copy URL foto (klik foto > Copy URL)
5. Paste URL ke field **"Foto Utama"** di admin panel

### Tips Foto Produk:
- ✅ Resolusi minimal: 800x800px
- ✅ Format: JPG, PNG, WEBP
- ✅ Ukuran max: 10MB per foto
- ✅ Background putih/bersih lebih baik
- ✅ Foto dari berbagai sudut (gunakan galeri foto)

---

## 5️⃣ Konfigurasi Admin

### Ganti PIN Admin
1. Buka Supabase Dashboard > **Table Editor** > **store_settings**
2. Edit row pertama
3. Ubah field **admin_pin** ke PIN baru Anda
4. Klik **Save**

### Update Informasi Toko
1. Login ke admin panel: **http://localhost:3000/admin**
2. Klik menu **"Pengaturan Toko"**
3. Isi semua informasi:
   - Nama toko
   - WhatsApp (format: 6281234567890)
   - Email, alamat, jam operasional
   - Link sosial media
4. Klik **"💾 Simpan Pengaturan"**

### Update Harga Emas
1. Di admin panel, klik menu **"Harga Emas"**
2. Update harga beli dan jual untuk setiap kadar
3. Klik **"💾 Perbarui Harga"**

---

## 6️⃣ Deploy ke Vercel

### Langkah 1: Push ke GitHub (jika belum)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/tokodaffa.git
git push -u origin main
```

### Langkah 2: Deploy ke Vercel
1. Login ke [Vercel](https://vercel.com)
2. Klik **"Add New"** > **"Project"**
3. Import repository GitHub Anda
4. Di **Environment Variables**, tambahkan:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   NEXT_PUBLIC_ADMIN_PIN=240708
   SITE_URL=https://tokodaffa.vercel.app
   ```
5. Klik **"Deploy"**
6. Tunggu 2-3 menit

✅ **Website sudah online!**

---

## 7️⃣ Troubleshooting

### ❌ Error: "Failed to fetch products"
**Solusi:**
- Pastikan `.env.local` sudah diisi dengan benar
- Restart development server: `Ctrl+C` lalu `npm run dev`
- Cek Supabase Dashboard > Table Editor > products (harus ada data)

### ❌ Error: "Upload failed"
**Solusi:**
- Pastikan bucket `images` sudah dibuat dan **public**
- Cek Storage policies sudah jalan (lihat SUPABASE_SCHEMA.sql)
- Ukuran file max 10MB

### ❌ Admin PIN tidak bisa login
**Solusi:**
- Cek `.env.local` > `NEXT_PUBLIC_ADMIN_PIN`
- Atau cek Supabase > store_settings > admin_pin
- Default PIN: **240708**

### ❌ Foto produk tidak muncul
**Solusi:**
- Pastikan URL foto benar (harus dimulai dengan `https://`)
- Cek bucket `images` di Supabase Storage
- Pastikan bucket **public** (centang saat buat bucket)

### ❌ Harga emas tidak update
**Solusi:**
- Update manual di Admin > Harga Emas
- Atau isi `GOLD_API_KEY` di `.env.local` untuk auto-update

---

## 📞 Butuh Bantuan?

Jika masih ada masalah:
1. Cek file `ANALISIS_LENGKAP.md` untuk detail fitur
2. Cek file `IMPLEMENTATION_PLAN.md` untuk roadmap
3. Buka issue di GitHub repository

---

**Selamat! Website Toko Mas Daffa sudah siap digunakan! 🎉**
