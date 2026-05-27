"use client";

import Link from "next/link";
import styles from "./Footer.module.css";
import { getStoreInfo } from "@/lib/storeFetch";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { dict } = useLanguage();
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function load() {
      const s = await getStoreInfo();
      setStoreInfo(s);
    }
    load();
  }, []);

  if (!storeInfo) return null;

  const instagram = storeInfo.instagram || storeInfo.social_media?.instagram;
  const facebook = storeInfo.facebook || storeInfo.social_media?.facebook;
  const tiktok = storeInfo.tiktok || storeInfo.social_media?.tiktok;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <img src="/images/logo_toko_4-removebg-preview.png" alt="Toko Mas Daffa" style={{ height: '80px', width: 'auto', marginBottom: '16px' }} />
            </div>
            <p className={styles.description}>{dict.footer_description}</p>
            <div className={styles.socials}>
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </a>
              )}
              {tiktok && (
                <a href={tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 104 4V4a5 5 0 005 5"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{dict.footer_menu}</h4>
            <Link href="/">{dict.nav_home}</Link>
            <Link href="/produk">{dict.nav_catalog}</Link>
            <Link href="/harga-emas">{dict.nav_prices}</Link>
            <Link href="/kalkulator">{dict.nav_calculator}</Link>
          </div>

          {/* Info */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{dict.footer_info}</h4>
            <Link href="/tentang">{dict.nav_about}</Link>
            <Link href="/kontak">{dict.nav_contact}</Link>
            <span>{dict.prod_guarantee}</span>
          </div>

          {/* Contact */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{dict.footer_contact}</h4>
            <span>{storeInfo.address}</span>
            <a href={`tel:${storeInfo.phone}`}>{storeInfo.phone}</a>
            <a href={`mailto:${storeInfo.email}`}>{storeInfo.email}</a>
            <div className={styles.hours}>
              <span>{dict.con_hours_mon_fri}: {storeInfo.operating_hours?.weekday}</span>
              <span>{dict.con_hours_sat}: {storeInfo.operating_hours?.saturday}</span>
              <span>{dict.con_hours_sun}: {storeInfo.operating_hours?.sunday}</span>
            </div>
          </div>

          {/* Map */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{dict.footer_map || 'Location'}</h4>
            {storeInfo.maps_embed ? (
              <div className={styles.mapWrapper}>
                <iframe
                  title="TokoDaffa Location"
                  src={storeInfo.maps_embed}
                  width="100%"
                  height="180"
                  style={{ border: 0, borderRadius: 8 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className={styles.mapWrapper}>
                <iframe
                  title="TokoDaffa Location"
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDgnMDAuMCJF!5e0!3m2!1sid!2sid!4v1`}
                  width="100%"
                  height="180"
                  style={{ border: 0, borderRadius: 8 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                storeInfo.address || "Toko Mas Daffa"
              )}`}
              target="_blank"
              rel="noreferrer noopener"
              className={styles.mapLink}
            >
              📍 {dict.nav_home === 'Beranda' ? 'Buka di Google Maps' : 'Open in Google Maps'}
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.bottomInner}>
            <p>&copy; {new Date().getFullYear()} {storeInfo.name}. All rights reserved.</p>
            <p className={styles.since}>{dict.nav_home === 'Beranda' ? 'Dipercaya sejak' : 'Trusted since'} {storeInfo.since}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
