"use client";

import styles from "./PriceTable.module.css";
import { useLanguage } from "@/lib/i18n";
import { getStoreInfo } from "@/lib/storeFetch";
import { useState, useEffect } from "react";

export default function PriceTable({ initialPrices }: { initialPrices: any }) {
  const { dict, lang } = useLanguage();
  const [storeInfo, setStoreInfo] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const s = await getStoreInfo();
      setStoreInfo(s);
    }
    load();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(lang === 'id' ? "id-ID" : "en-US", { 
      style: "currency", 
      currency: "IDR", 
      minimumFractionDigits: 0 
    }).format(price);

  const lastUpdated = new Date(initialPrices.meta?.timestamp || initialPrices.last_updated || Date.now()).toLocaleDateString(lang === 'id' ? "id-ID" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <span className={styles.icon}>📈</span>
          <h2 className={styles.title}>{dict.nav_prices} (Real-Time)</h2>
        </div>
        <div className={styles.updatedBadge}>
          <span className={styles.pulse}></span>
          {lang === 'id' ? 'Update' : 'Updated'}: {lastUpdated}
        </div>
      </div>
      
      <div className={styles.grid}>
        {(["24K", "22K", "18K", "16K", "Perak"] as const).map((kadar) => (
          <div key={kadar} className={styles.priceCard}>
            <div className={styles.kadarBadge}>{kadar === 'Perak' && lang === 'en' ? 'Silver' : kadar}</div>
            <div className={styles.priceValue}>{formatPrice(initialPrices.prices[kadar])}</div>
            <div className={styles.perGram}>{lang === 'id' ? 'per gram' : 'per gram'}</div>
          </div>
        ))}
        {initialPrices.buyback && (
          <div className={`${styles.priceCard} ${styles.buybackCard}`}>
            <div className={styles.kadarBadge} style={{ background: 'linear-gradient(135deg, #ef4444, #991b1b)' }}>
              {lang === 'id' ? 'Buyback (Terima)' : 'Buyback Rate'}
            </div>
            <div className={styles.priceValue}>{formatPrice(initialPrices.buyback)}</div>
            <div className={styles.perGram}>{lang === 'id' ? 'estimasi terima' : 'est. buyback'}</div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <p className={styles.note}>* {dict.prod_price_alert}</p>
        {storeInfo && (
          <a href={`https://wa.me/${storeInfo.whatsapp}?text=Halo%20TokoDaffa,%20apakah%20harga%20emas%20hari%20ini%20masih%20sama?`} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {dict.con_send_wa} →
          </a>
        )}
      </div>
    </div>
  );
}
