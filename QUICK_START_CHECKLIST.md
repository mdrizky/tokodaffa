# ✅ QUICK START CHECKLIST - TOKODAFFA

## 🎯 Checklist Setup Database Supabase

Ikuti checklist ini step-by-step. Centang (✅) setiap langkah yang sudah selesai.

---

## 📝 PERSIAPAN

- [ ] Punya akun Supabase (daftar di https://supabase.com)
- [ ] File `SUPABASE_SCHEMA.sql` sudah ada di project
- [ ] Node.js sudah terinstall (cek: `node -v`)
- [ ] npm sudah terinstall (cek: `npm -v`)

---

## 🚀 STEP 1: SETUP SUPABASE (5 menit)

### A. Buat Project
- [ ] Login ke https://supabase.com/dashboard
- [ ] Klik "New Project"
- [ ] Isi nama project: `tokodaffa`
- [ ] Isi database password (SIMPAN PASSWORD INI!)
- [ ] Pilih region: Southeast Asia (Singapore)
- [ ] Klik "Create new project"
- [ ] Tunggu 2-3 menit sampai project selesai dibuat

### B. Import Database
- [ ] Klik "SQL Editor" di sidebar
- [ ] Klik "New Query"
- [ ] Buka file `SUPABASE_SCHEMA.sql`
- [ ] Copy semua isi file (Ctrl+A, Ctrl+C)
- [ ] Paste ke SQL Editor (Ctrl+V)
- [ ] Klik "Run" atau tekan Ctrl+Enter
- [ ] Tunggu sampai selesai (10-30 detik)
- [ ] Cek tidak ada error (harusnya muncul "Success. No rows returned")

### C. Verifikasi Tabel
- [ ] Klik "Table Editor" di sidebar
- [ ] Cek ada 19 tabel (products, gold_prices, categories, dll)
- [ ] Klik tabel "products" → harusnya ada 30 produk
- [ ] Klik tabel "gold_prices" → harusnya ada 5 harga emas
- [ ] Klik tabel "categories" → harusnya ada 8 kategori

### D. Buat Storage Bucket
- [ ] Klik "Storage" di sidebar
- [ ] Klik "New Bucket"
- [ ] Nama: `images` (HARUS PERSIS INI!)
- [ ] **CENTANG "Public bucket"** ← PENTING!
- [ ] File size limit: 10 MB
- [ ] Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif, image/svg+xml`
- [ ] Klik "Create Bucket"
- [ ] Verifikasi ada label "Public" di bucket

### E. Copy Kredensial
- [ ] Klik "Settings" (⚙️) di sidebar
- [ ] Klik "API"
- [ ] Copy **Project URL** (https://xxxxx.supabase.co)
- [ ] Copy **anon public key** (eyJhbGci...)
- [ ] SIMPAN kedua kredensial ini (jangan share ke publik!)

---

## 💻 STEP 2: SETUP PROJECT LOKAL (3 menit)

### A. Clone/Download Project
- [ ] Project sudah ada di komputer
- [ ] Buka terminal di folder project

### B. Install Dependencies
```bash
npm install
```
- [ ] Jalankan command di atas
- [ ] Tunggu sampai selesai (1-2 menit)
- [ ] Tidak ada error

### C. Setup Environment Variables
```bash
cp .env.example .env.local
```
- [ ] Jalankan command di atas
- [ ] Buka file `.env.local` dengan text editor
- [ ] Ganti `NEXT_PUBLIC_SUPABASE_URL` dengan Project URL Anda
- [ ] Ganti `NEXT_PUBLIC_SUPABASE_ANON_KEY` dengan anon key Anda
- [ ] Simpan file

**Contoh isi .env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_ADMIN_PIN=240708
SITE_URL=http://localhost:3000
```

---

## ✅ STEP 3: VERIFIKASI (2 menit)

### A. Jalankan Diagnostic
```bash
node check-supabase-connection.js
```
- [ ] Jalankan command di atas
- [ ] Semua cek harusnya ✅ hijau
- [ ] Tidak ada error ❌ merah

**Jika ada error, baca output dan ikuti solusinya!**

### B. Jalankan Development Server
```bash
npm run dev
```
- [ ] Jalankan command di atas
- [ ] Tunggu sampai muncul "Ready in X.Xs"
- [ ] Muncul "Local: http://localhost:3000"

### C. Test di Browser
- [ ] Buka browser
- [ ] Akses: http://localhost:3000
- [ ] Website muncul tanpa error
- [ ] Data produk muncul (dari Supabase)

### D. Test Admin Panel
- [ ] Akses: http://localhost:3000/admin
- [ ] Masukkan PIN: `240708`
- [ ] Berhasil login
- [ ] Klik tab "Products"
- [ ] Muncul 30 produk seed data

### E. Test Tambah Produk
- [ ] Di admin panel, klik "Tambah Produk"
- [ ] Isi form:
  - Nama: Test Produk
  - Kategori: cincin
  - Kadar: 24K
  - Berat: 5
  - Harga: 5000000
  - Stok: 1
  - Upload foto atau isi URL foto
- [ ] Klik "Simpan Produk"
- [ ] Muncul notifikasi: "✅ Produk ditambahkan!"
- [ ] Produk muncul di list

### F. Verifikasi di Supabase
- [ ] Buka Supabase Dashboard
- [ ] Klik "Table Editor" → "products"
- [ ] Produk "Test Produk" ada di list
- [ ] **JIKA ADA → BERHASIL! 🎉**

---

## 🎉 SELESAI!

Jika semua checklist di atas sudah ✅, maka:

**✅ Database Supabase sudah terhubung!**
**✅ Data seed sudah ada!**
**✅ Admin panel berfungsi!**
**✅ CRUD operations berhasil!**

---

## 📋 LANGKAH SELANJUTNYA

### 1. Customize Data
- [ ] Edit store settings (nama toko, kontak, alamat)
- [ ] Update harga emas terkini
- [ ] Hapus produk seed yang tidak perlu
- [ ] Tambah produk Anda sendiri

### 2. Upload Foto Produk
- [ ] Siapkan foto produk (format: JPG, PNG, WEBP)
- [ ] Upload via admin panel
- [ ] Atau bulk upload via Supabase Storage

### 3. Kustomisasi Tampilan
- [ ] Edit logo toko
- [ ] Ubah warna tema (jika perlu)
- [ ] Sesuaikan konten halaman About
- [ ] Tambah testimoni pelanggan

### 4. Deploy ke Production
- [ ] Baca panduan: `SETUP_GUIDE.md` bagian Deploy
- [ ] Deploy ke Vercel/Netlify
- [ ] Setup custom domain
- [ ] Update environment variables di hosting

---

## 🐛 TROUBLESHOOTING

### ❌ Jika Ada Error:

**1. Data tidak tersimpan**
→ Baca: `TROUBLESHOOTING_DATABASE.md`

**2. Upload foto gagal**
→ Cek bucket 'images' sudah public?
→ Jalankan ulang bagian Storage Policies di SQL

**3. Error "relation does not exist"**
→ Tabel belum dibuat
→ Jalankan ulang SUPABASE_SCHEMA.sql

**4. Error "row-level security policy"**
→ RLS policies belum di-set
→ Jalankan bagian RLS di SUPABASE_SCHEMA.sql

**5. Koneksi gagal**
→ Cek .env.local sudah diisi dengan benar?
→ Restart server: Ctrl+C, lalu `npm run dev`

---

## 📚 DOKUMENTASI LENGKAP

- **Setup Guide:** `SETUP_GUIDE.md`
- **Import Data:** `IMPORT_DATA_GUIDE.md`
- **Cara Import DB:** `CARA_IMPORT_DATABASE.md`
- **Troubleshooting:** `TROUBLESHOOTING_DATABASE.md`
- **README:** `README.md`

---

## 📞 BUTUH BANTUAN?

Jika masih stuck:

1. **Jalankan diagnostic:**
   ```bash
   node check-supabase-connection.js
   ```

2. **Cek console browser:**
   - Tekan F12
   - Tab Console → lihat error
   - Tab Network → lihat request gagal

3. **Cek Supabase logs:**
   - Dashboard → Logs
   - Lihat error messages

4. **Baca dokumentasi:**
   - Semua file .md di project
   - Supabase docs: https://supabase.com/docs

---

## ⏱️ ESTIMASI WAKTU

- Setup Supabase: **5 menit**
- Setup Project Lokal: **3 menit**
- Verifikasi: **2 menit**
- **TOTAL: 10 menit**

---

**Selamat mencoba! 🚀**

Jika semua checklist sudah ✅, Anda siap untuk mulai customize dan deploy website Anda!
