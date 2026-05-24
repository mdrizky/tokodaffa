"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";


interface SearchBarProps {
  onClose?: () => void;
  inline?: boolean;
}

export default function SearchBar({ onClose, inline = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!query.trim() || query.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const handleSelect = (product: any) => {
    const href = product.slug ? `/produk/${product.slug}` : `/produk/${product.id}`;
    router.push(href);
    onClose?.();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/produk?q=${encodeURIComponent(query)}`);
      onClose?.();
    }
  };

  return (
    <div className={`${styles.searchBar} ${inline ? styles.inline : ''}`}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrap}>
          <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari perhiasan, emas batangan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
          />
          {query && (
            <button type="button" className={styles.clearBtn} onClick={() => setQuery("")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </form>

      {query.length >= 2 && (
        <div className={styles.dropdown}>
          {loading && <div className={styles.loading}>Mencari...</div>}
          
          {!loading && results.length === 0 && (
            <div className={styles.noResults}>
              <span>Tidak ada produk untuk "{query}"</span>
              <button onClick={() => { router.push('/produk'); onClose?.(); }} className={styles.viewAll}>
                Lihat semua produk →
              </button>
            </div>
          )}

          {results.map((product) => (
            <button key={product.id} className={styles.resultItem} onClick={() => handleSelect(product)}>
              <div className={styles.resultImage}>
                {product.photo && !product.photo.startsWith('/products/') ? (
                  <img src={product.photo} alt={product.name} />
                ) : (
                  <span>{product.category === 'cincin' ? '💍' : product.category === 'gelang' ? '⭕' : product.category === 'batangan' ? '🏅' : '💎'}</span>
                )}
              </div>
              <div className={styles.resultInfo}>
                <span className={styles.resultName}>{product.name}</span>
                <span className={styles.resultMeta}>{product.kadar} • {product.weight}g</span>
              </div>
              <span className={styles.resultPrice}>{formatPrice(product.price)}</span>
            </button>
          ))}

          {results.length > 0 && (
            <button className={styles.viewAllBtn} onClick={() => { router.push(`/produk?q=${encodeURIComponent(query)}`); onClose?.(); }}>
              Lihat semua hasil untuk "{query}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
