import { supabase } from './supabase';
import localProducts from '@/data/products.json';
import localGoldPrices from '@/data/gold-prices.json';

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getProducts() {
  if (hasSupabase) {
    const { data, error } = await supabase.from('products').select('*').order('id');
    if (!error && data) return data;
  }
  return localProducts;
}

export async function getGoldPrices() {
  if (hasSupabase) {
    const { data, error } = await supabase.from('gold_prices').select('*');
    if (!error && data && data.length > 0) {
      // Convert array of { kadar, price_per_gram } to the same format as JSON: { '24K': 1100000, ... }
      const pricesMap: Record<string, number> = {};
      data.forEach((item) => {
        pricesMap[item.kadar] = item.price_per_gram;
      });
      return { prices: pricesMap, last_updated: data[0].last_updated };
    }
  }
  return localGoldPrices;
}
