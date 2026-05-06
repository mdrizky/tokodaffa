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
