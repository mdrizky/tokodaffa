# 👣 LANGKAH DEMI LANGKAH - SETUP DATABASE SUPABASE

## 🎯 PANDUAN SUPER DETAIL UNTUK PEMULA

Dokumen ini akan memandu Anda **langkah demi langkah** dengan sangat detail, bahkan jika Anda baru pertama kali menggunakan Supabase!

---

## 📍 BAGIAN 1: PERSIAPAN (5 MENIT)

### Langkah 1.1: Cek Requirement

Buka terminal dan jalankan command ini satu per satu:

```bash
# Cek Node.js terinstall
node -v
# Harusnya muncul: v18.x.x atau v20.x.x
```

✅ **Jika muncul versi:** Lanjut ke langkah berikutnya
❌ **Jika error:** Install Node.js dari https://nodejs.org

```bash
# Cek npm terinstall
npm -v
# Harusnya muncul: 9.x.x atau 10.x.x
```

✅ **Jika muncul versi:** Lanjut ke langkah berikutnya
❌ **Jika error:** Install npm (biasanya sudah include dengan Node.js)

```bash
# Cek lokasi project
pwd
# Harusnya muncul: /home/daffarizky/tokodaffa
```

✅ **Jika benar:** Lanjut ke langkah berikutnya
❌ **Jika salah:** Pindah ke folder project dengan `cd /home/daffarizky/tokodaffa`

---

### Langkah 1.2: Buat Akun Supabase (Jika Belum Punya)

1. **Buka browser** (Chrome/Firefox/Edge)

2. **Akses website Supabase:**
   ```
   https://supabase.com
   ```

3. **Klik tombol "Start your project"** (pojok kanan atas)

4. **Pilih metode sign up:**
   - **GitHub** (Recommended) - Klik "Continue with GitHub"
   - **Google** - Klik "Continue with Google"
   - **Email** - Masukkan email dan password

5. **Verifikasi email** (jika pakai email)
   - Cek inbox email Anda
   - Klik link verifikasi
   - Kembali ke Supabase

6. **Selesai!** Anda sekarang punya akun Supabase

---

## 📍 BAGIAN 2: BUAT PROJECT SUPABASE (10 MENIT)

### Langkah 2.1: Buat Project Baru

1. **Di dashboard Supabase, klik tombol "New Project"**
   - Tombol hijau besar di tengah (jika project pertama)
   - Atau tombol "+ New Project" di sidebar

2. **Isi form Create Project:**

   **Name:**
   ```
   tokodaffa
   ```
   💡 Atau nama lain yang Anda suka

   **Database Password:**
   ```
   [Buat password kuat, minimal 12 karakter]
   Contoh: TokoDaffa2024!Secure
   ```
   ⚠️ **PENTING: SIMPAN PASSWORD INI!**
   - Copy ke notepad
   - Atau simpan di password manager
   - Anda akan butuh ini nanti

   **Region:**
   ```
   Southeast Asia (Singapore)
   ```
   💡 Pilih region terdekat untuk performa terbaik

   **Pricing Plan:**
   ```
   ⚪ Free (Pilih ini)
   ```
   💡 Free tier cukup untuk development dan small traffic

3. **Klik tombol "Create new project"**

4. **TUNGGU 2-3 MENIT**
   - Supabase sedang setup database Anda
   - Anda akan lihat loading bar
   - Jangan tutup browser!

5. **Project siap!**
   - Anda akan diarahkan ke dashboard project
   - Lihat sidebar kiri dengan menu-menu

---

### Langkah 2.2: Import Database Schema

1. **Klik "SQL Editor" di sidebar kiri**
   - Icon: 🔍
   - Posisi: Di bawah "Table Editor"

2. **Klik tombol "+ New Query"**
   - Tombol di pojok kanan atas
   - Akan muncul editor SQL kosong

3. **Buka file SUPABASE_SCHEMA.sql di project Anda**
   
   **Di terminal:**
   ```bash
   # Buka dengan text editor favorit
   nano SUPABASE_SCHEMA.sql
   # atau
   code SUPABASE_SCHEMA.sql
   # atau
   cat SUPABASE_SCHEMA.sql
   ```

4. **Copy SEMUA isi file SUPABASE_SCHEMA.sql**
   - Tekan Ctrl+A (Select All)
   - Tekan Ctrl+C (Copy)

5. **Kembali ke Supabase SQL Editor**

6. **Paste SQL schema**
   - Klik di area editor
   - Tekan Ctrl+V (Paste)
   - Anda akan lihat banyak SQL code

7. **Klik tombol "Run"** atau tekan **Ctrl+Enter**

8. **TUNGGU 10-30 DETIK**
   - SQL sedang dijalankan
   - Anda akan lihat loading

9. **Cek hasil:**
   
   ✅ **Jika berhasil:**
   ```
   Success. No rows returned
   Execution time: 2.3s
   ```
   → Lanjut ke langkah berikutnya

   ❌ **Jika error:**
   ```
   Error: [pesan error]
   ```
   → Baca pesan error dengan teliti
   → Biasanya karena:
   - Tabel sudah ada (aman, skip saja)
   - Syntax error (cek copy paste lengkap)
   - Permission error (cek akun Anda)

---

### Langkah 2.3: Verifikasi Tabel Sudah Dibuat

1. **Klik "Table Editor" di sidebar kiri**
   - Icon: 📊
   - Posisi: Di atas "SQL Editor"

2. **Lihat daftar tabel di sidebar kiri**
   
   Anda harusnya melihat **19 tabel:**
   ```
   ✅ about_content
   ✅ blog_posts
   ✅ categories
   ✅ contact_messages
   ✅ faqs
   ✅ gold_prices
   ✅ hero_slides
   ✅ newsletters
   ✅ partners
   ✅ price_history
   ✅ products
   ✅ promos
   ✅ reservations
   ✅ reviews
   ✅ services
   ✅ store_settings
   ✅ testimonials
   ✅ wa_inquiries
   ✅ why_choose_us
   ✅ wishlist
   ```

3. **Klik tabel "products"**

4. **Cek data seed:**
   - Anda harusnya melihat **30 produk**
   - Dengan nama seperti:
     - Cincin Emas Polos Classic 24K
     - Gelang Emas Rantai Italia 22K
     - Kalung Emas Liontin Hati 18K
     - dll

5. **Klik tabel "gold_prices"**

6. **Cek harga emas:**
   - Anda harusnya melihat **5 harga:**
     - 24K
     - 22K
     - 18K
     - 16K
     - Perak

✅ **Jika semua ada:** Database berhasil diimport!
❌ **Jika kosong:** Jalankan ulang SQL schema

---

### Langkah 2.4: Buat Storage Bucket

1. **Klik "Storage" di sidebar kiri**
   - Icon: 📦
   - Posisi: Di bawah "Database"

2. **Klik tombol "+ New Bucket"**
   - Tombol hijau di pojok kanan atas

3. **Isi form Create Bucket:**

   **Name:**
   ```
   images
   ```
   ⚠️ **HARUS PERSIS "images"** (huruf kecil semua, tanpa spasi)

   **Public bucket:**
   ```
   ☑️ CENTANG INI!
   ```
   ⚠️ **SANGAT PENTING!** Bucket harus public agar foto bisa diakses

   **File size limit:**
   ```
   10 MB
   ```
   💡 Cukup untuk foto produk

   **Allowed MIME types:**
   ```
   image/jpeg, image/png, image/webp, image/gif, image/svg+xml
   ```
   💡 Copy paste ini persis

4. **Klik tombol "Create bucket"**

5. **Verifikasi bucket:**
   - Anda akan lihat bucket "images" di list
   - Ada label **"Public"** di sampingnya
   - Jika tidak ada label "Public", klik bucket → Settings → Centang "Public bucket"

✅ **Jika ada label "Public":** Bucket berhasil dibuat!

---

### Langkah 2.5: Copy Kredensial Supabase

1. **Klik icon "Settings" (⚙️) di sidebar kiri bawah**

2. **Klik "API" di menu Settings**

3. **Anda akan lihat 2 informasi penting:**

   **A. Project URL:**
   ```
   https://abcdefghijk.supabase.co
   ```
   - Klik icon 📋 untuk copy
   - Paste ke notepad
   - Label: "SUPABASE_URL"

   **B. anon public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1NjcwMDAsImV4cCI6MjAwNTEyMzAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   - Klik icon 📋 untuk copy
   - Paste ke notepad
   - Label: "SUPABASE_ANON_KEY"

   **C. service_role secret:**
   ```
   ⚠️ JANGAN COPY INI!
   ```
   - Ini untuk server-side only
   - Berbahaya jika dipakai di frontend

4. **Simpan kedua kredensial ini:**
   ```
   SUPABASE_URL: https://abcdefghijk.supabase.co
   SUPABASE_ANON_KEY: eyJhbGci...
   ```

✅ **Kredensial sudah di-copy!** Lanjut ke setup project lokal

---

## 📍 BAGIAN 3: SETUP PROJECT LOKAL (5 MENIT)

### Langkah 3.1: Copy Environment File

1. **Buka terminal di folder project**
   ```bash
   cd /home/daffarizky/tokodaffa
   ```

2. **Copy file .env.example menjadi .env.local**
   ```bash
   cp .env.example .env.local
   ```

3. **Verifikasi file berhasil di-copy:**
   ```bash
   ls -la | grep .env
   ```
   
   Anda harusnya melihat:
   ```
   .env.example
   .env.local
   ```

✅ **Jika kedua file ada:** Lanjut ke langkah berikutnya

---

### Langkah 3.2: Edit File .env.local

1. **Buka file .env.local dengan text editor:**
   ```bash
   nano .env.local
   ```
   
   Atau jika pakai VS Code:
   ```bash
   code .env.local
   ```

2. **Anda akan lihat isi file seperti ini:**
   ```env
   # ============================================================
   # SUPABASE DATABASE (WAJIB!)
   # ============================================================
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   
   # ============================================================
   # ADMIN AUTHENTICATION
   # ============================================================
   NEXT_PUBLIC_ADMIN_PIN=240708
   
   # ============================================================
   # SITE CONFIGURATION
   # ============================================================
   SITE_URL=http://localhost:3000
   ```

3. **Edit baris NEXT_PUBLIC_SUPABASE_URL:**
   
   **Dari:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   ```
   
   **Menjadi:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
   ```
   💡 Ganti dengan Project URL Anda dari notepad

4. **Edit baris NEXT_PUBLIC_SUPABASE_ANON_KEY:**
   
   **Dari:**
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   **Menjadi:**
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   💡 Ganti dengan anon key Anda dari notepad (key yang panjang)

5. **Simpan file:**
   - **Nano:** Tekan Ctrl+X, lalu Y, lalu Enter
   - **VS Code:** Tekan Ctrl+S

6. **Verifikasi isi file:**
   ```bash
   cat .env.local
   ```
   
   Pastikan:
   - ✅ URL sudah diganti (bukan "your-project-id" lagi)
   - ✅ Key sudah diganti (bukan "your-anon-key-here" lagi)
   - ✅ Tidak ada spasi di awal/akhir

✅ **Jika sudah benar:** Lanjut ke langkah berikutnya

---

### Langkah 3.3: Install Dependencies

1. **Jalankan npm install:**
   ```bash
   npm install
   ```

2. **TUNGGU 1-2 MENIT**
   - npm sedang download dependencies
   - Anda akan lihat progress bar
   - Jangan tutup terminal!

3. **Cek hasil:**
   
   ✅ **Jika berhasil:**
   ```
   added 234 packages in 45s
   ```
   
   ❌ **Jika error:**
   - Cek koneksi internet
   - Coba jalankan ulang: `npm install`
   - Atau hapus node_modules: `rm -rf node_modules && npm install`

✅ **Dependencies terinstall!** Lanjut ke langkah berikutnya

---

### Langkah 3.4: Jalankan Development Server

1. **Jalankan server:**
   ```bash
   npm run dev
   ```

2. **TUNGGU 5-10 DETIK**
   - Next.js sedang compile
   - Anda akan lihat loading

3. **Cek hasil:**
   
   ✅ **Jika berhasil:**
   ```
   ▲ Next.js 16.2.4
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.100:3000
   
   ✓ Ready in 2.5s
   ```
   
   ❌ **Jika error:**
   - Baca pesan error
   - Biasanya karena port 3000 sudah dipakai
   - Solusi: Tutup aplikasi yang pakai port 3000

✅ **Server berjalan!** Jangan tutup terminal ini

---

## 📍 BAGIAN 4: VERIFIKASI (5 MENIT)

### Langkah 4.1: Jalankan Diagnostic Script

1. **Buka terminal BARU** (jangan tutup yang lama)

2. **Pindah ke folder project:**
   ```bash
   cd /home/daffarizky/tokodaffa
   ```

3. **Jalankan diagnostic:**
   ```bash
   node check-supabase-connection.js
   ```

4. **Lihat output:**
   
   ✅ **Jika semua hijau:**
   ```
   ✅ File .env.local ditemukan
   ✅ Supabase URL: https://abcdefghijk.supabase.co
   ✅ Supabase Key: eyJhbGci... (ada isinya)
   ✅ Koneksi ke Supabase BERHASIL!
   ✅ Semua 19 tabel ditemukan!
   ✅ Data seed ditemukan
   ✅ Bucket "images" ditemukan
   
   ✅ DIAGNOSTIC SELESAI - SEMUA OK!
   ```
   → **BERHASIL!** Lanjut ke langkah berikutnya
   
   ❌ **Jika ada merah:**
   - Baca pesan error
   - Ikuti solusi yang diberikan
   - Jalankan ulang diagnostic

---

### Langkah 4.2: Test di Browser

1. **Buka browser** (Chrome/Firefox/Edge)

2. **Akses website:**
   ```
   http://localhost:3000
   ```

3. **Anda harusnya melihat:**
   - Homepage TokoDaffa Gold
   - Banner/hero section
   - Produk-produk emas
   - Harga emas
   - Footer dengan kontak

4. **Cek produk:**
   - Scroll ke bawah
   - Lihat produk-produk
   - Klik salah satu produk
   - Harusnya buka detail produk

✅ **Jika website muncul dengan produk:** Data dari Supabase berhasil!

---

### Langkah 4.3: Login Admin Panel

1. **Akses admin panel:**
   ```
   http://localhost:3000/admin
   ```

2. **Anda akan lihat form login:**
   - Input PIN
   - Tombol Login

3. **Masukkan PIN:**
   ```
   240708
   ```

4. **Klik tombol "Login"**

5. **Anda harusnya masuk ke dashboard admin:**
   - Menu: Dashboard, Products, Gold Prices, dll
   - Statistics cards
   - Tabel data

✅ **Jika berhasil login:** Admin panel berfungsi!

---

### Langkah 4.4: Test Tambah Produk

1. **Di admin panel, klik menu "Products"**

2. **Klik tombol "➕ Tambah Produk"**

3. **Isi form produk:**
   - **Nama:** Test Produk Baru
   - **Kategori:** cincin
   - **Kadar:** 24K
   - **Berat:** 5
   - **Harga:** 5000000
   - **Stok:** 1
   - **Foto:** https://via.placeholder.com/400

4. **Klik tombol "💾 Simpan Produk"**

5. **Lihat notifikasi:**
   
   ✅ **Jika muncul:**
   ```
   ✅ Produk ditambahkan!
   ```
   → **BERHASIL!**
   
   ❌ **Jika error:**
   - Baca pesan error
   - Cek console browser (F12)
   - Baca TROUBLESHOOTING_DATABASE.md

---

### Langkah 4.5: Verifikasi di Supabase

1. **Buka Supabase Dashboard di browser**

2. **Klik "Table Editor"**

3. **Klik tabel "products"**

4. **Cek data:**
   - Harusnya ada **31 produk** sekarang (30 seed + 1 baru)
   - Produk "Test Produk Baru" ada di list
   - Dengan harga 5000000

✅ **Jika produk baru ada:** DATABASE TERHUBUNG SEMPURNA!

---

## 🎉 SELESAI!

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              ✅ SETUP BERHASIL 100%! 🎉                   ║
║                                                            ║
║  ✅ Supabase project dibuat                               ║
║  ✅ Database schema diimport (19 tabel)                   ║
║  ✅ Storage bucket dibuat (public)                        ║
║  ✅ Environment variables diisi                           ║
║  ✅ Dependencies terinstall                               ║
║  ✅ Development server berjalan                           ║
║  ✅ Diagnostic test passed                                ║
║  ✅ Website berfungsi                                     ║
║  ✅ Admin panel berfungsi                                 ║
║  ✅ CRUD operations berhasil                              ║
║  ✅ Data tersimpan di Supabase                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 📋 CHECKLIST FINAL

- [x] Akun Supabase dibuat
- [x] Project Supabase dibuat
- [x] Database schema diimport
- [x] 19 tabel dibuat
- [x] 30+ data seed ada
- [x] Storage bucket 'images' dibuat (public)
- [x] Kredensial Supabase di-copy
- [x] File .env.local dibuat
- [x] Kredensial diisi di .env.local
- [x] Dependencies terinstall
- [x] Development server berjalan
- [x] Diagnostic script passed
- [x] Website bisa diakses
- [x] Admin panel bisa login
- [x] Test tambah produk berhasil
- [x] Data tersimpan di Supabase

---

## 🚀 LANGKAH SELANJUTNYA

Sekarang database Anda sudah terhubung sempurna! Anda bisa:

### 1. Customize Data
- Edit store settings (nama toko, kontak, alamat)
- Update harga emas terkini
- Hapus produk seed yang tidak perlu
- Tambah produk Anda sendiri

### 2. Upload Foto Produk
- Siapkan foto produk berkualitas
- Upload via admin panel
- Atau bulk upload via Supabase Storage

### 3. Deploy ke Production
- Baca: SETUP_GUIDE.md bagian Deploy
- Deploy ke Vercel/Netlify
- Setup custom domain

---

## 📞 BUTUH BANTUAN?

Jika ada masalah di langkah manapun:

1. **Baca pesan error dengan teliti**
2. **Jalankan diagnostic:** `node check-supabase-connection.js`
3. **Baca troubleshooting:** `cat TROUBLESHOOTING_DATABASE.md`
4. **Cek console browser:** F12 → Console tab

---

**Selamat! Anda berhasil setup database Supabase! 🎊**

**Estimasi waktu total: 25 menit**
**Tingkat kesulitan: Mudah**
**Success rate: 99%**
