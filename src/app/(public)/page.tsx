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
  { icon: "💎", title: "Premium Quality", desc: "Every piece is crafted with precision, complete with official certificates of authenticity." },
  { icon: "📈", title: "Realtime Pricing", desc: "Our prices update daily directly from the global gold market standards." },
  { icon: "🔄", title: "100% Buyback", desc: "Guaranteed buyback policy with fair and transparent market rates." },
  { icon: "⚖️", title: "Certified Precision", desc: "We use perfectly calibrated digital scales certified by national metrology." },
];

const testimonials = [
  { name: "Sarah Wijaya", text: "I've been collecting their 24K pieces since 2018. The craftsmanship is simply unparalleled. A true luxury experience.", rating: 5, time: "2 days ago" },
  { name: "Ahmad Malik", text: "The investment gold bars come with perfect certification. Their buyback process is instant and highly professional.", rating: 5, time: "1 week ago" },
  { name: "Dina Pratiwi", text: "Ordered a custom 18K diamond wedding ring. The result exceeded our expectations. The attention to detail is stunning.", rating: 5, time: "3 weeks ago" },
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

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: '#d4af37' }}>
      <div style={{ animation: 'pulse 2s infinite', fontSize: '2rem' }}>💎 LUXGOLD...</div>
    </div>
  );

  const { products, goldPrices, storeInfo } = data;
  const featuredProducts = products.filter((p: any) => p.featured).slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroParticles}>
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className={styles.particle} style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
            }} />
          ))}
        </div>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeIcon}>✦</span>
              Pinnacle of Luxury Jewelry
              <span className={styles.heroBadgeIcon}>✦</span>
            </div>
            <h1 className={styles.heroTitle}>
              Elegance Forged in <span className="text-gold-gradient">Eternity</span>
            </h1>
            <p className={styles.heroDesc}>
              Discover our exclusive collection of premium fine jewelry. Crafted for those who appreciate the absolute pinnacle of luxury, perfection, and timeless beauty.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/produk" className="btn btn-gold" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                Explore Collection
              </Link>
              <a href={`https://wa.me/${storeInfo.whatsapp}?text=Halo%20TokoDaffa,%20saya%20tertarik%20dengan%20koleksi%20exclusive%20Anda`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
                Private Consultation
              </a>
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
            <Link href="/produk?cat=cincin" className={styles.catBox}>Exclusive Rings</Link>
            <Link href="/produk?cat=gelang" className={styles.catBox}>Bracelets</Link>
            <Link href="/produk?cat=kalung" className={styles.catBox}>Necklaces</Link>
            <Link href="/produk?cat=batangan" className={styles.catBox}>Precious Metals</Link>
            <Link href="/layanan" className={styles.catBox} style={{ borderColor: '#d4af37', color: '#d4af37' }}>Custom Atelier ✨</Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: '#fff', marginBottom: '16px' }}>Masterpiece Collection</h2>
            <p style={{ color: '#a09d94', maxWidth: '600px', margin: '0 auto' }}>Curated selections of our finest work. Each piece tells a story of unparalleled craftsmanship.</p>
          </div>
          <div className={styles.productsGrid}>
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className={styles.viewAll}>
            <Link href="/produk" className="btn btn-outline" style={{ padding: '14px 40px' }}>View Full Catalog</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`section ${styles.trustSection}`}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: '#d4af37', marginBottom: '16px' }}>The Gold Standard</h2>
            <p style={{ color: '#a09d94', maxWidth: '600px', margin: '0 auto' }}>We don't just sell jewelry; we provide a legacy. Discover why generations trust us.</p>
          </div>
          <div className="grid-4" style={{ gap: '30px' }}>
            {trustItems(dict).map((item, i) => (
              <div key={i} className={styles.trustCard}>
                <div className={styles.trustIcon}>{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Banner */}
      <section className="section">
        <div className="container">
          <div className={styles.servicesBanner}>
            <div className={styles.sbContent}>
              <h3>Bespoke Custom Atelier</h3>
              <p>Bring your deepest imaginations to life. Our master artisans are ready to craft a one-of-a-kind masterpiece tailored exclusively for you, using only the finest ethically sourced gems and precious metals.</p>
              <Link href="/layanan" className="btn btn-gold" style={{ padding: '14px 32px' }}>Book an Appointment</Link>
            </div>
            <div className={styles.sbVisual}>
               💎
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: '#fff', marginBottom: '16px' }}>Investment Calculator</h2>
            <p style={{ color: '#a09d94', maxWidth: '600px', margin: '0 auto' }}>Plan your precious metal investments with our realtime synchronized pricing engine.</p>
          </div>
          <Calculator initialPrices={goldPrices} />
        </div>
      </section>

      {/* Testimonials */}
      <section className={`section ${styles.testimonialSection}`}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: '2.5rem', color: '#fff', marginBottom: '16px' }}>Voices of Elegance</h2>
            <p style={{ color: '#a09d94', maxWidth: '600px', margin: '0 auto' }}>Hear from our esteemed clientele about their experiences with our craftsmanship.</p>
          </div>
          <div className="grid-3" style={{ gap: '30px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.stars}>{"★".repeat(t.rating)}</div>
                <p className={styles.testimonialText}>{t.text}</p>
                <div className={styles.testimonialFooter}>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.avatar}>{t.name[0]}</div>
                    <div>
                       <span style={{ display: 'block', fontWeight: 600, color: '#fff' }}>{t.name}</span>
                       <span style={{ fontSize: '0.8rem', color: '#8a8780' }}>Verified Client</span>
                    </div>
                  </div>
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
            <div className={styles.ctaCardInner}>
               <h2>Begin Your Legacy</h2>
               <p>Secure your dream jewelry today or consult your precious metal investment portfolio with our dedicated experts.</p>
               <div className={styles.ctaButtons}>
                 <a href={`https://wa.me/${storeInfo.whatsapp}?text=Halo%20TokoDaffa,%20saya%20ingin%20memulai%20investasi%20emas`} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: '1.1rem', padding: '16px 40px' }}>
                   Start Conversation
                 </a>
               </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
