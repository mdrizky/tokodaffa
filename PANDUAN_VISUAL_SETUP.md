# 🎨 PANDUAN VISUAL SETUP DATABASE - TOKODAFFA

## 📺 PANDUAN STEP-BY-STEP DENGAN VISUAL

---

## 🎯 OVERVIEW PROSES

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: SETUP SUPABASE (5 menit)                           │
│  ├─ Buat project                                             │
│  ├─ Import database schema                                   │
│  ├─ Buat storage bucket                                      │
│  └─ Copy kredensial                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: SETUP PROJECT LOKAL (3 menit)                      │
│  ├─ Copy .env.example → .env.local                          │
│  ├─ Isi kredensial Supabase                                 │
│  ├─ npm install                                              │
│  └─ npm run dev                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: VERIFIKASI (2 menit)                               │
│  ├─ Jalankan diagnostic script                              │
│  ├─ Test di browser                                          │
│  ├─ Login admin panel                                        │
│  └─ Test CRUD operations                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    ✅ SELESAI! 🎉
```

---

## 📍 STEP 1: SETUP SUPABASE (5 MENIT)

### 1.1 Buat Project Supabase

```
🌐 Browser: https://supabase.com/dashboard
```

**Visual:**
```
┌──────────────────────────────────────────────────────────┐
│  Supabase Dashboard                                       │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                     │  │
│  │         [➕ New Project]                           │  │
│  │                                                     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Your Projects:                                           │
│  ┌────────────────┐  ┌────────────────┐                 │
│  │  Project 1     │  │  Project 2     │                 │
│  └────────────────┘  └────────────────┘                 │
└──────────────────────────────────────────────────────────┘
```

**Klik "New Project" dan isi:**

```
┌──────────────────────────────────────────────────────────┐
│  Create a new project                                     │
│                                                           │
│  Name:                                                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │ tokodaffa                                          │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Database Password:                                       │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ••••••••••••••••                                   │  │
│  └────────────────────────────────────────────────────┘  │
│  💡 SIMPAN PASSWORD INI!                                 │
│                                                           │
│  Region:                                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Southeast Asia (Singapore)                    ▼   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Pricing Plan:                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ⚪ Free                                            │  │
│  │ ⚪ Pro ($25/month)                                 │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│              [Create new project]                         │
└──────────────────────────────────────────────────────────┘
```

**Tunggu 2-3 menit:**
```
⏳ Setting up your project...
████████████████████░░░░░░░░ 75%
```

---

### 1.2 Import Database Schema

**Klik "SQL Editor" di sidebar:**

```
┌──────────────────────────────────────────────────────────┐
│  ☰ Menu                                                   │
│                                                           │
│  🏠 Home                                                  │
│  📊 Table Editor                                          │
│  🔍 SQL Editor          ← KLIK INI                       │
│  🗄️  Database                                             │
│  📦 Storage                                               │
│  ⚙️  Settings                                             │
└──────────────────────────────────────────────────────────┘
```

**Klik "New Query":**

```
┌──────────────────────────────────────────────────────────┐
│  SQL Editor                                               │
│                                                           │
│  [➕ New Query]  [📁 Saved Queries]                      │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 1  -- Paste SQL schema di sini                     │  │
│  │ 2  CREATE TABLE IF NOT EXISTS products (           │  │
│  │ 3    id BIGSERIAL PRIMARY KEY,                     │  │
│  │ 4    name TEXT NOT NULL,                           │  │
│  │ 5    ...                                            │  │
│  │                                                     │  │
│  │                                                     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  [▶️ Run] [💾 Save]                                      │
└──────────────────────────────────────────────────────────┘
```

**Langkah:**
1. Buka file `SUPABASE_SCHEMA.sql`
2. Select All (Ctrl+A)
3. Copy (Ctrl+C)
4. Paste ke SQL Editor (Ctrl+V)
5. Klik "Run" atau Ctrl+Enter

**Output yang diharapkan:**
```
✅ Success. No rows returned
⏱️  Execution time: 2.3s
```

---

### 1.3 Verifikasi Tabel

**Klik "Table Editor":**

```
┌──────────────────────────────────────────────────────────┐
│  Table Editor                                             │
│                                                           │
│  Tables (19):                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ✅ about_content                                   │  │
│  │ ✅ blog_posts                                      │  │
│  │ ✅ categories                                      │  │
│  │ ✅ contact_messages                                │  │
│  │ ✅ faqs                                            │  │
│  │ ✅ gold_prices                                     │  │
│  │ ✅ hero_slides                                     │  │
│  │ ✅ newsletters                                     │  │
│  │ ✅ partners                                        │  │
│  │ ✅ price_history                                   │  │
│  │ ✅ products                                        │  │
│  │ ✅ promos                                          │  │
│  │ ✅ reservations                                    │  │
│  │ ✅ reviews                                         │  │
│  │ ✅ services                                        │  │
│  │ ✅ store_settings                                  │  │
│  │ ✅ testimonials                                    │  │
│  │ ✅ wa_inquiries                                    │  │
│  │ ✅ why_choose_us                                   │  │
│  │ ✅ wishlist                                        │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Klik tabel "products":**

```
┌──────────────────────────────────────────────────────────┐
│  products                                                 │
│                                                           │
│  Rows: 30                                                 │
│                                                           │
│  id │ name                          │ price     │ stock  │
│  ───┼───────────────────────────────┼───────────┼────────│
│  1  │ Cincin Emas Polos Classic 24K │ 5500000   │ 3      │
│  2  │ Gelang Emas Rantai Italia 22K │ 10584000  │ 2      │
│  3  │ Kalung Emas Liontin Hati 18K  │ 6600000   │ 5      │
│  ...│ ...                            │ ...       │ ...    │
└──────────────────────────────────────────────────────────┘
```

✅ **Jika ada 30 produk → BERHASIL!**

---

### 1.4 Buat Storage Bucket

**Klik "Storage" di sidebar:**

```
┌──────────────────────────────────────────────────────────┐
│  Storage                                                  │
│                                                           │
│  [➕ New Bucket]                                         │
│                                                           │
│  Buckets (0):                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                     │  │
│  │         No buckets yet                              │  │
│  │         Create your first bucket                    │  │
│  │                                                     │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Klik "New Bucket":**

```
┌──────────────────────────────────────────────────────────┐
│  Create a new bucket                                      │
│                                                           │
│  Name:                                                    │
│  ┌────────────────────────────────────────────────────┐  │
│  │ images                                             │  │
│  └────────────────────────────────────────────────────┘  │
│  💡 HARUS PERSIS "images"                                │
│                                                           │
│  ☑️ Public bucket          ← CENTANG INI! PENTING!      │
│                                                           │
│  File size limit:                                         │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 10 MB                                              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Allowed MIME types:                                      │
│  ┌────────────────────────────────────────────────────┐  │
│  │ image/jpeg, image/png, image/webp, image/gif,     │  │
│  │ image/svg+xml                                      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│              [Create bucket]                              │
└──────────────────────────────────────────────────────────┘
```

**Hasil:**

```
┌──────────────────────────────────────────────────────────┐
│  Storage                                                  │
│                                                           │
│  Buckets (1):                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 📦 images                              [Public]    │  │
│  │    0 objects • 0 B                                 │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

✅ **Jika ada label "Public" → BERHASIL!**

---

### 1.5 Copy Kredensial

**Klik "Settings" → "API":**

```
┌──────────────────────────────────────────────────────────┐
│  Project Settings > API                                   │
│                                                           │
│  Project URL:                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ https://abcdefghijk.supabase.co            [📋]   │  │
│  └────────────────────────────────────────────────────┘  │
│  👆 COPY INI!                                            │
│                                                           │
│  Project API keys:                                        │
│                                                           │
│  anon public:                                             │
│  ┌────────────────────────────────────────────────────┐  │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...    [📋]   │  │
│  └────────────────────────────────────────────────────┘  │
│  👆 COPY INI!                                            │
│                                                           │
│  service_role secret:                                     │
│  ┌────────────────────────────────────────────────────┐  │
│  │ ••••••••••••••••••••••••••••••••••••••     [👁️]   │  │
│  └────────────────────────────────────────────────────┘  │
│  ⚠️  JANGAN GUNAKAN INI! (untuk server-side only)       │
└──────────────────────────────────────────────────────────┘
```

**Yang perlu di-copy:**
1. ✅ **Project URL** → untuk `NEXT_PUBLIC_SUPABASE_URL`
2. ✅ **anon public key** → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. ❌ **service_role** → JANGAN DIPAKAI (berbahaya!)

---

## 📍 STEP 2: SETUP PROJECT LOKAL (3 MENIT)

### 2.1 Copy Environment File

**Terminal:**
```bash
cd /home/daffarizky/tokodaffa
cp .env.example .env.local
```

**Visual:**
```
📁 tokodaffa/
├── .env.example     (template)
└── .env.local       (file baru) ✨
```

---

### 2.2 Edit .env.local

**Buka dengan text editor:**
```bash
nano .env.local
# atau
code .env.local
# atau
vim .env.local
```

**Isi dengan kredensial Supabase:**

```env
# ============================================================
# SUPABASE DATABASE (WAJIB!)
# ============================================================
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
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
- `https://abcdefghijk.supabase.co` → dengan Project URL Anda
- `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` → dengan anon key Anda

**Simpan file:**
- Nano: Ctrl+X, Y, Enter
- VS Code: Ctrl+S
- Vim: :wq

---

### 2.3 Install Dependencies

**Terminal:**
```bash
npm install
```

**Visual:**
```
⏳ Installing dependencies...

added 234 packages in 45s

✅ Dependencies installed successfully!
```

---

### 2.4 Jalankan Development Server

**Terminal:**
```bash
npm run dev
```

**Visual:**
```
> tokodaffa@1.0.0 dev
> next dev

  ▲ Next.js 16.2.4
  - Local:        http://localhost:3000
  - Network:      http://192.168.1.100:3000

✓ Ready in 2.5s
```

✅ **Jika muncul "Ready in X.Xs" → BERHASIL!**

---

## 📍 STEP 3: VERIFIKASI (2 MENIT)

### 3.1 Jalankan Diagnostic Script

**Terminal baru (jangan tutup server):**
```bash
node check-supabase-connection.js
```

**Output yang diharapkan:**
```
🔍 DIAGNOSTIC KONEKSI SUPABASE

============================================================

📄 [1/6] Mengecek file .env.local...
✅ File .env.local ditemukan

🔑 [2/6] Mengecek kredensial Supabase...
✅ Supabase URL: https://abcdefghijk.supabase.co
✅ Supabase Key: eyJhbGciOiJIUzI1NiIs...

🌐 [3/6] Testing koneksi ke Supabase...
✅ Koneksi ke Supabase BERHASIL!

📊 [4/6] Mengecek tabel-tabel database...
✅ Semua 19 tabel ditemukan!

🌱 [5/6] Mengecek data seed...
   - Products: 30 items
   - Gold Prices: 5 items
   - Categories: 8 items
✅ Data seed ditemukan

📦 [6/6] Mengecek storage bucket...
✅ Bucket "images" ditemukan
   - Public: Yes ✅

============================================================
✅ DIAGNOSTIC SELESAI - SEMUA OK!
============================================================

📝 Langkah selanjutnya:
   1. Jalankan: npm run dev
   2. Buka: http://localhost:3000/admin
   3. Login dengan PIN: 240708
   4. Coba tambah produk baru
```

✅ **Jika semua ✅ hijau → SETUP BERHASIL!**

---

### 3.2 Test di Browser

**Buka browser:**
```
http://localhost:3000
```

**Visual:**
```
┌──────────────────────────────────────────────────────────┐
│  🌐 TokoDaffa Gold                                       │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                     │  │
│  │         JUAL BELI EMAS TERPERCAYA                  │  │
│  │         Sejak 2005                                  │  │
│  │                                                     │  │
│  │         [Lihat Produk]  [Harga Emas]               │  │
│  │                                                     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Produk Unggulan:                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Cincin   │  │ Gelang   │  │ Kalung   │              │
│  │ 24K      │  │ 22K      │  │ 18K      │              │
│  │ 5.5jt    │  │ 10.5jt   │  │ 6.6jt    │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└──────────────────────────────────────────────────────────┘
```

✅ **Jika produk muncul → DATA DARI SUPABASE!**

---

### 3.3 Login Admin Panel

**Buka:**
```
http://localhost:3000/admin
```

**Visual:**
```
┌──────────────────────────────────────────────────────────┐
│  🔐 Admin Login                                          │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                     │  │
│  │         TokoDaffa Gold                              │  │
│  │         Admin Panel                                 │  │
│  │                                                     │  │
│  │         Masukkan PIN:                               │  │
│  │         ┌──────────────────────────────────────┐   │  │
│  │         │ ••••••                               │   │  │
│  │         └──────────────────────────────────────┘   │  │
│  │                                                     │  │
│  │                [Login]                              │  │
│  │                                                     │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Masukkan PIN:**
```
240708
```

**Setelah login:**
```
┌──────────────────────────────────────────────────────────┐
│  📊 Admin Dashboard                                      │
│                                                           │
│  [Dashboard] [Products] [Gold Prices] [Settings] ...     │
│                                                           │
│  Statistics:                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Products │  │ Messages │  │ Reserv.  │              │
│  │    30    │  │     0    │  │     0    │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└──────────────────────────────────────────────────────────┘
```

✅ **Jika berhasil login → ADMIN PANEL BERFUNGSI!**

---

### 3.4 Test Tambah Produk

**Klik "Products" → "Tambah Produk":**

```
┌──────────────────────────────────────────────────────────┐
│  ➕ Tambah Produk Baru                                   │
│                                                           │
│  Nama Produk *:                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Test Produk Baru                                   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Kategori *:                                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │ cincin                                        ▼   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Kadar *:                                                 │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 24K                                           ▼   │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Berat (gram) *:                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 5                                                  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Harga (Rp) *:                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 5000000                                            │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Stok *:                                                  │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 1                                                  │  │
│  └────────────────────────────────────────────────────┘  │
│                                                           │
│  Foto Utama *:                                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ https://via.placeholder.com/400                    │  │
│  └────────────────────────────────────────────────────┘  │
│  [📁 Upload Foto Utama]                                  │
│                                                           │
│              [Batal]  [💾 Simpan Produk]                 │
└──────────────────────────────────────────────────────────┘
```

**Klik "Simpan Produk":**

```
┌──────────────────────────────────────────────────────────┐
│  ✅ Produk ditambahkan!                                  │
└──────────────────────────────────────────────────────────┘
```

✅ **Jika muncul notifikasi sukses → CRUD BERFUNGSI!**

---

### 3.5 Verifikasi di Supabase

**Buka Supabase Dashboard → Table Editor → products:**

```
┌──────────────────────────────────────────────────────────┐
│  products                                                 │
│                                                           │
│  Rows: 31  (bertambah 1!)                                │
│                                                           │
│  id │ name                          │ price     │ stock  │
│  ───┼───────────────────────────────┼───────────┼────────│
│  31 │ Test Produk Baru              │ 5000000   │ 1      │ ← BARU!
│  1  │ Cincin Emas Polos Classic 24K │ 5500000   │ 3      │
│  2  │ Gelang Emas Rantai Italia 22K │ 10584000  │ 2      │
│  ...│ ...                            │ ...       │ ...    │
└──────────────────────────────────────────────────────────┘
```

✅ **Jika produk baru muncul → DATABASE TERHUBUNG!**

---

## 🎉 SELESAI!

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              ✅ SETUP DATABASE BERHASIL! 🎉               ║
║                                                            ║
║  ✅ Supabase project dibuat                               ║
║  ✅ Database schema diimport                              ║
║  ✅ Storage bucket dibuat                                 ║
║  ✅ Environment variables diisi                           ║
║  ✅ Dependencies terinstall                               ║
║  ✅ Development server berjalan                           ║
║  ✅ Diagnostic test passed                                ║
║  ✅ Admin panel berfungsi                                 ║
║  ✅ CRUD operations berhasil                              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 📋 CHECKLIST FINAL

- [x] Project Supabase dibuat
- [x] Database schema diimport (19 tabel)
- [x] Data seed ada (30 produk, 5 harga emas, dll)
- [x] Storage bucket 'images' dibuat (public)
- [x] Kredensial Supabase di-copy
- [x] File .env.local dibuat dan diisi
- [x] Dependencies terinstall
- [x] Development server berjalan
- [x] Diagnostic script passed
- [x] Website bisa diakses
- [x] Admin panel bisa login
- [x] Test tambah produk berhasil
- [x] Data tersimpan di Supabase

---

## 🚀 LANGKAH SELANJUTNYA

### 1. Customize Data
- Edit store settings
- Update harga emas
- Hapus produk seed yang tidak perlu
- Tambah produk Anda sendiri

### 2. Upload Foto Produk
- Siapkan foto produk berkualitas
- Upload via admin panel
- Atau bulk upload via Supabase Storage

### 3. Deploy ke Production
- Baca: `SETUP_GUIDE.md` bagian Deploy
- Deploy ke Vercel/Netlify
- Setup custom domain

---

## 📞 BUTUH BANTUAN?

Jika ada masalah:

1. **Jalankan diagnostic:**
   ```bash
   node check-supabase-connection.js
   ```

2. **Jalankan test lengkap:**
   ```bash
   node test-database.js
   ```

3. **Baca troubleshooting:**
   ```bash
   cat TROUBLESHOOTING_DATABASE.md
   ```

4. **Cek console browser:**
   - F12 → Console tab
   - Lihat error messages

---

**Selamat! Database Anda sudah siap digunakan! 🎊**
