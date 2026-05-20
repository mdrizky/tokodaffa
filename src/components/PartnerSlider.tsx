import styles from "./PartnerSlider.module.css";
import partners from "@/data/partners.json";

export default function PartnerSlider() {
  // Duplicate partners for infinite scroll effect
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className={styles.partnerSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>Trusted Partners & Collaborations</h2>
          <p>Bekerja sama dengan institusi terkemuka untuk memberikan layanan terbaik</p>
        </div>
        
        <div className={styles.sliderContainer}>
          <div className={styles.sliderTrack}>
            {duplicatedPartners.map((partner, index) => (
              <a
                key={`${partner.id}-${index}`}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.partnerCard}
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className={styles.partnerLogo}
                />
                <span className={styles.partnerName}>{partner.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
