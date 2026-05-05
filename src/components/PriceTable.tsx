import styles from "./PriceTable.module.css";
import goldPrices from "@/data/gold-prices.json";

export default function PriceTable() {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const kadarList = ["24K", "22K", "18K", "16K"] as const;

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "▲";
    if (trend === "down") return "▼";
    return "—";
  };

  return (
    <div className={styles.tableWrap}>
      <div className={styles.header}>
        <h3 className={styles.title}>Harga Emas Hari Ini</h3>
        <span className={styles.date}>
          Diperbarui: {new Date(goldPrices.date).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className={styles.grid}>
        {kadarList.map((kadar) => {
          const price = goldPrices.prices[kadar];
          const trend = goldPrices.trend[kadar];
          const change = goldPrices.change[kadar];

          return (
            <div key={kadar} className={styles.priceCard}>
              <div className={styles.kadarBadge}>{kadar}</div>
              <div className={styles.priceValue}>{formatPrice(price)}</div>
              <div className={styles.perGram}>per gram</div>
              <div className={`${styles.change} ${trend === "up" ? styles.up : trend === "down" ? styles.down : styles.stable}`}>
                <span>{getTrendIcon(trend)}</span>
                <span>{change > 0 ? "+" : ""}{formatPrice(Math.abs(change))}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.footer}>
        <span className={styles.footerNote}>* Harga dapat berubah sewaktu-waktu</span>
        <span className={styles.margin}>Margin: {goldPrices.margin_percentage}%</span>
      </div>
    </div>
  );
}
