"use client";

import Link from "next/link";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import PriceTable from "@/components/PriceTable";
import Calculator from "@/components/Calculator";
import { getProducts, getGoldPrices } from "@/lib/dataFetch";
import { getStoreInfo } from "@/lib/storeFetch";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";

const trustItems = (dict: any) => [
  { icon: "🏅", title: "Emas Bersertifikat Asli", desc: "Setiap produk dilengkapi surat & sertifikat keaslian resmi" },
  { icon: "💰", title: "Transparansi Harga", desc: "Harga update tiap hari + Rincian ongkos tukang jelas" },
  { icon: "🔄", title: "Garansi Buyback 100%", desc: "Jaminan beli kembali dengan potongan sesuai harga pasar" },
  { icon: "⚖️", title: "Timbangan Presisi", desc: "Timbangan digital tersertifikasi badan metrologi" },
];

const testimonials = [
  { name: "Ibu Sarah", text: "Sudah langganan sejak 2010. Beli cincin di sini selalu puas, modelnya up to date dan potongannya jujur kalau dijual lagi.", rating: 5, time: "2 hari yang lalu" },
  { name: "Pak Ahmad", text: "Buyback sangat gampang dan cepat cair. TokoDaffa memang terpercaya. Nggak nyesel investasi emas batangan di sini.", rating: 5, time: "1 minggu yang lalu" },
  { name: "Dina Pratiwi", text: "Custom cincin nikah hasilnya rapi banget! Sesuai ekspektasi dan harganya masuk akal. Pelayanannya ramah pol.", rating: 5, time: "3 minggu yang lalu" },
];

export default function HomePage() {
  const { dict } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getProducts();
      const g = await getGoldPrices();
      const s = await getStoreInfo();
      setData({ products: p, goldPrices: g, storeInfo: s });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>;

  const { products, goldPrices, storeInfo } = data;
  const featuredProducts = products.filter((p: any) => p.featured).slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroParticles}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className={styles.particle} style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeIcon}>◆</span>
              Melayani Ribuan Pelanggan Sejak {storeInfo.since}
            </div>
            <h1 className={styles.heroTitle}>
              {dict.hero_title.split('&').map((text: string, i: number) => 
                i === 1 ? <span key={i}>& <span className="text-gold-gradient">{text}</span></span> : text
              )}
            </h1>
            <p className={styles.heroDesc}>
              {dict.hero_subtitle}
            </p>
            <div className={styles.heroCtas}>
              <a href={`https://wa.me/${storeInfo.whatsapp}?text=Halo%20TokoDaffa,%20saya%20mau%20konsultasi%20gratis%20soal%20perhiasan`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                {dict.prod_buy_wa}
              </a>
              <Link href="/produk" className="btn btn-gold">{dict.nav_catalog}</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardInner}>
                <span className={styles.heroCardIcon}>🏆</span>
                <span className={styles.heroCardTitle}>100% Original</span>
                <span className={styles.heroCardSub}>Garansi Uang Kembali</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Ticker */}
      <section className={`section ${styles.priceSection}`}>
        <div className="container">
          <PriceTable initialPrices={goldPrices} />
        </div>
      </section>

      {/* Categories Fast Link */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className={styles.categoryWrap}>
            <Link href="/produk?cat=cincin" className={styles.catBox}>💍 {dict.nav_home === 'Beranda' ? 'Cincin' : 'Ring'}</Link>
            <Link href="/produk?cat=gelang" className={styles.catBox}>🔗 {dict.nav_home === 'Beranda' ? 'Gelang' : 'Bracelet'}</Link>
            <Link href="/produk?cat=kalung" className={styles.catBox}>📿 {dict.nav_home === 'Beranda' ? 'Kalung' : 'Necklace'}</Link>
            <Link href="/produk?cat=batangan" className={styles.catBox}>🪙 {dict.nav_home === 'Beranda' ? 'Logam Mulia' : 'Precious Metal'}</Link>
            <Link href="/layanan" className={styles.catBox} style={{ borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)' }}>✨ Custom & Sepuh</Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="gold-line" />
            <h2>{dict.featured_products}</h2>
            <p>Koleksi perhiasan emas dan perak terbaik minggu ini. <strong style={{ color: 'var(--accent-danger)' }}>Stok sangat terbatas!</strong></p>
          </div>
          <div className={styles.productsGrid}>
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className={styles.viewAll}>
            <Link href="/produk" className="btn btn-outline">{dict.prod_back} →</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`section ${styles.trustSection}`}>
        <div className="container">
          <div className="section-header">
            <div className="gold-line" />
            <h2>{dict.why_choose_us}</h2>
            <p>Rasa aman Anda adalah prioritas utama kami dalam setiap transaksi.</p>
          </div>
          <div className="grid-4">
            {trustItems(dict).map((item, i) => (
              <div key={i} className={`glass-card ${styles.trustCard} animate-fade-in-up animate-delay-${i + 1}`}>
                <div className={styles.trustIcon}>{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section">
        <div className="container">
          <div className={`glass-card ${styles.servicesBanner}`}>
            <div className={styles.sbContent}>
              <h3>{dict.nav_services === 'Layanan & Custom' ? 'Punya Model Impian atau Perhiasan Kusam?' : 'Have a Dream Design or Dull Jewelry?'}</h3>
              <p>{dict.nav_services === 'Layanan & Custom' ? 'Kami melayani Custom Desain Perhiasan sesuai request, Sepuh Emas agar kembali berkilau, dan Servis/Perbaikan ringan hingga berat.' : 'We provide Custom Jewelry Design by request, Gold Plating to restore shine, and minor to major repairs.'}</p>
              <Link href="/layanan" className="btn btn-gold" style={{ marginTop: '16px' }}>{dict.nav_services}</Link>
            </div>
            <div className={styles.sbVisual}>
               <span style={{ fontSize: '4rem' }}>🛠️✨</span>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="gold-line" />
            <h2>{dict.calculator_title}</h2>
            <p>{dict.calculator_subtitle}</p>
          </div>
          <Calculator initialPrices={goldPrices} />
        </div>
      </section>

      {/* Testimonials */}
      <section className={`section ${styles.testimonialSection}`}>
        <div className="container">
          <div className="section-header">
            <div className="gold-line" />
            <h2>{dict.testimonials}</h2>
            <p>Ribuan transaksi berhasil dan pelanggan yang puas.</p>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className={`glass-card ${styles.testimonialCard}`}>
                <div className={styles.stars}>{"★".repeat(t.rating)}</div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <div className={styles.testimonialFooter}>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.avatar}>{t.name[0]}</div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.name}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strong CTA Action */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2>{dict.nav_home === 'Beranda' ? 'Tunggu Apa Lagi? Harga Emas Bisa Berubah Kapan Saja!' : 'Wait No More? Gold Prices Can Change Anytime!'}</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 28px' }}>{dict.nav_home === 'Beranda' ? 'Amankan perhiasan impian Anda sekarang atau konsultasikan kebutuhan investasi logam mulia Anda bersama pakar kami secara gratis.' : 'Secure your dream jewelry now or consult your precious metal investment needs with our experts for free.'}</p>
            <div className={styles.ctaButtons}>
              <a href={`https://wa.me/${storeInfo.whatsapp}?text=Halo%20TokoDaffa,%20saya%20mau%20tanya-tanya%20dulu%20boleh?`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
                {dict.con_send_wa}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
