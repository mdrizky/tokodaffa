"use client";

import styles from "./page.module.css";
import { getStoreInfo } from "@/lib/storeFetch";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";
import PartnerSlider from "@/components/PartnerSlider";

export default function TentangPage() {
  const { dict, lang } = useLanguage();
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const s = await getStoreInfo();
      setStoreInfo(s);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>;

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>{dict.abt_title.split(' ')[0]} <span className="text-gold-gradient">{dict.abt_title.split(' ').slice(1).join(' ')}</span></h1>
          <p>{dict.abt_subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.content}>
            <h2>{dict.abt_history_title}</h2>
            <p>
              {lang === 'id' 
                ? `Didirikan pada tahun ${storeInfo.since}, ${storeInfo.name} telah menjadi destinasi terpercaya bagi para pecinta dan investor emas. Kami bermula dari visi untuk memberikan transparansi harga dan kualitas terbaik.`
                : `Established in ${storeInfo.since}, ${storeInfo.name} has become a trusted destination for gold enthusiasts and investors. We started with a vision to provide price transparency and the best quality.`}
            </p>
            <p>{dict.abt_history_desc}</p>
            
            <h2 style={{ marginTop: "40px" }}>{dict.abt_vision_title}</h2>
            <p>{dict.abt_vision_desc}</p>
            <ul className={styles.list}>
              <li><strong>{lang === 'id' ? 'Kualitas:' : 'Quality:'}</strong> {lang === 'id' ? 'Menyediakan perhiasan emas berkualitas dengan desain eksklusif' : 'Providing quality gold jewelry with exclusive designs'}</li>
              <li><strong>{lang === 'id' ? 'Transparansi:' : 'Transparency:'}</strong> {lang === 'id' ? 'Memberikan transparansi harga yang mengikuti standar pasar' : 'Providing price transparency following market standards'}</li>
              <li><strong>{lang === 'id' ? 'Layanan:' : 'Service:'}</strong> {lang === 'id' ? 'Menjamin layanan purna jual dan buyback yang menguntungkan' : 'Ensuring profitable after-sales and buyback services'}</li>
            </ul>
          </div>

          <div className={styles.sidebar}>
            <div className={`glass-card ${styles.certCard}`}>
              <h3>{lang === 'id' ? 'Keunggulan Kami' : 'Our Strengths'}</h3>
              <ul className={styles.certList}>
                {(storeInfo.certifications || []).map((cert: string, index: number) => (
                  <li key={index}>
                    <span className={styles.checkIcon}>✓</span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PartnerSlider />

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container" style={{ marginBottom: "40px" }}>
          <div className="section-header">
            <h2>{lang === 'id' ? 'Kunjungi Toko Kami' : 'Visit Our Store'}</h2>
            <div className="gold-line" />
            <p>{lang === 'id' ? 'Datang dan lihat langsung koleksi perhiasan premium kami.' : 'Come and see our premium jewelry collection in person.'}</p>
          </div>
          <div style={{ width: "100%", height: "450px", borderRadius: "20px", overflow: "hidden", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-md)" }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.654341517431!2d101.0183186105822!3d0.3262650996655181!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5bc044a69634d%3A0xe549ebfa8b993efb!2sToko%20Emas%20Daffa!5e0!3m2!1sid!2sid!4v1715831515234!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
