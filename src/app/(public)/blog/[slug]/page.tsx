import { getBlogPost, getBlogPosts } from "@/lib/dataFetch";
import { getStoreInfo } from "@/lib/storeFetch";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: `${post.meta_title || post.title} | TokoDaffa Gold`,
    description: post.meta_description || post.excerpt,
  };
}

export const revalidate = 3600;

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const [post, storeInfo, relatedPosts] = await Promise.all([
    getBlogPost(slug),
    getStoreInfo(),
    getBlogPosts(4),
  ]);

  if (!post) notFound();

  const related = relatedPosts.filter(p => p.slug !== slug && p.category === post.category).slice(0, 3);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const waLink = storeInfo ? `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(`Halo TokoDaffa 👋\n\nSaya baru membaca artikel "${post.title}" di website Anda.\n\nSaya ingin tahu lebih lanjut. Bisa dibantu? 🙏`)}` : '#';

  return (
    <main className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        {post.cover_image && (
          <div className={styles.heroImage}>
            <img src={post.cover_image} alt={post.title} />
            <div className={styles.heroOverlay} />
          </div>
        )}
        <div className={`container ${styles.heroContent}`}>
          <div className={styles.breadcrumb}>
            <Link href="/">Beranda</Link> / <Link href="/blog">Blog</Link> / <span>{post.category}</span>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span>✍️ {post.author || 'Admin TokoDaffa'}</span>
            <span>📅 {formatDate(post.published_at)}</span>
            {post.views_count > 0 && <span>👁️ {post.views_count} views</span>}
          </div>
        </div>
      </div>

      <div className={`container ${styles.container}`}>
        {/* Article Content */}
        <article className={styles.article}>
          {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}
          
          {post.content ? (
            <div 
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className={styles.noContent}>Konten artikel belum tersedia.</p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag: string) => (
                <span key={tag} className={`badge badge-gold`}>#{tag}</span>
              ))}
            </div>
          )}

          {/* WA CTA */}
          <div className={styles.articleCta}>
            <h3>Ada pertanyaan tentang artikel ini? 💬</h3>
            <p>Chat langsung dengan pakar emas kami via WhatsApp!</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              Chat WhatsApp Gratis
            </a>
          </div>
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <aside className={styles.related}>
            <h2 className={styles.relatedTitle}>📰 Artikel Terkait</h2>
            <div className={styles.relatedGrid}>
              {related.map(p => (
                <Link key={p.id} href={`/blog/${p.slug}`} className={styles.relatedCard}>
                  {p.cover_image && <img src={p.cover_image} alt={p.title} className={styles.relatedImage} />}
                  <div className={styles.relatedContent}>
                    <h4>{p.title}</h4>
                    <span>📅 {formatDate(p.published_at)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}

        <div className={styles.backLink}>
          <Link href="/blog">← Kembali ke Blog</Link>
        </div>
      </div>
    </main>
  );
}
