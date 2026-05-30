# Setup Environment Variables untuk Supabase

## Langkah 1: Buat File .env.local

Buat file baru bernama `.env.local` di root folder project (sejajar dengan package.json)

## Langkah 2: Isi dengan Credentials Supabase

Copy dan paste ini ke file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_ADMIN_PIN=240708
MEDIASTACK_API_KEY=your-mediastack-key-here
```

## Langkah 3: Dapatkan Credentials dari Supabase

1. Buka https://supabase.com/dashboard
2. Pilih project Toko Mas Daffa
3. Klik **Settings** → **API**
4. Copy:
   - **Project URL** → paste ke `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → paste ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Langkah 4: Import Database Schema

1. Buka Supabase Dashboard
2. Klik **SQL Editor**
3. Klik **New Query**
4. Copy semua isi file `supabase-setup.sql`
5. Paste dan klik **Run**

## Langkah 5: Restart Development Server

Setelah membuat file `.env.local`:

```bash
# Stop server (Ctrl+C)
# Start lagi
npm run dev
```

## Langkah 6: Test Koneksi

1. Buka Admin Panel
2. Coba tambah produk
3. Cek console browser (F12) untuk error
4. Cek Supabase Dashboard → Table Editor → products untuk melihat data

## Troubleshooting

### Error: "Supabase client not initialized"
- Pastikan file `.env.local` sudah dibuat
- Pastikan credentials sudah diisi dengan benar
- Restart development server

### Error: "Relation does not exist"
- Jalankan SQL setup lagi di Supabase SQL Editor
- Pastikan semua tabel berhasil dibuat

### Error: "Permission denied"
- Cek RLS policies di Supabase
- Pastikan policies sudah di-setup dengan benar

### Data tidak tersimpan
- Cek console browser untuk error
- Cek Supabase Dashboard → Logs
- Pastikan environment variables benar
