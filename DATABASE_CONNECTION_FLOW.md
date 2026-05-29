# 🔄 ALUR KONEKSI DATABASE - TOKODAFFA

## 📊 DIAGRAM ARSITEKTUR

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                    http://localhost:3000                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEXT.JS APP (Frontend)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Pages:                                                   │  │
│  │  - /admin (Admin Panel)                                   │  │
│  │  - /produk (Product List)                                 │  │
│  │  - /harga-emas (Gold Prices)                             │  │
│  │  - /kontak (Contact Form)                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             │ Import                             │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  src/lib/supabase.ts                                      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ const supabase = createClient(                     │  │  │
│  │  │   NEXT_PUBLIC_SUPABASE_URL,    ← dari .env.local   │  │  │
│  │  │   NEXT_PUBLIC_SUPABASE_ANON_KEY ← dari .env.local  │  │  │
│  │  │ )                                                   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             │ Import                             │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  src/lib/dataFetch.ts                                     │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ export async function getProducts() {              │  │  │
│  │  │   if (hasSupabase) {                               │  │  │
│  │  │     const { data } = await supabase               │  │  │
│  │  │       .from('products')                            │  │  │
│  │  │       .select('*')                                 │  │  │
│  │  │   }                                                 │  │  │
│  │  │   return data || localProducts; // fallback       │  │  │
│  │  │ }                                                   │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS Request
                             │ (Supabase Client SDK)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE CLOUD (Backend)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Gateway                                              │  │
│  │  - Authentication (Anon Key)                              │  │
│  │  - Rate Limiting                                          │  │
│  │  - Request Validation                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Row Level Security (RLS)                                 │  │
│  │  - Check policies untuk setiap tabel                      │  │
│  │  - Public read untuk data publik                          │  │
│  │  - Anon full access untuk admin operations                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                      │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  19 Tables:                                         │  │  │
│  │  │  - products (30 seed data)                          │  │  │
│  │  │  - gold_prices (5 kadar)                            │  │  │
│  │  │  - categories (8 kategori)                          │  │  │
│  │  │  - services (6 layanan)                             │  │  │
│  │  │  - testimonials (6 testimoni)                       │  │  │
│  │  │  - faqs (8 pertanyaan)                              │  │  │
│  │  │  - store_settings (1 row)                           │  │  │
│  │  │  - contact_messages                                 │  │  │
│  │  │  - reservations                                     │  │  │
│  │  │  - blog_posts                                       │  │  │
│  │  │  - reviews                                          │  │  │
│  │  │  - wishlist                                         │  │  │
│  │  │  - newsletters                                      │  │  │
│  │  │  - partners                                         │  │  │
│  │  │  - about_content                                    │  │  │
│  │  │  - wa_inquiries                                     │  │  │
│  │  │  - price_history                                    │  │  │
│  │  │  - hero_slides                                      │  │  │
│  │  │  - promos                                           │  │  │
│  │  │  - why_choose_us                                    │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Storage (Bucket: images)                                 │  │
│  │  - Public bucket untuk foto produk                        │  │
│  │  - Max size: 10MB per file                                │  │
│  │  - Allowed: JPG, PNG, WEBP, GIF, SVG                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 AUTHENTICATION FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN LOGIN                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ User masukkan PIN
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Frontend Validation (Client-side)                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  if (pin === NEXT_PUBLIC_ADMIN_PIN) {                    │  │
│  │    localStorage.setItem('admin_auth', 'true')            │  │
│  │    redirect to admin panel                                │  │
│  │  }                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ PIN benar
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Admin Panel Access                                              │
│  - Semua operasi CRUD menggunakan Supabase Anon Key             │
│  - RLS policies allow "anon" role untuk full access             │
│  - Tidak ada server-side auth (PIN-based di frontend)           │
└─────────────────────────────────────────────────────────────────┘
```

**⚠️ CATATAN KEAMANAN:**
- Admin auth menggunakan PIN di frontend (simple)
- Untuk production, pertimbangkan auth yang lebih kuat
- Atau gunakan Supabase Auth dengan email/password

---

## 📤 DATA FLOW: TAMBAH PRODUK

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User mengisi form di Admin Panel                            │
│     - Nama produk                                                │
│     - Kategori, kadar, berat, harga, stok                       │
│     - Upload foto                                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Upload Foto (jika ada)                                       │
│     POST /api/upload                                             │
│     ┌────────────────────────────────────────────────────────┐  │
│     │  const { data } = await supabase.storage               │  │
│     │    .from('images')                                      │  │
│     │    .upload(filename, file)                              │  │
│     │  return publicUrl                                       │  │
│     └────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Submit Form Data                                             │
│     AdminProducts.tsx → handleSubmit()                           │
│     ┌────────────────────────────────────────────────────────┐  │
│     │  const payload = {                                      │  │
│     │    name, category, kadar, weight, price, stock,        │  │
│     │    photo: uploadedUrl,                                  │  │
│     │    ...                                                   │  │
│     │  }                                                       │  │
│     │  const { error } = await supabase                       │  │
│     │    .from('products')                                    │  │
│     │    .insert(payload)                                     │  │
│     └────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Supabase Processing                                          │
│     - Validate request (anon key)                                │
│     - Check RLS policies                                         │
│     - Insert data ke tabel products                              │
│     - Return success/error                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Response ke Frontend                                         │
│     - Success: Show toast "✅ Produk ditambahkan!"              │
│     - Error: Show toast "❌ Gagal: [error message]"             │
│     - Refresh product list                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW: TAMPIL PRODUK DI HOMEPAGE

```
┌─────────────────────────────────────────────────────────────────┐
│  1. User akses homepage (/)                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Next.js Server Component                                     │
│     page.tsx → getProducts()                                     │
│     ┌────────────────────────────────────────────────────────┐  │
│     │  import { getProducts } from '@/lib/dataFetch'         │  │
│     │  const products = await getProducts()                  │  │
│     └────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. dataFetch.ts → getProducts()                                 │
│     ┌────────────────────────────────────────────────────────┐  │
│     │  if (hasSupabase) {                                     │  │
│     │    // Fetch dari Supabase                               │  │
│     │    const { data } = await supabase                      │  │
│     │      .from('products')                                  │  │
│     │      .select('*')                                       │  │
│     │      .eq('is_active', true)                             │  │
│     │      .order('display_order')                            │  │
│     │    return data                                          │  │
│     │  } else {                                                │  │
│     │    // Fallback ke local JSON                            │  │
│     │    return localProducts                                 │  │
│     │  }                                                       │  │
│     └────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Supabase Query                                               │
│     - Execute SQL: SELECT * FROM products WHERE is_active=true  │
│     - Apply RLS policies (public read)                           │
│     - Return data                                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Render di Browser                                            │
│     - Products ditampilkan di homepage                           │
│     - Foto dari Supabase Storage                                 │
│     - Data real-time dari database                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 TROUBLESHOOTING FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│  MASALAH: Data tidak tersimpan                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  CEK 1: Environment Variables                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  File .env.local ada?                                     │  │
│  │  NEXT_PUBLIC_SUPABASE_URL sudah diisi?                    │  │
│  │  NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diisi?               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                    ┌────────┴────────┐                          │
│                    │                 │                          │
│                 ❌ TIDAK          ✅ SUDAH                      │
│                    │                 │                          │
│                    ▼                 ▼                          │
│         Copy .env.example      CEK 2: Database                  │
│         Edit .env.local        Schema                           │
│         Restart server                                          │
└─────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  CEK 2: Database Schema                                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Tabel sudah dibuat di Supabase?                          │  │
│  │  Data seed sudah ada?                                     │  │
│  │  RLS policies sudah di-set?                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                    ┌────────┴────────┐                          │
│                    │                 │                          │
│                 ❌ BELUM          ✅ SUDAH                      │
│                    │                 │                          │
│                    ▼                 ▼                          │
│         Jalankan              CEK 3: Storage                    │
│         SUPABASE_SCHEMA.sql   Bucket                            │
│         di SQL Editor                                           │
└─────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  CEK 3: Storage Bucket                                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Bucket 'images' sudah dibuat?                            │  │
│  │  Bucket sudah public?                                     │  │
│  │  Storage policies sudah di-set?                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                    ┌────────┴────────┐                          │
│                    │                 │                          │
│                 ❌ BELUM          ✅ SUDAH                      │
│                    │                 │                          │
│                    ▼                 ▼                          │
│         Buat bucket 'images'   CEK 4: Browser                   │
│         Centang "Public"       Cache                            │
│         Run storage policies                                    │
└─────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  CEK 4: Browser Cache                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Clear cache & hard reload                                │  │
│  │  Restart development server                               │  │
│  │  Cek console browser untuk error                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                             │                                    │
│                             ▼                                    │
│                    ✅ SELESAI!                                  │
│                    Data harusnya tersimpan                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 MONITORING & DEBUGGING

### Tools untuk Debug:

1. **Browser DevTools (F12)**
   - Console: Lihat error JavaScript
   - Network: Lihat request/response Supabase
   - Application: Cek localStorage

2. **Supabase Dashboard**
   - Table Editor: Lihat data real-time
   - Logs: Lihat query logs
   - Storage: Lihat uploaded files

3. **Diagnostic Script**
   ```bash
   node check-supabase-connection.js
   ```
   - Cek environment variables
   - Test koneksi Supabase
   - Verifikasi tabel & bucket

4. **Console Logging**
   - Tambahkan `console.log()` di code
   - Cek output di browser console
   - Track data flow

---

## 🎯 KEY POINTS

1. **Environment Variables adalah KUNCI**
   - Tanpa ini, app pakai data lokal JSON
   - Harus restart server setelah ubah .env

2. **Database Schema HARUS dijalankan**
   - 19 tabel + seed data
   - RLS policies
   - Storage policies

3. **Storage Bucket HARUS public**
   - Nama: `images`
   - Public: ✅
   - Policies: set

4. **Fallback System**
   - Jika Supabase gagal → pakai local JSON
   - Tidak error, tapi data tidak persistent

5. **Admin Auth Simple**
   - PIN-based di frontend
   - Untuk production: upgrade ke proper auth

---

**Gunakan diagram ini untuk memahami alur data dan troubleshooting! 🚀**
