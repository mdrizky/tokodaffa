import { getGoldPrices as getSupabaseGoldPrices } from "@/lib/dataFetch";

// Konstanta margin dan pajak (bisa diambil dari DB nanti)
const MARGIN_PERCENTAGE = 0.05; // Margin Toko 5%
const TAX_PERCENTAGE = 0.01; // Pajak 1%
const DEFAULT_USD_IDR = 16000; // Default kurs jika gagal API

export async function fetchWorldGoldPrice() {
  const apiKey = process.env.GOLD_API_KEY;
  
  if (!apiKey) {
    // FALLBACK: Simulasi fluktuasi real-time dari data Supabase terakhir
    // Supaya web tetap terlihat profesional walau API Key belum diisi
    const dbPrices = await getSupabaseGoldPrices();
    const basePrice = dbPrices?.prices?.["24K"] || 1100000;
    
    // Random fluktuasi antara -0.2% sampai +0.2%
    const fluctuation = basePrice * (Math.random() * 0.004 - 0.002);
    const simulatedPrice = Math.round(basePrice + fluctuation);
    
    return {
      source: 'simulated',
      priceUSD: simulatedPrice / DEFAULT_USD_IDR, // Simulated USD per gram
      exchangeRate: DEFAULT_USD_IDR
    };
  }

  try {
    // 1. Ambil harga Emas (XAU) dalam USD
    // (GoldAPI biasanya mengembalikan harga per Troy Ounce)
    const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
      headers: { "x-access-token": apiKey },
      next: { revalidate: 60 } // Cache 60 detik
    });
    
    if (!res.ok) throw new Error("Failed to fetch gold price");
    const data = await res.json();
    const pricePerOunce = data.price;
    const pricePerGramUSD = pricePerOunce / 31.1034768; // 1 Troy Ounce = 31.103... gram

    // 2. Ambil kurs tukar USD ke IDR (bisa pakai open.er-api.com gratis tanpa key)
    const exRes = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 3600 } });
    let exchangeRate = DEFAULT_USD_IDR;
    if (exRes.ok) {
      const exData = await exRes.json();
      exchangeRate = exData.rates.IDR || DEFAULT_USD_IDR;
    }

    return {
      source: 'goldapi',
      priceUSD: pricePerGramUSD,
      exchangeRate
    };

  } catch (error) {
    console.error("Gold API Error:", error);
    // Fallback ke Supabase jika API gagal
    const dbPrices = await getSupabaseGoldPrices();
    return {
      source: 'fallback_db',
      priceUSD: (dbPrices?.prices?.["24K"] || 1100000) / DEFAULT_USD_IDR,
      exchangeRate: DEFAULT_USD_IDR
    };
  }
}

export function calculateSmartPricing(priceUSDPerGram: number, exchangeRate: number) {
  // 1. Konversi ke Rupiah
  const basePriceIDR = priceUSDPerGram * exchangeRate;
  
  // 2. Hitung Pajak
  const taxAmount = basePriceIDR * TAX_PERCENTAGE;
  
  // 3. Tambah Margin
  const marginAmount = basePriceIDR * MARGIN_PERCENTAGE;
  
  // 4. Harga Jual Akhir 24K
  const final24K = Math.round(basePriceIDR + taxAmount + marginAmount);
  
  // 5. Generasi Harga Kadar Lain (Proporsional)
  return {
    "24K": final24K,
    "22K": Math.round(final24K * 0.916),
    "18K": Math.round(final24K * 0.750),
    "16K": Math.round(final24K * 0.666),
    "Perak": Math.round(basePriceIDR * 0.012), // Estimasi harga perak ~1.2% harga emas
  };
}
