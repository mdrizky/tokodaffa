"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { getStoreInfo } from "@/lib/storeFetch";
import { getProducts, getGoldPrices } from "@/lib/dataFetch";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { dict } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getProducts();
      const g = await getGoldPrices();
      const s = await getStoreInfo();
      const product = p.find((item: any) => item.id.toString() === params.id);
      setData({ product, goldPrices: g, storeInfo: s });
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>;
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

  const images = product.images && product.images.length > 0 ? product.images : [product.photo];

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/produk" className={styles.backLink}>
          ← {dict.prod_back}
        </Link>

        <div className={styles.grid}>
          {/* Left Column: Image Gallery */}
          <div className={styles.galleryColumn}>
            <div className={styles.mainImageWrap}>
              <img src={images[0]} alt={product.name} className={styles.mainImage} />
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
            </div>
          </div>

          {/* Right Column: Details */}
          <div className={styles.detailsColumn}>
            <div className={styles.header}>
              <span className={styles.categoryBadge}>{product.category}</span>
              <h1 className={styles.title}>{product.name}</h1>
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
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.btnWa}`}>
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
              </div>
            </div>

            <div className={styles.descriptionSection}>
              <h3>{dict.prod_desc}</h3>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
