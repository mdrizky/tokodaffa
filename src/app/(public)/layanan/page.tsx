import styles from "./page.module.css";
import { getStoreInfo } from "@/lib/storeFetch";
import Link from "next/link";

export default async function LayananPage() {
  const storeInfo = await getStoreInfo();
  
  const customWa = `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent("Halo TokoDaffa, saya mau konsultasi tentang Custom Desain Emas/Perak. Saya ada referensi gambarnya.")}`;
  const sepuhWa = `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent("Halo TokoDaffa, saya mau tanya soal biaya dan proses Sepuh (Cuci Emas) agar perhiasan saya mengkilap lagi.")}`;
  const servisWa = `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent("Halo TokoDaffa, saya butuh servis/perbaikan perhiasan (seperti resize cincin/patri putus).")}`;

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>Layanan <span className="text-gold-gradient">& Custom</span></h1>
          <p>Wujudkan perhiasan impian Anda atau kembalikan kilau perhiasan lama</p>
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
              <h2>Custom Desain Perhiasan</h2>
              <p>Punya referensi cincin kawin atau kalung dari Pinterest/Instagram? Kami bisa membuatkannya untuk Anda dengan tingkat kemiripan hingga 95%.</p>
              <ul className={styles.featureList}>
                <li>✓ Desain eksklusif sesuai keinginan</li>
                <li>✓ Bisa pilih material (Emas 24K, 22K, 18K, Perak)</li>
                <li>✓ Konsultasi budget & ukuran gratis</li>
              </ul>
              <a href={customWa} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.btnWa}`}>Konsultasi Custom via WA</a>
            </div>
          </div>

          {/* Sepuh Service */}
          <div className={`glass-card ${styles.serviceCard}`}>
            <div className={styles.serviceVisual}>
              <span className={styles.serviceIcon}>✨</span>
            </div>
            <div className={styles.serviceContent}>
              <h2>Sepuh (Cuci Emas)</h2>
              <p>Perhiasan lama Anda mulai kusam atau pudar warnanya? Kembalikan kilau kuning cerah atau putih (chrome) perhiasan Anda seperti baru beli.</p>
              <ul className={styles.featureList}>
                <li>✓ Proses cepat dan aman</li>
                <li>✓ Menggunakan bahan kimia khusus perhiasan terbaik</li>
                <li>✓ Tersedia sepuh kuning, rose gold, dan putih</li>
              </ul>
              <div className={styles.beforeAfter}>
                <span className={styles.baItem}>Kusam</span>
                <span style={{color: 'var(--gold-primary)'}}>→</span>
                <span className={styles.baItem} style={{color: 'var(--gold-primary)', borderColor: 'var(--gold-primary)'}}>Berkilau</span>
              </div>
              <a href={sepuhWa} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.btnWa}`}>Tanya Biaya Sepuh</a>
            </div>
          </div>

          {/* Servis Service */}
          <div className={`glass-card ${styles.serviceCard}`}>
            <div className={styles.serviceVisual}>
              <span className={styles.serviceIcon}>🔧</span>
            </div>
            <div className={styles.serviceContent}>
              <h2>Servis & Perbaikan</h2>
              <p>Cincin kebesaran? Kalung putus? Permata copot? Tukang ahli kami siap memperbaiki kerusakan perhiasan Anda dengan rapi.</p>
              <ul className={styles.featureList}>
                <li>✓ Resize cincin (besar/kecil)</li>
                <li>✓ Patri sambung kalung/gelang putus</li>
                <li>✓ Pasang permata lepas</li>
              </ul>
              <a href={servisWa} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.btnWa}`}>Tanya Servis via WA</a>
            </div>
          </div>

        </div>
      </section>

      <section className={styles.ctaBanner}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Bingung Layanan Mana yang Anda Butuhkan?</h2>
          <p>Bawa langsung perhiasan Anda ke toko kami, pakar kami akan memeriksanya secara gratis.</p>
          <Link href="/kontak" className="btn btn-outline" style={{ marginTop: '24px' }}>Lihat Lokasi Toko</Link>
        </div>
      </section>
    </div>
  );
}
