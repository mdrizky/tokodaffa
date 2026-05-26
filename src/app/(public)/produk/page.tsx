"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/dataFetch";
import { useLanguage } from "@/lib/i18n";

const categories = ["Semua", "cincin", "gelang", "kalung", "anting", "liontin", "batangan"];
const kadarOptions = ["Semua", "24K", "22K", "18K", "17K", "16K", "14K", "925", "perak"];
const materialOptions = ["Semua", "emas", "perak", "emas_putih", "platinum"];

function ProdukContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [category, setCategory] = useState("Semua");
  const [kadar, setKadar] = useState("Semua");
  const [material, setMaterial] = useState("Semua");
  const [sortBy, setSortBy] = useState("featured");
  const { dict } = useLanguage();

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    setSearchQuery(queryParam);
  }, [queryParam]);

  const filtered = useMemo(() => {
    let result = [...products];

    // Search text filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.tags && p.tags.join(" ").toLowerCase().includes(q))
      );
    }

    if (category !== "Semua") result = result.filter((p) => p.category === category);
    if (kadar !== "Semua") result = result.filter((p) => p.kadar === kadar);
    if (material !== "Semua") result = result.filter((p) => p.material === material);
    
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "weight": result.sort((a, b) => b.weight - a.weight); break;
      case "newest": result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break;
      default: result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }
    return result;
  }, [products, searchQuery, category, kadar, material, sortBy]);

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>
            {searchQuery ? (
              <>Hasil Pencarian: <span className="text-gold-gradient">"{searchQuery}"</span></>
            ) : (
              <>{dict.cat_title.split(' ')[0]} <span className="text-gold-gradient">{dict.cat_title.split(' ').slice(1).join(' ')}</span></>
            )}
          </h1>
          <p>{dict.cat_subtitle}</p>
        </div>
      </section>

      <section className={`container ${styles.content}`}>
        <div className={styles.filters}>
          
          {searchQuery && (
            <div className={styles.filterGroup}>
              <div className={styles.activeSearch}>
                <span>Mencari: <strong>{searchQuery}</strong></span>
                <button onClick={() => setSearchQuery("")}>✕ Hapus</button>
              </div>
            </div>
          )}

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
                  {m === "Semua" ? dict.cat_all : m.replace('_', ' ').toUpperCase()}
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
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>{dict.nav_home === 'Beranda' ? 'Urutkan' : 'Sort By'}</label>
            <select className={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">{dict.nav_home === 'Beranda' ? 'Unggulan' : 'Featured'}</option>
              <option value="newest">{dict.nav_home === 'Beranda' ? 'Terbaru' : 'Newest'}</option>
              <option value="price-asc">{dict.nav_home === 'Beranda' ? 'Harga Terendah' : 'Lowest Price'}</option>
              <option value="price-desc">{dict.nav_home === 'Beranda' ? 'Harga Tertinggi' : 'Highest Price'}</option>
              <option value="weight">{dict.nav_home === 'Beranda' ? 'Berat Terbesar' : 'Highest Weight'}</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{textAlign: 'center', padding: '60px', color: 'var(--gold-primary)'}}>
            <div style={{width: '40px', height: '40px', border: '3px solid var(--gold-muted)', borderTopColor: 'var(--gold-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px'}} />
            Memuat Katalog...
          </div>
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
                <button className={`btn btn-outline`} style={{marginTop: '16px'}} onClick={() => { setCategory("Semua"); setKadar("Semua"); setMaterial("Semua"); setSearchQuery(""); }}>
                  Reset Semua Filter
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default function ProdukPage() {
  return (
    <Suspense fallback={<div style={{padding: '200px 0', textAlign: 'center'}}>Loading...</div>}>
      <ProdukContent />
    </Suspense>
  );
}
