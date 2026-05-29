# 📥 CARA IMPORT DATABASE KE SUPABASE - STEP BY STEP

## 🎯 TUJUAN
Panduan ini akan membantu Anda mengimport database lengkap (19 tabel + seed data) ke Supabase dalam 10 menit.

---

## 📋 PERSIAPAN

### Yang Anda Butuhkan:
- ✅ Akun Supabase (gratis di https://supabase.com)
- ✅ File `SUPABASE_SCHEMA.sql` (sudah ada di project ini)
- ✅ Browser (Chrome/Firefox/Edge)
- ✅ Koneksi internet

---

## 🚀 LANGKAH 1: BUAT PROJECT SUPABASE

### 1.1 Buka Supabase
```
https://supabase.com
```

### 1.2 Login atau Daftar
- Jika belum punya akun, klik **"Start your project"**
- Login dengan GitHub/Google/Email

### 1.3 Buat Project Baru
1. Klik tombol **"New Project"**
2. Isi form:
   - **Name:** `tokodaffa` (atau nama lain)
   - **Database Password:** Buat password kuat (SIMPAN INI!)
   - **Region:** Pilih yang terdekat (contoh: `Southeast Asia (Singapore)`)
   - **Pricing Plan:** Free (cukup untuk development)
3. Klik **"Create new project"**
4. **TUNGGU 2-3 MENIT** sampai project selesai dibuat (ada loading bar)

---

## 🗄️ LANGKAH 2: IMPORT DATABASE SCHEMA

### 2.1 Buka SQL Editor
1. Di dashboard Supabase, klik **"SQL Editor"** di sidebar kiri
2. Klik tombol **"New Query"**

### 2.2 Copy SQL Schema
1. Buka file `SUPABASE_SCHEMA.sql` di project ini
2. **Select All** (Ctrl+A atau Cmd+A)
3. **Copy** (Ctrl+C atau Cmd+C)

### 2.3 Paste dan Run
1. Kembali ke Supabase SQL Editor
2. **Paste** SQL schema (Ctrl+V atau Cmd+V)
3. Klik tombol **"Run"** (atau tekan Ctrl+Enter)
4. **TUNGGU** sampai selesai (10-30 detik)

### 2.4 Verifikasi Hasil
Jika berhasil, Anda akan melihat:
```
Success. No rows returned
```

**Jika ada error:**
- Baca pesan error dengan teliti
- Biasanya karena ada syntax error atau tabel sudah ada
- Jika tabel sudah ada, hapus dulu atau skip error

### 2.5 Cek Tabel Sudah Dibuat
1. Klik **"Table Editor"** di sidebar
2. Anda harusnya melihat 19 tabel:
   - ✅ about_content
   - ✅ blog_posts
   - ✅ categories
   - ✅ contact_messages
   - ✅ faqs
   - ✅ gold_prices
   - ✅ hero_slides
   - ✅ newsletters
   - ✅ partners
   - ✅ price_history
   - ✅ products
   - ✅ promos
   - ✅ reservations
   - ✅ reviews
   - ✅ services
   - ✅ store_settings
   - ✅ testimonials
   - ✅ wa_inquiries
   - ✅ why_choose_us
   - ✅ wishlist

### 2.6 Cek Data Seed
1. Klik tabel **"products"**
2. Harusnya ada **30 produk** seed data
3. Klik tabel **"gold_prices"**
4. Harusnya ada **5 harga emas** (24K, 22K, 18K, 16K, Perak)
5. Klik tabel **"categories"**
6. Harusnya ada **8 kategori**

**Jika data seed tidak ada:**
- Cek bagian INSERT di SUPABASE_SCHEMA.sql
- Mungkin ada error saat run SQL
- Coba run ulang bagian INSERT saja

---

## 📦 LANGKAH 3: BUAT STORAGE BUCKET

### 3.1 Buka Storage
1. Klik **"Storage"** di sidebar kiri
2. Klik tombol **"New Bucket"**

### 3.2 Konfigurasi Bucket
Isi form dengan:
- **Name:** `images` (HARUS PERSIS INI!)
- **Public bucket:** ✅ **CENTANG INI** (sangat penting!)
- **File size limit:** `10 MB`
- **Allowed MIME types:** 
  ```
  image/jpeg, image/png, image/webp, image/gif, image/svg+xml
  ```

### 3.3 Create Bucket
1. Klik **"Create Bucket"**
2. Bucket "images" akan muncul di list

### 3.4 Verifikasi Bucket Public
1. Klik bucket "images"
2. Pastikan ada label **"Public"** di samping nama bucket
3. Jika tidak ada, klik Settings dan centang "Public bucket"

---

## 🔑 LANGKAH 4: COPY KREDENSIAL SUPABASE

### 4.1 Buka Settings
1. Klik **"Settings"** (⚙️) di sidebar kiri bawah
2. Klik **"API"**

### 4.2 Copy Kredensial
Anda akan melihat 2 informasi penting:

**1. Project URL**
```
https://xxxxxxxxxxxxx.supabase.co
```
**COPY INI** → Akan dipakai untuk `NEXT_PUBLIC_SUPABASE_URL`

**2. anon public key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
**COPY INI** → Akan dipakai untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**⚠️ JANGAN SHARE KEY INI KE PUBLIK!**

---

## 💻 LANGKAH 5: SETUP PROJECT LOKAL

### 5.1 Copy Environment File
```bash
# Di terminal, jalankan:
cp .env.example .env.local
```

### 5.2 Edit .env.local
Buka file `.env.local` dengan text editor dan isi:

```env
# ============================================================
# SUPABASE DATABASE (WAJIB!)
# ============================================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================================
# ADMIN AUTHENTICATION
# ============================================================
NEXT_PUBLIC_ADMIN_PIN=240708

# ============================================================
# SITE CONFIGURATION
# ============================================================
SITE_URL=http://localhost:3000
```

**Ganti:**
- `https://xxxxxxxxxxxxx.supabase.co` → dengan Project URL Anda
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` → dengan anon public key Anda

### 5.3 Install Dependencies
```bash
npm install
```

### 5.4 Jalankan Development Server
```bash
npm run dev
```

Tunggu sampai muncul:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

## ✅ LANGKAH 6: VERIFIKASI KONEKSI

### 6.1 Jalankan Diagnostic Script
```bash
node check-supabase-connection.js
```

Script ini akan mengecek:
- ✅ File .env.local ada
- ✅ Kredensial Supabase sudah diisi
- ✅ Koneksi ke Supabase berhasil
- ✅ Semua tabel sudah dibuat
- ✅ Data seed ada
- ✅ Storage bucket 'images' ada

**Jika semua ✅ hijau → BERHASIL!**

### 6.2 Test di Browser
1. Buka browser
2. Akses: http://localhost:3000
3. Website harusnya muncul dengan data dari Supabase

### 6.3 Test Admin Panel
1. Akses: http://localhost:3000/admin
2. Masukkan PIN: `240708`
3. Klik **"Products"**
4. Harusnya muncul 30 produk seed data

### 6.4 Test Tambah Produk Baru
1. Di admin panel, klik **"Tambah Produk"**
2. Isi form minimal:
   - **Nama:** Test Produk Baru
   - **Kategori:** cincin
   - **Kadar:** 24K
   - **Berat:** 5
   - **Harga:** 5000000
   - **Stok:** 1
   - **Foto:** Upload gambar atau isi URL
3. Klik **"Simpan Produk"**
4. Harusnya muncul notifikasi: **"✅ Produk ditambahkan!"**

### 6.5 Verifikasi di Supabase
1. Buka Supabase Dashboard
2. Klik **"Table Editor"** → **"products"**
3. Harusnya ada produk baru "Test Produk Baru" di list
4. **JIKA ADA → BERHASIL! 🎉**

---

## 🎉 SELESAI!

Sekarang database Anda sudah terhubung dengan Supabase!

### Apa yang Sudah Anda Lakukan:
- ✅ Membuat project Supabase
- ✅ Import 19 tabel database
- ✅ Import 30+ data seed
- ✅ Setup storage bucket untuk upload foto
- ✅ Konfigurasi environment variables
- ✅ Test koneksi dan CRUD operations

### Langkah Selanjutnya:
1. **Customize Data:**
   - Edit store settings di admin panel
   - Update harga emas
   - Tambah produk Anda sendiri
   - Upload foto produk

2. **Upload Foto Produk:**
   - Baca panduan: `IMPORT_DATA_GUIDE.md`
   - Gunakan admin panel untuk upload foto
   - Atau bulk upload via Supabase Storage

3. **Deploy ke Production:**
   - Baca panduan: `SETUP_GUIDE.md` bagian Deploy
   - Deploy ke Vercel/Netlify
   - Update environment variables di platform hosting

---

## 🐛 TROUBLESHOOTING

### Masalah: Data tidak tersimpan
**Solusi:** Baca `TROUBLESHOOTING_DATABASE.md`

### Masalah: Upload foto gagal
**Cek:**
1. Bucket 'images' sudah dibuat?
2. Bucket sudah public?
3. Storage policies sudah di-set?

**Solusi:**
```sql
-- Jalankan di SQL Editor
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;
```

### Masalah: Error "relation does not exist"
**Solusi:** Tabel belum dibuat. Jalankan ulang SUPABASE_SCHEMA.sql

### Masalah: Error "row-level security policy"
**Solusi:** RLS policies belum di-set. Jalankan bagian RLS di SUPABASE_SCHEMA.sql

---

## 📞 BUTUH BANTUAN?

Jika masih ada masalah:

1. **Cek file troubleshooting:**
   - `TROUBLESHOOTING_DATABASE.md`
   - `SETUP_GUIDE.md`

2. **Jalankan diagnostic:**
   ```bash
   node check-supabase-connection.js
   ```

3. **Cek console browser:**
   - Tekan F12
   - Lihat tab Console untuk error
   - Lihat tab Network untuk request yang gagal

4. **Cek Supabase logs:**
   - Dashboard → Logs
   - Lihat error messages

---

## 📚 REFERENSI

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Project README:** `README.md`
- **Setup Guide:** `SETUP_GUIDE.md`
- **Import Guide:** `IMPORT_DATA_GUIDE.md`

---

**Selamat! Database Anda sudah siap digunakan! 🚀**
