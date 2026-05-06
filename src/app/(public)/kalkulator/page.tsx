import styles from "./page.module.css";
import Calculator from "@/components/Calculator";
import { getGoldPrices } from "@/lib/dataFetch";

export const dynamic = 'force-dynamic';

export default async function KalkulatorPage() {
  const goldPrices = await getGoldPrices();
  
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>Kalkulator <span className="text-gold-gradient">Simulasi Harga</span></h1>
          <p>Hitung estimasi harga perhiasan emas & perak Anda dengan harga pasar terbaru.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.calcWrapper}>
            <Calculator initialPrices={goldPrices} />
          </div>
          
          <div className={styles.infoBox}>
            <h3>Catatan Penting:</h3>
            <ul>
              <li>Hasil perhitungan adalah <strong>estimasi</strong> berdasarkan harga emas/perak hari ini.</li>
              <li>Harga belum termasuk <strong>ongkos pembuatan</strong> (ongkos tukang) yang bervariasi tergantung kerumitan model.</li>
              <li>Untuk mendapatkan harga pasti, silakan hubungi admin atau datang langsung ke toko kami.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
