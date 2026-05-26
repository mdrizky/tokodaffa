"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { getStoreInfo } from "@/lib/storeFetch";
import { getProducts, getGoldPrices } from "@/lib/dataFetch";
import { useLanguage } from "@/lib/i18n";
import { useWishlist } from "@/hooks/useWishlist";
import { useState, useEffect, useCallback } from "react";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { dict } = useLanguage();
  const { wishlist, toggleWishlist } = useWishlist();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const p = await getProducts();
      const g = await getGoldPrices();
      const s = await getStoreInfo();
      const product = p.find((item: any) => item.id.toString() === params.id || item.slug === params.id);
      if (product) {
        const related = p.filter((item: any) => item.category === product.category && item.id !== product.id).slice(0, 4);
        setRelatedProducts(related);
      }
      setData({ product, goldPrices: g, storeInfo: s });
      setLoading(false);
    }
    load();
  }, [params.id]);

  // Track page view
  useEffect(() => {
    if (data?.product) {
      fetch("/api/wa-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "product_view", product_id: data.product.id, product_name: data.product.name, referrer: "/produk" }),
      }).catch(() => {});
    }
  }, [data?.product]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!data?.product) return;
    const images = data.product.images && data.product.images.length > 0 ? data.product.images : [data.product.photo];
    if (e.key === "ArrowLeft") setActiveImage(prev => (prev - 1 + images.length) % images.length);
    if (e.key === "ArrowRight") setActiveImage(prev => (prev + 1) % images.length);
    if (e.key === "Escape") setZoomed(false);
  }, [data?.product]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (loading) return (
    <div className={styles.loadingWrap}>
      <div className={styles.loadingSpinner} />
      <span>Memuat detail produk...</span>
    </div>
  );
  if (!data?.product) notFound();

  const { product, goldPrices, storeInfo } = data;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  const isEmas = product.material?.toLowerCase() === 'emas';
  const baseGoldPricePerGram = isEmas ? (goldPrices.prices as any)[product.kadar] || 0 : 0;
  const rawGoldValue = baseGoldPricePerGram * product.weight;
  const estimatedOngkos = product.ongkos || (product.price > rawGoldValue ? product.price - rawGoldValue : 0);

  const waUrl = `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(
    `Halo TokoDaffa, saya tertarik dengan produk:\n\n📿 *${product.name}*\n💎 Kadar: ${product.kadar}\n⚖️ Berat: ${product.weight}g\n💰 Estimasi: ${formatPrice(product.price)}\n\nLink: https://tokodaffa.vercel.app/produk/${product.id}\n\nApakah masih tersedia?`
  )}`;

  const images: string[] = product.images && product.images.length > 0
    ? [product.photo, ...product.images.filter((img: string) => img !== product.photo)]
    : [product.photo];

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/produk" className={styles.backLink}>
          ← {dict.prod_back}
        </Link>

        <div className={styles.grid}>
          {/* Left Column: Image Gallery */}
          <div className={styles.galleryColumn}>
            <div className={styles.mainImageWrap} onClick={() => setZoomed(true)}>
              <img src={images[activeImage]} alt={product.name} className={styles.mainImage} />
              <div className={styles.badges}>
                {isEmas ? (
                  <span className={`badge badge-gold`}>{product.kadar}</span>
                ) : (
                  <span className={`badge`} style={{ background: '#e2e8f0', color: '#475569', border: '1px solid #cbd5e1' }}>Perak</span>
                )}
                {product.stock > 0 && product.stock <= 3 ? (
                  <span className={`badge badge-danger`}>🔥 Sisa {product.stock}</span>
                ) : product.stock > 3 ? (
                  <span className={`badge badge-success`}>Tersedia</span>
                ) : (
                  <span className={`badge badge-danger`}>Habis</span>
                )}
              </div>
              <div className={styles.zoomHint}>🔍 Klik untuk zoom</div>
              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button className={`${styles.galleryNav} ${styles.galleryNavLeft}`} onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev - 1 + images.length) % images.length); }}>‹</button>
                  <button className={`${styles.galleryNav} ${styles.galleryNavRight}`} onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev + 1) % images.length); }}>›</button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className={styles.thumbnailGrid}>
                {images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    className={`${styles.thumbnail} ${idx === activeImage ? styles.thumbnailActive : ''}`}
                    onClick={() => setActiveImage(idx)}
                  >
                    <img src={img} alt={`${product.name} - ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className={styles.detailsColumn}>
            <div className={styles.header}>
              <div className={styles.headerTop}>
                <span className={styles.categoryBadge}>{product.category}</span>
                <button
                  className={`${styles.wishBtn} ${isWishlisted ? styles.wishBtnActive : ''}`}
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={isWishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <h1 className={styles.title}>{product.name}</h1>
              {product.sku && <span className={styles.skuLabel}>SKU: {product.sku}</span>}
            </div>

            <div className={styles.priceSection}>
              <div className={styles.priceLabel}>{dict.prod_price_est}</div>
              <div className={styles.price}>{formatPrice(product.price)}</div>

              {isEmas && baseGoldPricePerGram > 0 && (
                <div className={styles.priceBreakdown}>
                  <div className={styles.breakdownRow}>
                    <span>Harga Emas {product.kadar} ({product.weight}g):</span>
                    <span>{formatPrice(rawGoldValue)}</span>
                  </div>
                  <div className={styles.breakdownRow}>
                    <span>Estimasi Ongkos Tukang:</span>
                    <span>{formatPrice(estimatedOngkos)}</span>
                  </div>
                </div>
              )}

              <div className={styles.priceAlert}>
                ⚠️ {dict.prod_price_alert}
              </div>
            </div>

            <div className={styles.actions}>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.btnWa}`}
                onClick={() => { fetch("/api/wa-track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event: "product_inquiry", product_id: product.id, product_name: product.name, referrer: `/produk/${product.id}` }) }).catch(() => {}); }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ marginRight: '8px' }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {dict.prod_buy_wa}
              </a>
              <div className={styles.guarantee}>
                🛡️ {dict.prod_guarantee}
              </div>
            </div>

            <div className={styles.specSection}>
              <h3>{dict.prod_spec}</h3>
              <div className={styles.specGrid}>
                <div className={styles.specItem}>
                  <span>{dict.prod_material}</span>
                  <strong>{product.material}</strong>
                </div>
                <div className={styles.specItem}>
                  <span>{dict.prod_kadar}</span>
                  <strong>{product.kadar}</strong>
                </div>
                <div className={styles.specItem}>
                  <span>{dict.prod_weight}</span>
                  <strong>{product.weight} gram</strong>
                </div>
                <div className={styles.specItem}>
                  <span>{dict.prod_category}</span>
                  <strong>{product.category}</strong>
                </div>
                {product.warranty_info && (
                  <div className={`${styles.specItem} ${styles.specItemFull}`}>
                    <span>Garansi</span>
                    <strong>{product.warranty_info}</strong>
                  </div>
                )}
              </div>
            </div>

            {product.description && (
              <div className={styles.descriptionSection}>
                <h3>{dict.prod_desc}</h3>
                <p>{product.description}</p>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div className={styles.tagsSection}>
                {product.tags.map((tag: string, i: number) => (
                  <span key={i} className={styles.tagPill}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>Produk Serupa</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((rp: any) => (
                <Link key={rp.id} href={`/produk/${rp.id}`} className={styles.relatedCard}>
                  <div className={styles.relatedImageWrap}>
                    <img src={rp.photo} alt={rp.name} />
                  </div>
                  <div className={styles.relatedInfo}>
                    <span className={styles.relatedName}>{rp.name}</span>
                    <span className={styles.relatedPrice}>{formatPrice(rp.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomed && (
        <div className={styles.zoomOverlay} onClick={() => setZoomed(false)}>
          <button className={styles.zoomClose} onClick={() => setZoomed(false)}>✕</button>
          <img src={images[activeImage]} alt={product.name} className={styles.zoomImage} onClick={(e) => e.stopPropagation()} />
          {images.length > 1 && (
            <div className={styles.zoomNav}>
              <button onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev - 1 + images.length) % images.length); }}>‹</button>
              <span>{activeImage + 1} / {images.length}</span>
              <button onClick={(e) => { e.stopPropagation(); setActiveImage(prev => (prev + 1) % images.length); }}>›</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
