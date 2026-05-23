Supabase Import & Admin Setup
=============================

This document explains how to import the minimal database schema into Supabase so the admin dashboard can fully control site content.

Required tables (minimum):

- `store_settings` — single row storing site-level fields (address, phone, email, maps embed, operating hours, social links)
- `about_content` — separate editable About page content and strengths section
- `products` — product catalog
- `gold_prices` — current gold prices per `kadar` (24K, 22K, ...)
- `admin_users` — admin login pins

SQL examples (run in Supabase SQL editor):

```sql
-- Store settings (single row)
create table if not exists store_settings (
  id serial primary key,
  name text,
  address text,
  phone text,
  whatsapp text,
  email text,
  since int,
  maps_embed text,
  about_history text,
  about_extra text,
  about_vision text,
  about_strengths text[],
  certifications text[],
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- About content
create table if not exists about_content (
  id serial primary key,
  history text not null,
  extra text,
  vision text not null,
  strengths text[] default array[]::text[],
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Products
create table if not exists products (
  id serial primary key,
  name text,
  category text,
  price numeric,
  ongkos numeric,
  weight numeric,
  kadar text,
  stock int,
  photo text,
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz
);

-- Gold prices
create table if not exists gold_prices (
  id serial primary key,
  kadar text,
  price_per_gram numeric,
  last_updated timestamptz
);

-- Admin users (simple PIN-based auth)
create table if not exists admin_users (
  id serial primary key,
  username text,
  pin text,
  created_at timestamptz default now()
);
```

How to import existing data
---------------------------

1. In Supabase dashboard, open the SQL editor and run the table creation statements above.
2. Use the Table editor to insert one `store_settings` row (it will be used as site-wide content).
3. Insert rows into `gold_prices` for each `kadar` (24K, 22K, 18K, 16K, Perak) with `price_per_gram` and `last_updated`.
4. Insert products into `products` or upload via CSV using Supabase import.
5. Add an `admin_users` row with a `pin` for admin access (the app also accepts a master PIN bypass).

Environment variables
---------------------

Set the following in your Vercel/Supabase project environment:

- `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
- `GOLD_API_KEY` (optional) = API key for GoldAPI.io if you want live market prices

Notes
-----
- The app falls back to local JSON files when Supabase is not available.
- When `GOLD_API_KEY` is present, the site will attempt to fetch XAU/USD from GoldAPI. Otherwise it uses a simulated fallback based on DB values.
