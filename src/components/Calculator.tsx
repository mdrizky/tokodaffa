"use client";

import { useState, useEffect } from "react";
import styles from "./Calculator.module.css";
import { getStoreInfo } from "@/lib/storeFetch";
import { useLanguage } from "@/lib/i18n";

export default function Calculator({ initialPrices }: { initialPrices: any }) {
  const { dict, lang } = useLanguage();
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [kadar, setKadar] = useState<"24K" | "22K" | "18K" | "16K" | "Perak">("24K");
  const [weight, setWeight] = useState("5");
  const [ongkos, setOngkos] = useState("150000");

  useEffect(() => {
    async function load() {
      const s = await getStoreInfo();
      setStoreInfo(s);
    }
    load();
  }, []);

  const pricePerGram = initialPrices.prices[kadar];
  const weightNum = parseFloat(weight) || 0;
  const ongkosNum = parseFloat(ongkos) || 0;
  const basePrice = pricePerGram * weightNum;
  const total = basePrice + ongkosNum;

  const formatPrice = (p: number) =>
    new Intl.NumberFormat(lang === 'id' ? "id-ID" : "en-US", { 
      style: "currency", 
      currency: "IDR", 
      minimumFractionDigits: 0 
    }).format(p);

  const waUrl = storeInfo ? `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(
    lang === 'id' 
    ? `Halo TokoDaffa, saya baru saja menggunakan kalkulator website.\n\nHasil Simulasi:\n💎 Kadar: ${kadar}\n⚖️ Berat: ${weight}g\n🛠️ Ongkos Tukang: ${formatPrice(ongkosNum)}\n💰 *Estimasi Total: ${formatPrice(total)}*\n\nSaya ingin konsultasi gratis lebih lanjut tentang ini.`
    : `Hello TokoDaffa, I just used the website calculator.\n\nSimulation Results:\n💎 Purity: ${kadar}\n⚖️ Weight: ${weight}g\n🛠️ Labor Cost: ${formatPrice(ongkosNum)}\n💰 *Estimated Total: ${formatPrice(total)}*\n\nI'd like a free consultation about this.`
  )}` : '#';

  return (
    <div className={styles.calculator}>
      <div className={styles.inputs}>
        <div className={styles.field}>
          <label className={styles.label}>{dict.prod_kadar}</label>
          <div className={styles.kadarGrid}>
            {(["24K", "22K", "18K", "16K", "Perak"] as const).map((k) => (
              <button key={k} className={`${styles.kadarBtn} ${kadar === k ? styles.kadarActive : ""}`} onClick={() => setKadar(k)}>
                {k === 'Perak' && lang === 'en' ? 'Silver' : k}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{dict.prod_weight} (gram)</label>
          <div className={styles.inputWrap}>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min="0" step="0.1" className={styles.input} placeholder={lang === 'id' ? "Masukkan berat" : "Enter weight"} />
            <span className={styles.inputSuffix}>gram</span>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{lang === 'id' ? 'Ongkos Pembuatan' : 'Labor Cost'}</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputPrefix}>Rp</span>
            <input type="number" value={ongkos} onChange={(e) => setOngkos(e.target.value)} min="0" className={styles.input} placeholder={lang === 'id' ? "Ongkos tukang" : "Labor cost"} />
          </div>
        </div>
      </div>
      <div className={styles.result}>
        <div className={styles.resultHeader}><span className={styles.resultIcon}>◆</span><span>{dict.prod_price_est}</span></div>
        <div className={styles.breakdown}>
          <div className={styles.breakdownRow}><span>{lang === 'id' ? `Harga ${kadar} / gram` : `${kadar} Price / gram`}</span><span>{formatPrice(pricePerGram)}</span></div>
          <div className={styles.breakdownRow}><span>{dict.prod_weight}</span><span>{weightNum}g</span></div>
          <div className={styles.breakdownRow}><span>{lang === 'id' ? 'Subtotal emas' : 'Gold subtotal'}</span><span>{formatPrice(basePrice)}</span></div>
          <div className={styles.breakdownRow}><span>{lang === 'id' ? 'Ongkos pembuatan' : 'Labor cost'}</span><span>{formatPrice(ongkosNum)}</span></div>
          <div className={styles.divider} />
          <div className={`${styles.breakdownRow} ${styles.totalRow}`}><span>{lang === 'id' ? 'Total Estimasi' : 'Total Estimation'}</span><span className={styles.totalPrice}>{formatPrice(total)}</span></div>
        </div>
        
        <div className={styles.educationBox}>
          <strong>{lang === 'id' ? 'Tahukah Anda?' : 'Did you know?'}</strong> {lang === 'id' 
            ? `Jika Anda menabung uang ${formatPrice(total)} di bank, nilainya akan tergerus inflasi. Menyimpannya dalam bentuk emas menjaga nilai kekayaan Anda untuk jangka panjang.`
            : `If you save ${formatPrice(total)} in the bank, its value will be eroded by inflation. Keeping it in gold preserves your wealth in the long run.`}
        </div>

        <a href={waUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.waBtn}`}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" style={{ marginRight: '6px' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      </div>
    </div>
  );
}
