"use client";

import { useState } from "react";
import styles from "./Calculator.module.css";
import goldPrices from "@/data/gold-prices.json";
import storeInfo from "@/data/store-info.json";

export default function Calculator() {
  const [kadar, setKadar] = useState<"24K" | "22K" | "18K" | "16K">("24K");
  const [weight, setWeight] = useState("5");
  const [ongkos, setOngkos] = useState("150000");

  const pricePerGram = goldPrices.prices[kadar];
  const weightNum = parseFloat(weight) || 0;
  const ongkosNum = parseFloat(ongkos) || 0;
  const basePrice = pricePerGram * weightNum;
  const total = basePrice + ongkosNum;

  const fmt = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  const waUrl = `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(
    `Halo TokoDaffa, saya ingin tanya:\n💎 Kadar: ${kadar}\n⚖️ Berat: ${weightNum}g\n💰 Estimasi: ${fmt(total)}\nApakah tersedia?`
  )}`;

  return (
    <div className={styles.calculator}>
      <div className={styles.inputs}>
        <div className={styles.field}>
          <label className={styles.label}>Kadar Emas</label>
          <div className={styles.kadarGrid}>
            {(["24K", "22K", "18K", "16K"] as const).map((k) => (
              <button key={k} className={`${styles.kadarBtn} ${kadar === k ? styles.kadarActive : ""}`} onClick={() => setKadar(k)}>{k}</button>
            ))}
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Berat (gram)</label>
          <div className={styles.inputWrap}>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} min="0" step="0.1" className={styles.input} placeholder="Masukkan berat" />
            <span className={styles.inputSuffix}>gram</span>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Ongkos Pembuatan</label>
          <div className={styles.inputWrap}>
            <span className={styles.inputPrefix}>Rp</span>
            <input type="number" value={ongkos} onChange={(e) => setOngkos(e.target.value)} min="0" className={styles.input} placeholder="Ongkos tukang" />
          </div>
        </div>
      </div>
      <div className={styles.result}>
        <div className={styles.resultHeader}><span className={styles.resultIcon}>◆</span><span>Estimasi Harga</span></div>
        <div className={styles.breakdown}>
          <div className={styles.breakdownRow}><span>Harga {kadar} / gram</span><span>{fmt(pricePerGram)}</span></div>
          <div className={styles.breakdownRow}><span>Berat</span><span>{weightNum}g</span></div>
          <div className={styles.breakdownRow}><span>Subtotal emas</span><span>{fmt(basePrice)}</span></div>
          <div className={styles.breakdownRow}><span>Ongkos pembuatan</span><span>{fmt(ongkosNum)}</span></div>
          <div className={styles.divider} />
          <div className={`${styles.breakdownRow} ${styles.totalRow}`}><span>Total Estimasi</span><span className={styles.totalPrice}>{fmt(total)}</span></div>
        </div>
        <a href={waUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.waBtn}`}>Tanya Harga via WhatsApp</a>
      </div>
    </div>
  );
}
