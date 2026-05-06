"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/dataFetch";

const categories = ["Semua", "cincin", "gelang", "kalung", "anting", "liontin", "batangan"];
const kadarOptions = ["Semua", "24K", "22K", "18K", "16K", "925"];
const materialOptions = ["Semua", "emas", "perak"];

export default function ProdukPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("Semua");
  const [kadar, setKadar] = useState("Semua");
  const [material, setMaterial] = useState("Semua");
  const { dict } = useLanguage();

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (category !== "Semua") result = result.filter((p) => p.category === category);
    if (kadar !== "Semua") result = result.filter((p) => p.kadar === kadar);
    if (material !== "Semua") result = result.filter((p) => p.material === material);
    
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "weight": result.sort((a, b) => b.weight - a.weight); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }
    return result;
  }, [products, category, kadar, material, sortBy]);

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>{dict.cat_title.split(' ')[0]} <span className="text-gold-gradient">{dict.cat_title.split(' ').slice(1).join(' ')}</span></h1>
          <p>{dict.cat_subtitle}</p>
        </div>
      </section>

      <section className={`container ${styles.content}`}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{dict.prod_category}</label>
            <div className={styles.filterBtns}>
              {categories.map((c) => (
                <button key={c} className={`${styles.filterBtn} ${category === c ? styles.filterActive : ""}`} onClick={() => setCategory(c)}>
                  {c === "Semua" ? dict.cat_all : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{dict.prod_material}</label>
            <div className={styles.filterBtns}>
              {materialOptions.map((m) => (
                <button key={m} className={`${styles.filterBtn} ${material === m ? styles.filterActive : ""}`} onClick={() => setMaterial(m)}>
                  {m === "Semua" ? dict.cat_all : m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{dict.prod_kadar}</label>
            <div className={styles.filterBtns}>
              {kadarOptions.map((k) => (
                <button key={k} className={`${styles.filterBtn} ${kadar === k ? styles.filterActive : ""}`} onClick={() => setKadar(k)}>
                  {k === "Semua" ? dict.cat_all : k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
           <div style={{textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>Loading...</div>
        ) : (
          <>
            <div className={styles.resultCount}>{filtered.length} {dict.nav_home === 'Beranda' ? 'produk ditemukan' : 'products found'}</div>

            <div className={styles.grid}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>◆</span>
                <p>{dict.nav_home === 'Beranda' ? 'Tidak ada produk yang sesuai filter.' : 'No products found with these filters.'}</p>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
