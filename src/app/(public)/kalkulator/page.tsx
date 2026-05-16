"use client";

import styles from "./page.module.css";
import Calculator from "@/components/Calculator";
import { getGoldPrices } from "@/lib/dataFetch";
import { useGoldPrice } from "@/hooks/useGoldPrice";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";

export default function KalkulatorPage() {
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
          <h1>{dict.nav_calculator.split(' ')[0]} <span className="text-gold-gradient">{dict.nav_calculator.split(' ').slice(1).join(' ')}</span></h1>
          <p>{dict.calculator_subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.calcWrapper}>
            <Calculator initialPrices={goldPrices} />
          </div>
          
          <div className={styles.infoBox}>
            <h3>{lang === 'id' ? 'Catatan Penting:' : 'Important Notes:'}</h3>
            <ul>
              <li>{lang === 'id' ? 'Hasil perhitungan adalah estimasi berdasarkan harga hari ini.' : 'Calculation results are estimates based on today\'s price.'}</li>
              <li>{lang === 'id' ? 'Harga belum termasuk ongkos pembuatan yang bervariasi.' : 'Price does not include labor costs which vary.'}</li>
              <li>{lang === 'id' ? 'Untuk harga pasti, silakan hubungi admin.' : 'For exact price, please contact admin.'}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
