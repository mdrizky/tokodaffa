"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface NewsItem {
  title: string;
  description: string;
  url: string;
  image: string;
  published_at: string;
  source: string;
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data.data || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.newsPage}>
      <div className="container">
        <div className={styles.header}>
          <h1>Berita Emas Terkini</h1>
          <p>Update terbaru seputar harga emas, tren investasi, dan berita industri perhiasan</p>
        </div>

        {loading ? (
          <div className={styles.loading}>Memuat berita...</div>
        ) : news.length === 0 ? (
          <div className={styles.empty}>
            <p>Tidak ada berita tersedia saat ini.</p>
          </div>
        ) : (
          <div className={styles.newsGrid}>
            {news.map((item, index) => (
              <article key={index} className={styles.newsCard}>
                <div className={styles.newsImage}>
                  <img src={item.image} alt={item.title} />
                  <span className={styles.newsSource}>{item.source}</span>
                </div>
                <div className={styles.newsContent}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className={styles.newsMeta}>
                    <span className={styles.newsDate}>{formatDate(item.published_at)}</span>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.readMore}>
                      Baca Selengkapnya →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className={styles.backLink}>
          <Link href="/">← Kembali ke Beranda</Link>
        </div>
      </div>
    </div>
  );
}
