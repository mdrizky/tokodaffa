import styles from "./page.module.css";
import PriceTable from "@/components/PriceTable";
import Calculator from "@/components/Calculator";
import { getGoldPrices } from "@/lib/dataFetch";

export const dynamic = 'force-dynamic';

export default async function HargaEmasPage() {
  const goldPrices = await getGoldPrices();
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>Harga Emas & <span className="text-gold-gradient">Kalkulator</span></h1>
          <p>Pantau pergerakan harga emas hari ini dan estimasikan nilai perhiasan Anda.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.contentGrid}>
            <div className={styles.mainContent}>
              <PriceTable initialPrices={goldPrices} />
            </div>
            <div className={styles.sideContent}>
              <Calculator initialPrices={goldPrices} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
