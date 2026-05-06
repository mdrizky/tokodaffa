"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/i18n";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, dict } = useLanguage();
  const [storeInfo, setStoreInfo] = useState<any>(null);

  const navLinks = [
    { href: "/", label: dict.nav_home },
    { href: "/produk", label: dict.nav_catalog },
    { href: "/harga-emas", label: dict.nav_prices },
    { href: "/kalkulator", label: dict.nav_calculator },
    { href: "/layanan", label: dict.nav_services },
    { href: "/tentang", label: dict.nav_about },
  ];

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    async function load() {
      const s = await getStoreInfo();
      setStoreInfo(s);
    }
    load();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>◆</span>
          <span className={styles.logoText}>
            {storeInfo?.name?.split(storeInfo?.logo_highlight || 'Daffa')[0] || 'Toko'}
            <span className={styles.logoGold}>{storeInfo?.logo_highlight || 'Daffa'}</span>
          </span>
        </Link>

        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
            >
              {link.label}
            </Link>
          ))}
          
          <div className={styles.switchers}>
            <button 
              className={styles.switcherBtn} 
              onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              aria-label="Toggle Language"
            >
              {lang.toUpperCase()}
            </button>
            
            <button 
              className={styles.switcherBtn} 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          <Link href="/kontak" className={`btn btn-gold ${styles.navCta}`}>
            {dict.nav_contact}
          </Link>
        </nav>

        <button
          className={`${styles.burger} ${mobileOpen ? styles.burgerOpen : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.overlay} onClick={() => setMobileOpen(false)} />
      )}
    </header>
  );
}
