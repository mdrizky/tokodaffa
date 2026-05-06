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
