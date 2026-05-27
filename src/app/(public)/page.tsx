"use client";

import Link from "next/link";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import PriceTable from "@/components/PriceTable";
import Calculator from "@/components/Calculator";
import PartnerSlider from "@/components/PartnerSlider";
import { getProducts } from "@/lib/dataFetch";
import { getStoreInfo } from "@/lib/storeFetch";
import { useGoldPrice } from "@/hooks/useGoldPrice";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
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
  const { dict, lang } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [dbTestimonials, setDbTestimonials] = useState<any[]>([]);
  const [whyChooseUs, setWhyChooseUs] = useState<any[]>([]);
  
  // Real-time hook for gold prices
  const { data: realTimeGoldData, loading: goldLoading } = useGoldPrice();

  useEffect(() => {
    async function load() {
      try {
        // Fetch data in parallel for better performance
        const [p, s, newsRes, testimonialsRes, whyChooseRes] = await Promise.all([
          getProducts(),
          getStoreInfo(),
          fetch("/api/news").then(res => res.json()).catch(() => ({ data: [] })),
          fetch("/api/testimonials").then(res => res.json()).catch(() => ({ data: [] })),
          fetch("/api/why-choose-us").then(res => res.json()).catch(() => ({ data: [] }))
        ]);
        
        setData({ products: p || [], storeInfo: s });
        setNews(newsRes.data || []);
        setDbTestimonials(testimonialsRes.data || []);
        setWhyChooseUs(whyChooseRes.data || []);
      } catch (e) {
        console.error(e);
      }
      setLoadingInitial(false);
    }
    load();
  }, []);



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
              {dict.hero_title.split(' ')[0]} <span className="text-gold-gradient">{dict.hero_title.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className={styles.heroDesc}>
              {dict.hero_subtitle}
            </p>
            <div className={styles.heroCtas}>
              <Link href="/produk" className="btn-premium">
                {lang === 'id' ? 'Lihat Koleksi' : 'Explore Collection'}
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
          <div className={styles.sectionHeader}>
            <h2>{lang === 'id' ? 'Koleksi Eksklusif' : 'Exclusive Collection'}</h2>
            <p>{lang === 'id' ? 'Temukan keindahan dalam setiap karya seni kami' : 'Discover beauty in every piece of our artistry'}</p>
          </div>
          <div className={styles.grid4}>
            <Link href="/produk?cat=cincin" className={styles.catCard}>
              <div className={styles.catImageWrapper}>
                <div className={styles.catIcon}>💍</div>
                <div className={styles.catGlow}></div>
              </div>
              <h3>{lang === 'id' ? 'Cincin Eksklusif' : 'Exclusive Rings'}</h3>
              <p>{lang === 'id' ? 'Desain mewah untuk momen spesial' : 'Luxury designs for special moments'}</p>
              <span className={styles.catCta}>{lang === 'id' ? 'Lihat Koleksi →' : 'View Collection →'}</span>
            </Link>
            <Link href="/produk?cat=gelang" className={styles.catCard}>
              <div className={styles.catImageWrapper}>
                <div className={styles.catIcon}>⭕</div>
                <div className={styles.catGlow}></div>
              </div>
              <h3>{lang === 'id' ? 'Gelang Mewah' : 'Luxury Bracelets'}</h3>
              <p>{lang === 'id' ? 'Elegan di setiap gerakan tangan' : 'Elegant in every hand movement'}</p>
              <span className={styles.catCta}>{lang === 'id' ? 'Lihat Koleksi →' : 'View Collection →'}</span>
            </Link>
            <Link href="/produk?cat=kalung" className={styles.catCard}>
              <div className={styles.catImageWrapper}>
                <div className={styles.catIcon}>📿</div>
                <div className={styles.catGlow}></div>
              </div>
              <h3>{lang === 'id' ? 'Kalung Berkelas' : 'Classy Necklaces'}</h3>
              <p>{lang === 'id' ? 'Kemewahan yang memancar di leher' : 'Radiant luxury around the neck'}</p>
              <span className={styles.catCta}>{lang === 'id' ? 'Lihat Koleksi →' : 'View Collection →'}</span>
            </Link>
            <Link href="/produk?cat=batangan" className={styles.catCard}>
              <div className={styles.catImageWrapper}>
                <div className={styles.catIcon}>💰</div>
                <div className={styles.catGlow}></div>
              </div>
              <h3>{lang === 'id' ? 'Logam Mulia' : 'Precious Metals'}</h3>
              <p>{lang === 'id' ? 'Investasi emas berkualitas tinggi' : 'High-quality gold investment'}</p>
              <span className={styles.catCta}>{lang === 'id' ? 'Lihat Koleksi →' : 'View Collection →'}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED COLLECTIONS */}
      <section className={styles.sectionPremiumDark}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>{dict.featured_products}</h2>
            <p>{lang === 'id' ? 'Pilihan karya terbaik kami. Setiap perhiasan menceritakan kisah keahlian yang tak tertandingi.' : 'Curated selections of our finest work. Each piece tells a story of unparalleled craftsmanship.'}</p>
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



      {/* 6. INVESTMENT GOLD SECTION */}
      <section className={styles.sectionPremium}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>{dict.calculator_title}</h2>
            <p>{dict.calculator_subtitle}</p>
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

      {/* 7.5 PARTNERS SLIDER */}
      <PartnerSlider />

      {/* 8. WHY CHOOSE US (TRUST) */}
      <section className={styles.sectionPremiumDark}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>{dict.why_choose_us}</h2>
            <p>{lang === 'id' ? 'Kami tidak sekadar menjual perhiasan; kami memberikan warisan. Temukan mengapa pelanggan mempercayai kami.' : 'We don\'t just sell jewelry; we provide a legacy. Discover why generations trust us.'}</p>
          </div>
          <div className={styles.grid4}>
            {whyChooseUs.length > 0 ? whyChooseUs.map((item, i) => (
              <div key={i} className={styles.trustCardNew}>
                <div className={styles.trustIconNew}>{item.icon || '⭐'}</div>
                {item.statistic && <div className={styles.statistic}>{item.statistic}</div>}
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            )) : trustItems.map((item, i) => (
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
            <h2>{dict.testimonials}</h2>
            <p>{lang === 'id' ? 'Dengar dari pelanggan kami tentang pengalaman mereka.' : 'Hear from our esteemed clientele about their experiences with our craftsmanship.'}</p>
          </div>
          <div className={styles.grid3}>
            {(dbTestimonials.length > 0 ? dbTestimonials : testimonials).map((t, i) => (
              <div key={i} className={styles.testimonialCardNew}>
                <div className={styles.stars}>
                  {Array.from({length: t.rating || 5}).map((_, j) => <Star key={j} size={16} fill="currentColor" color="currentColor" />)}
                </div>
                <p>"{t.text}"</p>
                <div className={styles.tAuthor}>
                  <div className={styles.tAvatar}>{t.name[0]}</div>
                  <div>
                    <h5>{t.name}</h5>
                    <span>{t.role || t.product_purchased || 'Pelanggan'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9.5 NEWS SECTION */}
      {news.length > 0 && (
        <section className={styles.sectionPremiumDark}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>{lang === 'id' ? 'Berita Emas & Perak Terkini' : 'Latest Gold & Silver News'}</h2>
              <p>{lang === 'id' ? 'Update terbaru seputar harga emas dan industri perhiasan' : 'Latest updates on gold prices and jewelry industry'}</p>
            </div>
            <div className={styles.newsFilters}>
              <button className={`${styles.newsFilter} ${styles.active}`}>{lang === 'id' ? 'Semua' : 'All'}</button>
              <button className={styles.newsFilter}>{lang === 'id' ? 'Emas' : 'Gold'}</button>
              <button className={styles.newsFilter}>{lang === 'id' ? 'Perak' : 'Silver'}</button>
              <button className={styles.newsFilter}>{lang === 'id' ? 'Investasi' : 'Investment'}</button>
            </div>
            <div className={styles.newsGrid}>
              {news.slice(0, 3).map((item: any, index: number) => (
                <div key={index} className={styles.newsCard}>
                  <div className={styles.newsImage}>
                    <img src={item.image || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400'} alt={item.title} />
                  </div>
                  <div className={styles.newsContent}>
                    <div className={styles.newsMeta}>
                      <span className={styles.newsSource}>{item.source?.name || 'News'}</span>
                      <span className={styles.newsDate}>
                        {new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <a href={item.url || '#'} target="_blank" rel="noopener noreferrer" className="btn-outline-premium" style={{ marginTop: '12px', display: 'inline-block', padding: '8px 16px', fontSize: '0.9rem' }}>
                      {lang === 'id' ? 'Baca Selengkapnya' : 'Read More'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/news" className="btn-outline-premium">{lang === 'id' ? 'Lihat Semua Berita' : 'View All News'} <ArrowUpRight size={18}/></Link>
            </div>
          </div>
        </section>
      )}

      {/* 10. LUXURY BRAND & RESELLER */}
      <section className={styles.brandSection}>
        <div className={styles.brandOverlay}></div>
        <div className="container relative z-10 text-center">
          <Building size={48} className="text-gold mx-auto mb-6" />
          <h2 style={{ fontSize: '3rem', fontFamily: '"Playfair Display", serif', marginBottom: '20px' }}>Join Our Empire</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>
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
  return <ShieldCheck size={20} color="currentColor" style={{ display: 'inline', marginRight: '8px' }} />;
}
