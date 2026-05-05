import styles from "./page.module.css";
import PriceTable from "@/components/PriceTable";
import Calculator from "@/components/Calculator";

export default function HargaEmasPage() {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>Harga <span className="text-gold-gradient">Emas Terkini</span></h1>
          <p>Pantau harga emas hari ini dan simulasikan investasi Anda</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "20px" }}>
        <div className="container">
          <PriceTable />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Kalkulator <span className="text-gold-gradient">Investasi</span></h2>
            <p>Hitung estimasi nilai emas Anda berdasarkan harga hari ini</p>
          </div>
          <Calculator />
        </div>
      </section>
    </div>
  );
}
