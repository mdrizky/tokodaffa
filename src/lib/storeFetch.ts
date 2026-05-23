import { supabase } from './supabase';
import localStoreInfo from '@/data/store-info.json';

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getStoreInfo() {
  if (hasSupabase) {
    const [{ data: storeData, error: storeError }, { data: aboutData, error: aboutError }] = await Promise.all([
      supabase.from('store_settings').select('*').limit(1).single(),
      supabase.from('about_content').select('*').limit(1).single(),
    ]);

    if (!storeError && storeData) {
      return {
        ...localStoreInfo,
        ...storeData,
        ...(aboutData && !aboutError ? {
          about_history: aboutData.history,
          about_extra: aboutData.extra,
          about_vision: aboutData.vision,
          about_strengths: aboutData.strengths,
        } : {}),
        whatsapp: storeData.whatsapp || localStoreInfo.whatsapp || '081365555411',
      };
    }
  }
  return { ...localStoreInfo, whatsapp: '081365555411' };
}
