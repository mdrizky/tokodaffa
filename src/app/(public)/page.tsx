"use client";

import Link from "next/link";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import PriceTable from "@/components/PriceTable";
import Calculator from "@/components/Calculator";
import { getProducts } from "@/lib/dataFetch";
import { getStoreInfo } from "@/lib/storeFetch";
import { useGoldPrice } from "@/hooks/useGoldPrice";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronRight, Star, ShieldCheck, Diamond, Gem, Coins, ArrowUpRight, Clock, Award, Building } from "lucide-react";

const trustItems = [
  { icon: <ShieldCheck size={32} />, title: "Lifetime Guarantee", desc: "Every piece comes with an ironclad lifetime warranty." },
  { icon: <Clock size={32} />, title: "Realtime Pricing", desc: "Synchronized directly with global gold markets." },
  { icon: <Coins size={32} />, title: "100% Buyback", desc: "Transparent, guaranteed buyback at fair market rates." },
  { icon: <Award size={32} />, title: "Certified Masters", desc: "Crafted by award-winning artisans." },
];

const testimonials = [
  { name: "Sarah Wijaya", role: "Collector", text: "I've been collecting their 24K pieces since 2018. The craftsmanship is simply unparalleled. A true luxury experience.", rating: 5 },
  { name: "Ahmad Malik", role: "Investor", text: "The investment gold bars come with perfect certification. Their buyback process is instant and highly professional.", rating: 5 },
  { name: "Dina Pratiwi", role: "Bride", text: "Ordered a custom 18K diamond wedding ring. The result exceeded our expectations. The attention to detail is stunning.", rating: 5 },
];

const faqs = [
  { q: "Do you ship internationally?", a: "Yes, we provide fully insured premium international shipping via FedEx Priority." },
  { q: "Are your diamonds conflict-free?", a: "Absolutely. All our gemstones are Kimberley Process certified and ethically sourced." },
  { q: "How does the custom 3D process work?", a: "You design your piece online. Our masters then cast it in your chosen precious metal and deliver it within 14 days." },
];

export default function HomePage() {
  const [data, setData] = useState<any>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  // Real-time hook for gold prices
  const { data: realTimeGoldData, loading: goldLoading } = useGoldPrice();

  useEffect(() => {
    async function load() {
      try {
        const p = await getProducts();
        const s = await getStoreInfo();
        setData({ products: p || [], storeInfo: s });
      } catch (e) {
        console.error(e);
      }
      setLoadingInitial(false);
    }
    load();
  }, []);

  if (loadingInitial || goldLoading) return (
    <div className={styles.premiumLoading}>
      <div className={styles.pulseLogo}>
        <img src="/logo.png" alt="LUXGOLD" />
      </div>
      <p>ENTERING THE VAULT...</p>
    </div>
  );

  const { products = [], storeInfo } = data || {};
  const goldPrices = realTimeGoldData || { prices: {} };
  const featuredProducts = products.filter((p: any) => p.featured).slice(0, 4);

  return (
    <>
      {/* 1. LUXURY HERO SECTION */}
      <section className={styles.heroNew}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroParticles}>
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div 
              key={i} 
              className={styles.particle} 
              initial={{ y: "100vh", opacity: 0 }}
              animate={{ y: "-10vh", opacity: [0, 1, 0] }}
              transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5 }}
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
        <div className="container relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={styles.heroContent}
          >
            <div className={styles.heroBadge}>
              <Diamond size={14} className="text-gold" />
              <span>Pinnacle of Luxury Jewelry</span>
              <Diamond size={14} className="text-gold" />
            </div>
            <h1 className={styles.heroTitle}>
              Elegance Forged in <span className="text-gold-gradient">Eternity</span>
            </h1>
            <p className={styles.heroDesc}>
              Discover our exclusive collection of premium fine jewelry. Crafted for those who appreciate the absolute pinnacle of luxury, perfection, and timeless beauty.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/produk" className="btn-premium">
                Explore Collection
              </Link>
              <Link href="/builder" className="btn-outline-premium">
                <Gem size={18} /> Bespoke 3D Atelier
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. REALTIME GOLD PRICE (Ticker format) */}
      <div className={styles.tickerTape}>
        <div className={styles.tickerContent}>
          {Object.entries(goldPrices?.prices || {}).map(([k, v]: [string, any]) => (
            <span key={k} className={styles.tickerItem}>
              <span className={styles.tickerLabel}>{k}</span>
              <span className={styles.tickerPrice}>Rp {Number(v).toLocaleString()}/g</span>
              <span className={styles.tickerArrow}>▲</span>
            </span>
          ))}
          {Object.entries(goldPrices?.prices || {}).map(([k, v]: [string, any]) => (
            <span key={k+"dup"} className={styles.tickerItem}>
              <span className={styles.tickerLabel}>{k}</span>
              <span className={styles.tickerPrice}>Rp {Number(v).toLocaleString()}/g</span>
              <span className={styles.tickerArrow}>▲</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. TRENDING CATEGORIES */}
      <section className={styles.sectionPremium}>
        <div className="container">
          <div className={styles.grid4}>
            <Link href="/produk?cat=cincin" className={styles.catCard}>
              <div className={styles.catImage}>💍</div>
              <h3>Exclusive Rings</h3>
            </Link>
            <Link href="/produk?cat=gelang" className={styles.catCard}>
              <div className={styles.catImage}>⭕</div>
              <h3>Bracelets</h3>
            </Link>
            <Link href="/produk?cat=kalung" className={styles.catCard}>
              <div className={styles.catImage}>📿</div>
              <h3>Necklaces</h3>
            </Link>
            <Link href="/produk?cat=batangan" className={styles.catCard}>
              <div className={styles.catImage}>💰</div>
              <h3>Precious Metals</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED COLLECTIONS */}
      <section className={styles.sectionPremiumDark}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Masterpiece Collection</h2>
            <p>Curated selections of our finest work. Each piece tells a story of unparalleled craftsmanship.</p>
          </div>
          <div className={styles.productGridNew}>
            {featuredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/produk" className="btn-outline-premium">View Full Catalog <ArrowUpRight size={18}/></Link>
          </div>
        </div>
      </section>

      {/* 5. CUSTOM JEWELRY BUILDER PREVIEW */}
      <section className={styles.builderPreview}>
        <div className="container">
          <div className={styles.builderSplit}>
            <div className={styles.builderText}>
              <div className={styles.heroBadge}><span>Interactive 3D Studio</span></div>
              <h2>Design Your Own Legacy</h2>
              <p>Step into our virtual atelier. Choose your precious metal, select your flawless gemstone, and engrave your eternal message in real-time 3D.</p>
              <ul className={styles.builderFeatures}>
                <li><CheckCircle /> 360° Real-time Rendering</li>
                <li><CheckCircle /> Instant Price Calculation</li>
                <li><CheckCircle /> 24K, Rose Gold, Platinum Options</li>
                <li><CheckCircle /> Diamond, Ruby, Sapphire, Emerald</li>
              </ul>
              <Link href="/builder" className="btn-premium mt-8">Enter 3D Studio</Link>
            </div>
            <div className={styles.builderVisual}>
              <div className={styles.floatingRing}>💍</div>
              <div className={styles.glowEffect}></div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INVESTMENT GOLD SECTION */}
      <section className={styles.sectionPremium}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Wealth Preservation</h2>
            <p>Plan your precious metal investments with our realtime synchronized pricing engine and highly accurate calculator.</p>
          </div>
          <div className={styles.investmentGrid}>
            <PriceTable initialPrices={goldPrices} />
            <Calculator initialPrices={goldPrices} />
          </div>
        </div>
      </section>

      {/* 7. STATISTICS COUNTER */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.grid4}>
            <div className={styles.statBox}>
              <h2>10K+</h2>
              <p>Happy Clients</p>
            </div>
            <div className={styles.statBox}>
              <h2>500+</h2>
              <p>Exclusive Designs</p>
            </div>
            <div className={styles.statBox}>
              <h2>25</h2>
              <p>Years of Heritage</p>
            </div>
            <div className={styles.statBox}>
              <h2>100%</h2>
              <p>Certified Authenticity</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. WHY CHOOSE US (TRUST) */}
      <section className={styles.sectionPremiumDark}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>The Gold Standard</h2>
            <p>We don't just sell jewelry; we provide a legacy. Discover why generations trust us.</p>
          </div>
          <div className={styles.grid4}>
            {trustItems.map((item, i) => (
              <div key={i} className={styles.trustCardNew}>
                <div className={styles.trustIconNew}>{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className={styles.sectionPremium}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Voices of Elegance</h2>
            <p>Hear from our esteemed clientele about their experiences with our craftsmanship.</p>
          </div>
          <div className={styles.grid3}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCardNew}>
                <div className={styles.stars}>
                  {Array.from({length: 5}).map((_, j) => <Star key={j} size={16} fill="#d4af37" color="#d4af37" />)}
                </div>
                <p>"{t.text}"</p>
                <div className={styles.tAuthor}>
                  <div className={styles.tAvatar}>{t.name[0]}</div>
                  <div>
                    <h5>{t.name}</h5>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. LUXURY BRAND & RESELLER */}
      <section className={styles.brandSection}>
        <div className={styles.brandOverlay}></div>
        <div className="container relative z-10 text-center">
          <Building size={48} className="text-gold mx-auto mb-6" />
          <h2 style={{ fontSize: '3rem', fontFamily: '"Playfair Display", serif', marginBottom: '20px' }}>Join Our Empire</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: '#ccc', marginBottom: '40px', fontSize: '1.1rem' }}>
            Become a part of the Toko Mas Daffa legacy. We offer exclusive reseller and affiliate programs for high-net-worth individuals and businesses.
          </p>
          <a href={`https://wa.me/${storeInfo?.whatsapp}?text=Halo%20saya%20tertarik%20dengan%20program%20reseller`} target="_blank" className="btn-premium">Inquire Now</a>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className={styles.sectionPremium}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <h4>{faq.q}</h4>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function CheckCircle() {
  return <ShieldCheck size={20} color="#d4af37" style={{ display: 'inline', marginRight: '8px' }} />;
}
