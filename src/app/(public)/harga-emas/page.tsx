"use client";

import styles from "./page.module.css";
import PriceTable from "@/components/PriceTable";
import Calculator from "@/components/Calculator";
import { getGoldPrices } from "@/lib/dataFetch";
import { useGoldPrice } from "@/hooks/useGoldPrice";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";

export default function HargaEmasPage() {
  const { dict, lang } = useLanguage();
  const [loadingInitial, setLoadingInitial] = useState(true);
  const { data: realTimeData, loading: goldLoading } = useGoldPrice();

  useEffect(() => {
    setLoadingInitial(false);
  }, []);

  if (loadingInitial || goldLoading) return <div style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>;

  const goldPrices = realTimeData || { prices: {} };

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>{dict.nav_prices.split(' ')[0]} <span className="text-gold-gradient">{dict.nav_prices.split(' ').slice(1).join(' ')}</span> & <span className="text-gold-gradient">{dict.nav_calculator}</span></h1>
          <p>{dict.calculator_subtitle}</p>
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
