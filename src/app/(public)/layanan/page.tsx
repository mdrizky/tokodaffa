"use client";

import styles from "./page.module.css";
import { getStoreInfo } from "@/lib/storeFetch";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";

export default function LayananPage() {
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

  const customWa = `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(lang === 'id' ? "Halo TokoDaffa, saya mau konsultasi tentang Custom Desain Emas/Perak." : "Hello TokoDaffa, I'd like to consult about Custom Gold/Silver Design.")}`;
  const sepuhWa = `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(lang === 'id' ? "Halo TokoDaffa, saya mau tanya soal biaya dan proses Sepuh." : "Hello TokoDaffa, I'd like to ask about Gold Plating costs and process.")}`;
  const servisWa = `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(lang === 'id' ? "Halo TokoDaffa, saya butuh servis/perbaikan perhiasan." : "Hello TokoDaffa, I need jewelry service/repair.")}`;

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>{dict.ser_title.split(' ')[0]} <span className="text-gold-gradient">{dict.ser_title.split(' ').slice(1).join(' ')}</span></h1>
          <p>{dict.ser_subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.grid}`}>
          
          {/* Custom Service */}
          <div className={`glass-card ${styles.serviceCard}`}>
            <div className={styles.serviceVisual}>
              <span className={styles.serviceIcon}>💍</span>
            </div>
            <div className={styles.serviceContent}>
              <h2>{dict.ser_custom_title}</h2>
              <p>{dict.ser_custom_desc}</p>
              <ul className={styles.featureList}>
                <li>✓ {lang === 'id' ? 'Desain eksklusif sesuai keinginan' : 'Exclusive design as requested'}</li>
                <li>✓ {lang === 'id' ? 'Bisa pilih material (Emas, Perak)' : 'Choose materials (Gold, Silver)'}</li>
                <li>✓ {lang === 'id' ? 'Konsultasi budget & ukuran gratis' : 'Free budget & size consultation'}</li>
              </ul>
              <a href={customWa} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.btnWa}`}>{lang === 'id' ? 'Konsultasi via WA' : 'Consult via WA'}</a>
            </div>
          </div>

          {/* Sepuh Service */}
          <div className={`glass-card ${styles.serviceCard}`}>
            <div className={styles.serviceVisual}>
              <span className={styles.serviceIcon}>✨</span>
            </div>
            <div className={styles.serviceContent}>
              <h2>{dict.ser_sepuh_title}</h2>
              <p>{dict.ser_sepuh_desc}</p>
              <ul className={styles.featureList}>
                <li>✓ {lang === 'id' ? 'Proses cepat dan aman' : 'Fast and safe process'}</li>
                <li>✓ {lang === 'id' ? 'Tersedia sepuh kuning, rose gold, putih' : 'Yellow, rose gold, white plating'}</li>
              </ul>
              <div className={styles.beforeAfter}>
                <span className={styles.baItem}>{lang === 'id' ? 'Kusam' : 'Dull'}</span>
                <span style={{color: 'var(--gold-primary)'}}>→</span>
                <span className={styles.baItem} style={{color: 'var(--gold-primary)', borderColor: 'var(--gold-primary)'}}>{lang === 'id' ? 'Berkilau' : 'Shiny'}</span>
              </div>
              <a href={sepuhWa} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.btnWa}`}>{lang === 'id' ? 'Tanya Biaya Sepuh' : 'Inquire Plating Cost'}</a>
            </div>
          </div>

          {/* Servis Service */}
          <div className={`glass-card ${styles.serviceCard}`}>
            <div className={styles.serviceVisual}>
              <span className={styles.serviceIcon}>🔧</span>
            </div>
            <div className={styles.serviceContent}>
              <h2>{dict.ser_servis_title}</h2>
              <p>{dict.ser_servis_desc}</p>
              <ul className={styles.featureList}>
                <li>✓ {lang === 'id' ? 'Resize cincin' : 'Ring resizing'}</li>
                <li>✓ {lang === 'id' ? 'Patri sambung kalung putus' : 'Repair broken chains'}</li>
                <li>✓ {lang === 'id' ? 'Pasang permata lepas' : 'Fix loose stones'}</li>
              </ul>
              <a href={servisWa} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.btnWa}`}>{lang === 'id' ? 'Tanya Servis via WA' : 'Inquire Service via WA'}</a>
            </div>
          </div>

        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>{dict.ser_cta_title}</h2>
          <p>{dict.ser_cta_subtitle}</p>
          <Link href="/kontak" className="btn btn-outline" style={{ marginTop: '24px' }}>{dict.nav_contact}</Link>
        </div>
      </section>
    </div>
  );
}
