import Link from "next/link";
import styles from "./Footer.module.css";
import storeInfo from "@/data/store-info.json";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>◆</span>
              <span>Toko<span className={styles.logoGold}>Daffa</span></span>
            </div>
            <p className={styles.description}>{storeInfo.description}</p>
            <div className={styles.socials}>
              <a href={storeInfo.social_media.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href={storeInfo.social_media.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href={storeInfo.social_media.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Menu</h4>
            <Link href="/">Beranda</Link>
            <Link href="/produk">Katalog Produk</Link>
            <Link href="/harga-emas">Harga Emas</Link>
            <Link href="/kalkulator">Kalkulator</Link>
          </div>

          {/* Info */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Informasi</h4>
            <Link href="/tentang">Tentang Kami</Link>
            <Link href="/kontak">Hubungi Kami</Link>
            <span>Garansi Buyback</span>
            <span>Sertifikat Emas</span>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Kontak</h4>
            <span>{storeInfo.address}</span>
            <a href={`tel:${storeInfo.phone}`}>{storeInfo.phone}</a>
            <a href={`mailto:${storeInfo.email}`}>{storeInfo.email}</a>
            <div className={styles.hours}>
              <span>Sen-Jum: {storeInfo.operating_hours.weekday}</span>
              <span>Sabtu: {storeInfo.operating_hours.saturday}</span>
              <span>Minggu: {storeInfo.operating_hours.sunday}</span>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomInner}>
            <p>&copy; {new Date().getFullYear()} TokoDaffa Gold. Semua hak dilindungi.</p>
            <p className={styles.since}>Dipercaya sejak {storeInfo.since}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
