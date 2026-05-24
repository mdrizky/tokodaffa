import { supabase, hasSupabase } from './supabase';
import localStoreInfo from '@/data/store-info.json';

export async function getStoreInfo(): Promise<any> {
  if (hasSupabase) {
    const [{ data: storeData, error: storeError }, { data: aboutData }] = await Promise.all([
      supabase.from('store_settings').select('*').limit(1).maybeSingle(),
      supabase.from('about_content').select('*').limit(1).maybeSingle(),
    ]);

    if (!storeError && storeData) {
      return {
        ...localStoreInfo,
        ...storeData,
        ...(aboutData ? {
          about_history: aboutData.history,
          about_extra: aboutData.extra,
          about_vision: aboutData.vision,
          about_mission: aboutData.mission,
          about_strengths: aboutData.strengths,
          founder_name: aboutData.founder_name,
          founder_quote: aboutData.founder_quote,
        } : {}),
        whatsapp: storeData.whatsapp || localStoreInfo.whatsapp || '6281365555411',
        // Merge social media
        instagram: storeData.social_media?.instagram || storeData.instagram || (localStoreInfo.social_media as any)?.instagram,
        facebook: storeData.social_media?.facebook || storeData.facebook || (localStoreInfo.social_media as any)?.facebook,
        tiktok: storeData.social_media?.tiktok || storeData.tiktok || (localStoreInfo.social_media as any)?.tiktok,
      };
    }
  }
  return {
    ...localStoreInfo,
    whatsapp: '6281365555411',
    instagram: (localStoreInfo.social_media as any)?.instagram,
    facebook: (localStoreInfo.social_media as any)?.facebook,
    tiktok: (localStoreInfo.social_media as any)?.tiktok,
  };
}
