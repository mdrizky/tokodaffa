import { getBlogPosts } from "@/lib/dataFetch";
import { getStoreInfo } from "@/lib/storeFetch";
import Link from "next/link";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Berita Emas | TokoDaffa Gold",
  description: "Baca artikel terbaru tentang investasi emas, tips perhiasan, dan berita pasar emas dari TokoDaffa Gold.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  const [posts, storeInfo] = await Promise.all([
    getBlogPosts(20),
    getStoreInfo(),
  ]);

  const waLink = storeInfo ? `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent("Halo TokoDaffa, saya baru baca blog Anda. Ada yang ingin saya tanyakan 🙏")}` : '#';

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const featured = posts.filter(p => p.is_featured);
  const rest = posts.filter(p => !p.is_featured);

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>📰 Blog & Berita <span className="text-gold-gradient">Emas</span></h1>
          <p className={styles.heroSubtitle}>Artikel terpercaya tentang investasi emas, tips perhiasan, dan informasi pasar terkini</p>
        </div>
      </section>

      <div className="container">
        {posts.length === 0 ? (
          <div className={styles.empty}>
            <p>Belum ada artikel tersedia.</p>
            <Link href={waLink} target="_blank" className="btn btn-whatsapp">Chat via WhatsApp</Link>
          </div>
        ) : (
          <>
            {/* Featured Posts */}
            {featured.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>🌟 Artikel Pilihan</h2>
                <div className={styles.featuredGrid}>
                  {featured.slice(0, 2).map(post => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className={styles.featuredCard}>
                      {post.cover_image && (
                        <div className={styles.featuredImage}>
                          <img src={post.cover_image} alt={post.title} loading="lazy" />
                          <span className={styles.category}>{post.category}</span>
                        </div>
                      )}
                      <div className={styles.featuredContent}>
                        <h3>{post.title}</h3>
                        {post.excerpt && <p>{post.excerpt}</p>}
                        <div className={styles.meta}>
                          <span>✍️ {post.author || 'Admin TokoDaffa'}</span>
                          <span>📅 {formatDate(post.published_at)}</span>
                          {post.views_count > 0 && <span>👁️ {post.views_count} views</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* All Posts */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>📝 Semua Artikel</h2>
              <div className={styles.grid}>
                {[...featured.slice(2), ...rest].map(post => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className={styles.card}>
                    {post.cover_image && (
                      <div className={styles.cardImage}>
                        <img src={post.cover_image} alt={post.title} loading="lazy" />
                      </div>
                    )}
                    <div className={styles.cardContent}>
                      <span className={`${styles.categoryBadge} badge badge-gold`}>{post.category}</span>
                      <h3 className={styles.cardTitle}>{post.title}</h3>
                      {post.excerpt && <p className={styles.cardExcerpt}>{post.excerpt}</p>}
                      <div className={styles.cardMeta}>
                        <span>📅 {formatDate(post.published_at)}</span>
                        <span className={styles.readMore}>Baca →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        {/* CTA */}
        <div className={styles.cta}>
          <h3>Punya pertanyaan seputar emas? 💬</h3>
          <p>Konsultasikan langsung dengan pakar emas kami via WhatsApp, gratis!</p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            Chat WhatsApp Sekarang
          </a>
        </div>
      </div>
    </main>
  );
}
