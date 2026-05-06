"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'id' | 'en';

interface Dictionary {
  nav_home: string;
  nav_catalog: string;
  nav_prices: string;
  nav_calculator: string;
  nav_services: string;
  nav_about: string;
  nav_contact: string;
  hero_title: string;
  hero_subtitle: string;
  featured_products: string;
  why_choose_us: string;
  testimonials: string;
  footer_description: string;
  footer_menu: string;
  footer_info: string;
  footer_contact: string;
  calculator_title: string;
  calculator_subtitle: string;
  // Product Detail
  prod_material: string;
  prod_kadar: string;
  prod_weight: string;
  prod_category: string;
  prod_spec: string;
  prod_desc: string;
  prod_price_est: string;
  prod_buy_wa: string;
  prod_back: string;
  prod_guarantee: string;
  prod_price_alert: string;
  // Catalog
  cat_title: string;
  cat_subtitle: string;
  cat_all: string;
  cat_search: string;
  // Contact
  con_title: string;
  con_subtitle: string;
  con_address: string;
  con_hours: string;
  con_hours_mon_fri: string;
  con_hours_sat: string;
  con_hours_sun: string;
  con_send_wa: string;
  // Services
  ser_title: string;
  ser_subtitle: string;
  ser_custom_title: string;
  ser_custom_desc: string;
  ser_sepuh_title: string;
  ser_sepuh_desc: string;
  ser_servis_title: string;
  ser_servis_desc: string;
  ser_cta_title: string;
  ser_cta_subtitle: string;
  // About
  abt_title: string;
  abt_subtitle: string;
  abt_history_title: string;
  abt_history_desc: string;
  abt_vision_title: string;
  abt_vision_desc: string;
}

const id: Dictionary = {
  nav_home: 'Beranda',
  nav_catalog: 'Katalog',
  nav_prices: 'Harga Emas',
  nav_calculator: 'Kalkulator',
  nav_services: 'Layanan & Custom',
  nav_about: 'Tentang',
  nav_contact: 'Hubungi Kami',
  hero_title: 'Jual Beli Emas & Perak Terpercaya',
  hero_subtitle: 'Koleksi perhiasan premium, logam mulia, dan layanan custom perhiasan impian Anda. Harga paling jujur, transparan, dan bergaransi.',
  featured_products: 'Produk Unggulan',
  why_choose_us: 'Kenapa Wajib Pilih TokoDaffa?',
  testimonials: 'Testimoni Real Pelanggan',
  footer_description: 'Kedai emas terpercaya dengan koleksi perhiasan emas berkualitas tinggi. Harga transparan, garansi buyback 100%, sertifikat keaslian.',
  footer_menu: 'Menu',
  footer_info: 'Informasi',
  footer_contact: 'Kontak',
  calculator_title: 'Kalkulator Simulasi Harga',
  calculator_subtitle: 'Hitung estimasi harga perhiasan emas & perak Anda dengan harga pasar terbaru.',
  prod_material: 'Material',
  prod_kadar: 'Kadar',
  prod_weight: 'Berat',
  prod_category: 'Kategori',
  prod_spec: 'Detail Spesifikasi',
  prod_desc: 'Deskripsi Produk',
  prod_price_est: 'Estimasi Harga',
  prod_buy_wa: 'Tanya Stok via WhatsApp',
  prod_back: 'Kembali ke Katalog',
  prod_guarantee: 'Jaminan Keaslian & Buyback 100%',
  prod_price_alert: 'Harga emas bersifat fluktuatif. Hubungi admin untuk harga real-time.',
  cat_title: 'Koleksi Perhiasan Kami',
  cat_subtitle: 'Pilih perhiasan emas & perak terbaik untuk menyempurnakan penampilan Anda.',
  cat_all: 'Semua Produk',
  cat_search: 'Cari produk...',
  con_title: 'Hubungi Kami',
  con_subtitle: 'Kami siap melayani kebutuhan perhiasan emas Anda',
  con_address: 'Alamat',
  con_hours: 'Jam Operasional',
  con_hours_mon_fri: 'Senin - Jumat',
  con_hours_sat: 'Sabtu',
  con_hours_sun: 'Minggu',
  con_send_wa: 'Chat WhatsApp Sekarang',
  ser_title: 'Layanan & Custom',
  ser_subtitle: 'Wujudkan perhiasan impian Anda atau kembalikan kilau perhiasan lama',
  ser_custom_title: 'Custom Desain Perhiasan',
  ser_custom_desc: 'Punya referensi cincin kawin atau kalung dari Pinterest/Instagram? Kami bisa membuatkannya untuk Anda dengan tingkat kemiripan tinggi.',
  ser_sepuh_title: 'Sepuh (Cuci Emas)',
  ser_sepuh_desc: 'Perhiasan lama Anda mulai kusam? Kembalikan kilau kuning cerah perhiasan Anda seperti baru beli.',
  ser_servis_title: 'Servis & Perbaikan',
  ser_servis_desc: 'Cincin kebesaran? Kalung putus? Tukang ahli kami siap memperbaiki perhiasan Anda dengan rapi.',
  ser_cta_title: 'Bingung Layanan Mana yang Anda Butuhkan?',
  ser_cta_subtitle: 'Bawa langsung perhiasan Anda ke toko kami, pakar kami akan memeriksanya secara gratis.',
  abt_title: 'Tentang Kami',
  abt_subtitle: 'Mengenal lebih dekat TokoDaffa Gold',
  abt_history_title: 'Sejarah Kami',
  abt_history_desc: 'TokoDaffa Gold telah menjadi destinasi terpercaya bagi para pecinta dan investor emas. Kami mengedepankan kejujuran dan kepuasan pelanggan.',
  abt_vision_title: 'Visi & Misi',
  abt_vision_desc: 'Menjadi standar emas dalam industri perhiasan retail yang mengedepankan kepercayaan, kualitas, dan inovasi pelayanan.',
};

const en: Dictionary = {
  nav_home: 'Home',
  nav_catalog: 'Catalog',
  nav_prices: 'Gold Prices',
  nav_calculator: 'Calculator',
  nav_services: 'Services & Custom',
  nav_about: 'About',
  nav_contact: 'Contact Us',
  hero_title: 'Trusted Gold & Silver Trading',
  hero_subtitle: 'Premium jewelry collections, precious metals, and custom jewelry services for your dream designs. Honest, transparent prices with full guarantee.',
  featured_products: 'Featured Products',
  why_choose_us: 'Why Choose TokoDaffa?',
  testimonials: 'Real Customer Testimonials',
  footer_description: 'Trusted gold shop with high-quality gold jewelry collections. Transparent prices, 100% buyback guarantee, and official certificates.',
  footer_menu: 'Menu',
  footer_info: 'Information',
  footer_contact: 'Contact',
  calculator_title: 'Price Simulation Calculator',
  calculator_subtitle: 'Estimate the value of your gold & silver jewelry based on the latest market prices.',
  prod_material: 'Material',
  prod_kadar: 'Kadar',
  prod_weight: 'Weight',
  prod_category: 'Category',
  prod_spec: 'Detailed Specifications',
  prod_desc: 'Product Description',
  prod_price_est: 'Price Estimation',
  prod_buy_wa: 'Inquire via WhatsApp',
  prod_back: 'Back to Catalog',
  prod_guarantee: 'Authenticity & 100% Buyback Guarantee',
  prod_price_alert: 'Gold prices are fluctuate. Contact admin for real-time prices.',
  cat_title: 'Our Jewelry Collection',
  cat_subtitle: 'Choose the best gold & silver jewelry to perfect your look.',
  cat_all: 'All Products',
  cat_search: 'Search products...',
  con_title: 'Contact Us',
  con_subtitle: 'We are ready to serve your gold jewelry needs',
  con_address: 'Address',
  con_hours: 'Operating Hours',
  con_hours_mon_fri: 'Monday - Friday',
  con_hours_sat: 'Saturday',
  con_hours_sun: 'Sunday',
  con_send_wa: 'Chat WhatsApp Now',
  ser_title: 'Services & Custom',
  ser_subtitle: 'Realize your dream jewelry or restore the shine of old jewelry',
  ser_custom_title: 'Custom Jewelry Design',
  ser_custom_desc: 'Have wedding ring or necklace references from Pinterest/Instagram? We can make it for you with high accuracy.',
  ser_sepuh_title: 'Gold Plating (Wash)',
  ser_sepuh_desc: 'Old jewelry starting to look dull? Restore the bright yellow shine of your jewelry as if it were new.',
  ser_servis_title: 'Service & Repair',
  ser_servis_desc: 'Ring too big? Broken necklace? Our expert craftsmen are ready to repair your jewelry neatly.',
  ser_cta_title: 'Unsure Which Service You Need?',
  ser_cta_subtitle: 'Bring your jewelry directly to our store, our experts will inspect it for free.',
  abt_title: 'About Us',
  abt_subtitle: 'Getting to know TokoDaffa Gold closer',
  abt_history_title: 'Our History',
  abt_history_desc: 'TokoDaffa Gold has become a trusted destination for gold enthusiasts and investors. We prioritize honesty and customer satisfaction.',
  abt_vision_title: 'Vision & Mission',
  abt_vision_desc: 'To be the gold standard in the retail jewelry industry that promotes trust, quality, and service innovation.',
};

const dictionaries = { id, en };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  dict: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('id');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Language;
    if (saved && (saved === 'id' || saved === 'en')) {
      setLang(saved);
    }
  }, []);

  const handleSetLang = (l: Language) => {
    setLang(l);
    localStorage.setItem('lang', l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, dict: dictionaries[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
