#!/bin/bash

# ============================================================
# SCRIPT SETUP DATABASE OTOMATIS - TOKODAFFA
# ============================================================
# Script ini akan membantu setup database secara otomatis
# Jalankan dengan: bash setup-database.sh
# ============================================================

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     SETUP DATABASE OTOMATIS - TOKODAFFA GOLD               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Check if .env.local exists
echo -e "${BLUE}[1/7]${NC} Mengecek file .env.local..."
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  File .env.local tidak ditemukan${NC}"
    echo -e "${GREEN}✓${NC} Membuat .env.local dari .env.example..."
    cp .env.example .env.local
    echo -e "${GREEN}✓${NC} File .env.local berhasil dibuat!"
    echo ""
    echo -e "${YELLOW}📝 PENTING: Edit file .env.local dan isi kredensial Supabase Anda!${NC}"
    echo ""
    echo "   1. Buka: https://supabase.com/dashboard"
    echo "   2. Pilih project Anda"
    echo "   3. Settings → API"
    echo "   4. Copy Project URL dan anon key"
    echo "   5. Paste ke .env.local"
    echo ""
    read -p "Tekan ENTER setelah Anda selesai edit .env.local..."
else
    echo -e "${GREEN}✓${NC} File .env.local ditemukan"
fi

# Step 2: Check environment variables
echo ""
echo -e "${BLUE}[2/7]${NC} Mengecek environment variables..."

if grep -q "your-project-id.supabase.co" .env.local; then
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_URL masih default!${NC}"
    echo -e "${YELLOW}   Solusi: Edit .env.local dan isi dengan URL Supabase Anda${NC}"
    exit 1
fi

if grep -q "your-anon-key-here" .env.local; then
    echo -e "${RED}❌ NEXT_PUBLIC_SUPABASE_ANON_KEY masih default!${NC}"
    echo -e "${YELLOW}   Solusi: Edit .env.local dan isi dengan Anon Key Supabase Anda${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Environment variables sudah diisi"

# Step 3: Check Node.js
echo ""
echo -e "${BLUE}[3/7]${NC} Mengecek Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js tidak terinstall!${NC}"
    echo -e "${YELLOW}   Solusi: Install Node.js dari https://nodejs.org${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓${NC} Node.js terinstall: $NODE_VERSION"

# Step 4: Check npm
echo ""
echo -e "${BLUE}[4/7]${NC} Mengecek npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm tidak terinstall!${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓${NC} npm terinstall: $NPM_VERSION"

# Step 5: Install dependencies
echo ""
echo -e "${BLUE}[5/7]${NC} Mengecek dependencies..."
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules tidak ditemukan${NC}"
    echo -e "${GREEN}✓${NC} Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} Dependencies berhasil diinstall!"
    else
        echo -e "${RED}❌ Gagal install dependencies!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓${NC} Dependencies sudah terinstall"
fi

# Step 6: Run diagnostic
echo ""
echo -e "${BLUE}[6/7]${NC} Menjalankan diagnostic..."
echo ""
node check-supabase-connection.js
DIAGNOSTIC_RESULT=$?

if [ $DIAGNOSTIC_RESULT -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ Diagnostic gagal! Ada masalah dengan setup.${NC}"
    echo -e "${YELLOW}📖 Baca: TROUBLESHOOTING_DATABASE.md untuk solusi${NC}"
    exit 1
fi

# Step 7: Success
echo ""
echo -e "${BLUE}[7/7]${NC} Setup selesai!"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✅ SETUP DATABASE BERHASIL! 🎉                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Langkah selanjutnya:${NC}"
echo ""
echo "  1. Jalankan development server:"
echo -e "     ${BLUE}npm run dev${NC}"
echo ""
echo "  2. Buka browser:"
echo -e "     ${BLUE}http://localhost:3000${NC}"
echo ""
echo "  3. Login ke admin panel:"
echo -e "     ${BLUE}http://localhost:3000/admin${NC}"
echo -e "     PIN: ${YELLOW}240708${NC}"
echo ""
echo "  4. Test tambah produk baru"
echo ""
echo "  5. Verifikasi di Supabase Table Editor"
echo ""
echo -e "${GREEN}Selamat! Database Anda sudah siap digunakan! 🚀${NC}"
echo ""
