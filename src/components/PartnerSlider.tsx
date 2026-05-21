"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import partners from "@/data/partners.json";
import styles from "./PartnerSlider.module.css";
import { useLanguage } from "@/lib/i18n";

export default function PartnerSlider() {
  const [mounted, setMounted] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || partners.length === 0) return null;

  return (
    <section className={styles.sliderSection}>
      <div className="container">
        <div className={styles.sliderHeader}>
          <p>{lang === 'id' ? 'Telah Dipercaya & Bekerjasama Dengan' : 'Trusted & Collaborating With'}</p>
        </div>
        <Swiper
          modules={[Autoplay]}
          loop={true}
          slidesPerView={2}
          spaceBetween={20}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          className={styles.partnerSwiper}
        >
          {partners.map((partner) => (
            <SwiperSlide key={partner.id}>
              <div className={styles.partnerCard}>
                <div className={styles.partnerLogoWrap}>
                  <img src={partner.logo} alt={partner.name} />
                </div>
                <span className={styles.partnerName}>{partner.name}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
