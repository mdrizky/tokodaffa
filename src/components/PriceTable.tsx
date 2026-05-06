import styles from "./PriceTable.module.css";
import storeInfo from "@/data/store-info.json";

export default function PriceTable({ initialPrices }: { initialPrices: any }) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const lastUpdated = new Date(initialPrices.last_updated).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <span className={styles.icon}>📈</span>
          <h2 className={styles.title}>Harga Emas Hari Ini</h2>
        </div>
        <div className={styles.updatedBadge}>
          <span className={styles.pulse}></span>
          Update: {lastUpdated}
        </div>
      </div>
      
      <div className={styles.grid}>
        {(["24K", "22K", "18K", "16K", "Perak"] as const).map((kadar) => (
          <div key={kadar} className={styles.priceCard}>
            <div className={styles.kadarBadge}>{kadar}</div>
            <div className={styles.priceValue}>{formatPrice(initialPrices.prices[kadar])}</div>
            <div className={styles.perGram}>per gram</div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <p className={styles.note}>*Harga dapat berubah sewaktu-waktu. Belum termasuk ongkos pembuatan untuk perhiasan.</p>
        <a href={`https://wa.me/${storeInfo.whatsapp}?text=Halo%20TokoDaffa,%20apakah%20harga%20emas%20hari%20ini%20masih%20sama?`} target="_blank" rel="noopener noreferrer" className={styles.link}>
          Tanya Harga Real-time →
        </a>
      </div>
    </div>
  );
}
