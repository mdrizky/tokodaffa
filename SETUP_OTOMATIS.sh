#!/bin/bash

# ============================================================
# SCRIPT SETUP OTOMATIS - TOKODAFFA
# ============================================================
# Script ini akan membantu setup project secara otomatis
# Jalankan dengan: bash SETUP_OTOMATIS.sh
# ============================================================

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         SETUP OTOMATIS - TOKODAFFA GOLD                    ║"
echo "║         Setup Project dalam 3 Menit!                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================
# STEP 1: CEK PREREQUISITES
# ============================================================
echo -e "${BLUE}[1/6] Mengecek prerequisites...${NC}"

# Cek Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js tidak terinstall!${NC}"
    echo "   Install dari: https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js terinstall: $NODE_VERSION${NC}"

# Cek npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm tidak terinstall!${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm terinstall: $NPM_VERSION${NC}"

# ============================================================
# STEP 2: CEK FILE .env.local
# ============================================================
echo ""
echo -e "${BLUE}[2/6] Mengecek file .env.local...${NC}"

if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  File .env.local tidak ditemukan${NC}"
    echo "   Membuat dari .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo -e "${GREEN}✅ File .env.local berhasil dibuat${NC}"
        echo ""
        echo -e "${YELLOW}⚠️  PENTING: Edit file .env.local dan isi kredensial Supabase Anda!${NC}"
        echo ""
        echo "   1. Buka: https://supabase.com/dashboard"
        echo "   2. Pilih project Anda"
        echo "   3. Settings → API"
        echo "   4. Copy Project URL dan anon key"
        echo "   5. Edit .env.local dan paste kredensial"
        echo ""
        read -p "Tekan ENTER setelah Anda edit .env.local..."
    else
        echo -e "${RED}❌ File .env.example tidak ditemukan!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ File .env.local sudah ada${NC}"
fi

# Cek apakah .env.local sudah diisi
if grep -q "your-project-id.supabase.co" .env.local || grep -q "your-anon-key-here" .env.local; then
    echo -e "${RED}❌ File .env.local masih menggunakan nilai default!${NC}"
    echo "   Edit .env.local dan isi dengan kredensial Supabase Anda"
    echo ""
    read -p "Tekan ENTER setelah Anda edit .env.local..."
fi

# ============================================================
# STEP 3: INSTALL DEPENDENCIES
# ============================================================
echo ""
echo -e "${BLUE}[3/6] Menginstall dependencies...${NC}"

if [ ! -d "node_modules" ]; then
    echo "   Ini akan memakan waktu 1-2 menit..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Dependencies berhasil terinstall${NC}"
    else
        echo -e "${RED}❌ Gagal install dependencies${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Dependencies sudah terinstall${NC}"
fi

# ============================================================
# STEP 4: CEK SUPABASE SCHEMA
# ============================================================
echo ""
echo -e "${BLUE}[4/6] Mengecek Supabase schema...${NC}"

if [ ! -f "SUPABASE_SCHEMA.sql" ]; then
    echo -e "${RED}❌ File SUPABASE_SCHEMA.sql tidak ditemukan!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ File SUPABASE_SCHEMA.sql ditemukan${NC}"

echo ""
echo -e "${YELLOW}⚠️  PENTING: Pastikan Anda sudah menjalankan SUPABASE_SCHEMA.sql di Supabase!${NC}"
echo ""
echo "   Cara menjalankan:"
echo "   1. Buka: https://supabase.com/dashboard"
echo "   2. Pilih project Anda"
echo "   3. Klik 'SQL Editor' di sidebar"
echo "   4. Klik 'New Query'"
echo "   5. Copy isi file SUPABASE_SCHEMA.sql"
echo "   6. Paste ke SQL Editor"
echo "   7. Klik 'Run' atau tekan Ctrl+Enter"
echo ""
read -p "Sudah menjalankan SUPABASE_SCHEMA.sql? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Jalankan SUPABASE_SCHEMA.sql dulu, lalu run script ini lagi${NC}"
    exit 1
fi

# ============================================================
# STEP 5: CEK STORAGE BUCKET
# ============================================================
echo ""
echo -e "${BLUE}[5/6] Mengecek storage bucket...${NC}"

echo ""
echo -e "${YELLOW}⚠️  PENTING: Pastikan bucket 'images' sudah dibuat di Supabase!${NC}"
echo ""
echo "   Cara membuat bucket:"
echo "   1. Buka: https://supabase.com/dashboard"
echo "   2. Klik 'Storage' di sidebar"
echo "   3. Klik 'New Bucket'"
echo "   4. Nama: images"
echo "   5. CENTANG 'Public bucket' ← PENTING!"
echo "   6. Klik 'Create Bucket'"
echo ""
read -p "Sudah membuat bucket 'images'? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Buat bucket 'images' dulu, lalu run script ini lagi${NC}"
    exit 1
fi

# ============================================================
# STEP 6: JALANKAN DIAGNOSTIC
# ============================================================
echo ""
echo -e "${BLUE}[6/6] Menjalankan diagnostic...${NC}"
echo ""

if [ -f "check-supabase-connection.js" ]; then
    node check-supabase-connection.js
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║              ✅ SETUP BERHASIL!                            ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${GREEN}Langkah selanjutnya:${NC}"
        echo ""
        echo "   1. Jalankan development server:"
        echo -e "      ${BLUE}npm run dev${NC}"
        echo ""
        echo "   2. Buka browser:"
        echo -e "      ${BLUE}http://localhost:3000${NC}"
        echo ""
        echo "   3. Login ke admin panel:"
        echo -e "      ${BLUE}http://localhost:3000/admin${NC}"
        echo -e "      PIN: ${YELLOW}240708${NC}"
        echo ""
        echo "   4. Test tambah produk baru"
        echo ""
        echo "   5. Verifikasi di Supabase Table Editor"
        echo ""
        echo -e "${GREEN}Selamat! Setup selesai! 🎉${NC}"
        echo ""
    else
        echo ""
        echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║              ❌ SETUP GAGAL!                               ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo -e "${YELLOW}Ada masalah dengan setup. Cek output di atas untuk detail.${NC}"
        echo ""
        echo "Troubleshooting:"
        echo "   1. Baca: TROUBLESHOOTING_DATABASE.md"
        echo "   2. Cek .env.local sudah diisi dengan benar"
        echo "   3. Cek SUPABASE_SCHEMA.sql sudah dijalankan"
        echo "   4. Cek bucket 'images' sudah dibuat dan public"
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  File check-supabase-connection.js tidak ditemukan${NC}"
    echo "   Skip diagnostic check"
fi

echo ""
echo "Script selesai!"
echo ""
