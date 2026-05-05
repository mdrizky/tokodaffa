"use client";

import { useState, useMemo } from "react";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import products from "@/data/products.json";

const categories = ["Semua", "cincin", "gelang", "kalung", "anting", "liontin", "batangan"];
const kadarOptions = ["Semua", "24K", "22K", "18K", "16K"];

export default function ProdukPage() {
  const [category, setCategory] = useState("Semua");
  const [kadar, setKadar] = useState("Semua");
  const [sortBy, setSortBy] = useState("featured");

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== "Semua") result = result.filter((p) => p.category === category);
    if (kadar !== "Semua") result = result.filter((p) => p.kadar === kadar);
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "weight": result.sort((a, b) => b.weight - a.weight); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }
    return result;
  }, [category, kadar, sortBy]);

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>Katalog <span className="text-gold-gradient">Produk</span></h1>
          <p>Temukan koleksi perhiasan emas berkualitas tinggi kami</p>
        </div>
      </section>

      <section className={`container ${styles.content}`}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Kategori</label>
            <div className={styles.filterBtns}>
              {categories.map((c) => (
                <button key={c} className={`${styles.filterBtn} ${category === c ? styles.filterActive : ""}`} onClick={() => setCategory(c)}>
                  {c === "Semua" ? "Semua" : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Kadar</label>
            <div className={styles.filterBtns}>
              {kadarOptions.map((k) => (
                <button key={k} className={`${styles.filterBtn} ${kadar === k ? styles.filterActive : ""}`} onClick={() => setKadar(k)}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Urutkan</label>
            <select className={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Unggulan</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="weight">Berat Terbesar</option>
            </select>
          </div>
        </div>

        <div className={styles.resultCount}>{filtered.length} produk ditemukan</div>

        <div className={styles.grid}>
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>◆</span>
            <p>Tidak ada produk yang sesuai filter.</p>
          </div>
        )}
      </section>
    </div>
  );
}
