"use client";

import styles from "./page.module.css";
import { getStoreInfo } from "@/lib/storeFetch";
import { useLanguage } from "@/lib/i18n";
import { useState, useEffect } from "react";

export default function KontakPage() {
  const { dict } = useLanguage();
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const s = await getStoreInfo();
      setStoreInfo(s);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>;
  if (!storeInfo) return null;

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>{dict.con_title.split(' ')[0]} <span className="text-gold-gradient">{dict.con_title.split(' ').slice(1).join(' ')}</span></h1>
          <p>{dict.con_subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.info}>
            <div className={`glass-card ${styles.infoCard}`}>
              <h3>{dict.nav_contact}</h3>
              
              <div className={styles.infoItem}>
                <div className={styles.icon}>📍</div>
                <div>
                  <h4>{dict.con_address}</h4>
                  <p>{storeInfo.address}</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.icon}>📞</div>
                <div>
                  <h4>Telepon & WhatsApp</h4>
                  <p><a href={`tel:${storeInfo.phone}`}>{storeInfo.phone}</a></p>
                  <a href={`https://wa.me/${storeInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.btnWa}`}>
                    {dict.con_send_wa}
                  </a>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.icon}>✉️</div>
                <div>
                  <h4>Email</h4>
                  <p><a href={`mailto:${storeInfo.email}`}>{storeInfo.email}</a></p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.icon}>🕒</div>
                <div>
                  <h4>{dict.con_hours}</h4>
                  <ul className={styles.hoursList}>
                    <li><span>{dict.con_hours_mon_fri}:</span> <span>{storeInfo.operating_hours?.weekday}</span></li>
                    <li><span>{dict.con_hours_sat}:</span> <span>{storeInfo.operating_hours?.saturday}</span></li>
                    <li><span>{dict.con_hours_sun}:</span> <span>{storeInfo.operating_hours?.sunday}</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.map}>
            <iframe 
              src={storeInfo.maps_embed} 
              width="100%" 
              height="100%" 
              style={{ border: 0, borderRadius: "20px" }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
