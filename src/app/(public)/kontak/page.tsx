import styles from "./page.module.css";
import { getStoreInfo } from "@/lib/storeFetch";

export default async function KontakPage() {
  const storeInfo = await getStoreInfo();
  
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className="container">
          <div className="gold-line" style={{ margin: "0 auto 16px" }} />
          <h1>Hubungi <span className="text-gold-gradient">Kami</span></h1>
          <p>Kami siap melayani kebutuhan perhiasan emas Anda</p>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.grid}`}>
          <div className={styles.info}>
            <div className={`glass-card ${styles.infoCard}`}>
              <h3>Informasi Kontak</h3>
              
              <div className={styles.infoItem}>
                <div className={styles.icon}>📍</div>
                <div>
                  <h4>Alamat</h4>
                  <p>{storeInfo.address}</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.icon}>📞</div>
                <div>
                  <h4>Telepon & WhatsApp</h4>
                  <p><a href={`tel:${storeInfo.phone}`}>{storeInfo.phone}</a></p>
                  <a href={`https://wa.me/${storeInfo.whatsapp}`} target="_blank" rel="noopener noreferrer" className={`btn btn-whatsapp ${styles.btnWa}`}>
                    Chat WhatsApp Sekarang
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
                  <h4>Jam Operasional</h4>
                  <ul className={styles.hoursList}>
                    <li><span>Senin - Jumat:</span> <span>{storeInfo.operating_hours.weekday}</span></li>
                    <li><span>Sabtu:</span> <span>{storeInfo.operating_hours.saturday}</span></li>
                    <li><span>Minggu:</span> <span>{storeInfo.operating_hours.sunday}</span></li>
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
