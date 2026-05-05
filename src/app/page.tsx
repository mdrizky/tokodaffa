import Link from "next/link";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import PriceTable from "@/components/PriceTable";
import Calculator from "@/components/Calculator";
import products from "@/data/products.json";
import storeInfo from "@/data/store-info.json";

const featuredProducts = products.filter((p) => p.featured).slice(0, 6);

const trustItems = [
  { icon: "🏅", title: "Emas Bersertifikat", desc: "Setiap produk dilengkapi sertifikat keaslian resmi" },
  { icon: "💰", title: "Harga Transparan", desc: "Harga berdasarkan harga pasar emas terkini" },
  { icon: "🔄", title: "Garansi Buyback", desc: "Jaminan beli kembali 100% kapan saja" },
  { icon: "⚖️", title: "Timbangan Presisi", desc: "Timbangan digital tersertifikasi metrologi" },
];

const testimonials = [
  { name: "Ibu Sarah", text: "Sudah berlangganan 5 tahun. Emas selalu berkualitas dan harga jujur!", rating: 5 },
  { name: "Pak Ahmad", text: "Buyback mudah dan cepat. TokoDaffa memang terpercaya.", rating: 5 },
  { name: "Dina Pratiwi", text: "Koleksi cincinnya bagus-bagus, desain modern dan kualitas premium.", rating: 5 },
];

export default function HomePage() {
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
              Dipercaya Sejak {storeInfo.since}
            </div>
            <h1 className={styles.heroTitle}>
              <span className="text-gold-gradient">Emas Berkualitas,</span>
              <br />Harga Terpercaya
            </h1>
            <p className={styles.heroDesc}>
              Kedai emas pilihan Anda dengan koleksi perhiasan premium dan emas batangan berkualitas tinggi.
              Harga transparan, sertifikat keaslian, dan garansi buyback 100%.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/produk" className="btn btn-gold">Lihat Koleksi</Link>
              <Link href="/harga-emas" className="btn btn-outline">Cek Harga Emas</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroCardInner}>
                <span className={styles.heroCardIcon}>◆</span>
                <span className={styles.heroCardTitle}>24K Pure Gold</span>
                <span className={styles.heroCardSub}>Premium Collection</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Ticker */}
      <section className={`section ${styles.priceSection}`}>
        <div className="container">
          <PriceTable />
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="gold-line" />
            <h2>Produk <span className="text-gold-gradient">Unggulan</span></h2>
            <p>Koleksi perhiasan emas terbaik pilihan kami untuk Anda</p>
          </div>
          <div className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className={styles.viewAll}>
            <Link href="/produk" className="btn btn-outline">Lihat Semua Produk →</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className={`section ${styles.trustSection}`}>
        <div className="container">
          <div className="section-header">
            <div className="gold-line" />
            <h2>Kenapa Pilih <span className="text-gold-gradient">TokoDaffa</span>?</h2>
            <p>Kami berkomitmen memberikan yang terbaik untuk pelanggan</p>
          </div>
          <div className="grid-4">
            {trustItems.map((item, i) => (
              <div key={i} className={`glass-card ${styles.trustCard} animate-fade-in-up animate-delay-${i + 1}`}>
                <div className={styles.trustIcon}>{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Preview */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="gold-line" />
            <h2>Kalkulator <span className="text-gold-gradient">Emas</span></h2>
            <p>Hitung estimasi harga emas sesuai kebutuhan Anda</p>
          </div>
          <Calculator />
        </div>
      </section>

      {/* Testimonials */}
      <section className={`section ${styles.testimonialSection}`}>
        <div className="container">
          <div className="section-header">
            <div className="gold-line" />
            <h2>Apa Kata <span className="text-gold-gradient">Pelanggan</span></h2>
          </div>
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <div key={i} className={`glass-card ${styles.testimonialCard}`}>
                <div className={styles.stars}>{"★".repeat(t.rating)}</div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.avatar}>{t.name[0]}</div>
                  <span>{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2>Tertarik dengan Koleksi Kami?</h2>
            <p>Hubungi kami sekarang untuk konsultasi dan pemesanan</p>
            <div className={styles.ctaButtons}>
              <a href={`https://wa.me/${storeInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">Chat WhatsApp</a>
              <Link href="/kontak" className="btn btn-outline">Lihat Kontak</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
