import styles from "./page.module.css";
import storeInfo from "@/data/store-info.json";

export default function TentangPage() {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>Tentang <span className="text-gold-gradient">Kami</span></h1>
          <p>Mengenal lebih dekat TokoDaffa Gold</p>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.content}>
            <h2>Sejarah Kami</h2>
            <p>
              Didirikan pada tahun {storeInfo.since}, TokoDaffa Gold telah menjadi destinasi terpercaya bagi para pecinta dan investor emas di Medan dan sekitarnya. Kami bermula dari sebuah toko perhiasan kecil dengan visi untuk memberikan transparansi harga dan kualitas emas terbaik kepada setiap pelanggan.
            </p>
            <p>
              Seiring berjalannya waktu, komitmen kami terhadap kejujuran dan kepuasan pelanggan telah membawa TokoDaffa berkembang menjadi salah satu kedai emas terkemuka. Kami bangga dapat melayani ribuan pelanggan yang mempercayakan investasi dan momen berharga mereka kepada kami.
            </p>
            
            <h2 style={{ marginTop: "40px" }}>Visi & Misi</h2>
            <ul className={styles.list}>
              <li><strong>Visi:</strong> Menjadi standar emas dalam industri perhiasan retail yang mengedepankan kepercayaan, kualitas, dan inovasi pelayanan.</li>
              <li><strong>Misi:</strong> 
                <br/>• Menyediakan perhiasan emas berkualitas dengan desain eksklusif
                <br/>• Memberikan transparansi harga yang mengikuti standar pasar
                <br/>• Menjamin layanan purna jual dan buyback yang menguntungkan pelanggan
              </li>
            </ul>
          </div>

          <div className={styles.sidebar}>
            <div className={`glass-card ${styles.certCard}`}>
              <h3>Sertifikasi & Keunggulan</h3>
              <ul className={styles.certList}>
                {storeInfo.certifications.map((cert, index) => (
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
    </div>
  );
}
