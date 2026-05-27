"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import { useLanguage } from "@/lib/i18n";
import { getStoreInfo } from "@/lib/storeFetch";
import { useWishlist } from "@/hooks/useWishlist";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, dict } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { wishlist } = useWishlist();

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = stored || "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getStoreInfo().then(setStoreInfo);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const navLinks = [
    { href: "/", label: dict.nav_home },
    { href: "/produk", label: dict.nav_catalog },
    { href: "/harga-emas", label: dict.nav_prices },
    { href: "/kalkulator", label: dict.nav_calculator },
    { href: "/layanan", label: dict.nav_services },
    { href: "/blog", label: "Blog" },
    { href: "/tentang", label: dict.nav_about },
    { href: "/kontak", label: dict.nav_contact },
  ];

  const name = storeInfo?.name || "TokoDaffa";
  const highlight = storeInfo?.logo_highlight || "Daffa";
  const [before, after] = highlight ? name.split(highlight) : [name, ""];

  return (
    <>
      {/* Announcement Banner */}
      {storeInfo?.banner_active && storeInfo?.banner_announcement && (
        <div className={styles.banner}>
          <p>{storeInfo.banner_announcement}</p>
        </div>
      )}

      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <img 
              src="/images/logo_toko_4-removebg-preview.png" 
              alt="Toko Mas Daffa" 
              className={styles.logoImage}
            />
          </Link>

          {/* Desktop Nav */}
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${pathname === link.href ? styles.active : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className={styles.actions}>
            {/* Search Button */}
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Cari Produk"
              title="Cari Produk"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className={styles.wishlistBtn} aria-label="Wishlist" title="Wishlist Saya">
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlist.length > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlist.length > 0 && <span className={styles.wishlistCount}>{wishlist.length}</span>}
            </Link>

            {/* Language Toggle */}
            <button className={styles.langBtn} onClick={() => setLang(lang === "id" ? "en" : "id")}>
              {lang === "id" ? "EN" : "ID"}
            </button>

            {/* Theme Toggle */}
            <button className={styles.themeBtn} onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {/* WA Button */}
            {storeInfo && (
              <a
                href={`https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent("Halo TokoDaffa, saya ingin bertanya tentang produk Anda 🙏")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-whatsapp ${styles.waBtn}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}
          </div>

          {/* Hamburger */}
          <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen1 : ""}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen2 : ""}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen3 : ""}`} />
          </button>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className={styles.searchOverlay}>
            <div className={styles.searchOverlayInner}>
              <SearchBar onClose={() => setSearchOpen(false)} />
              <button className={styles.searchClose} onClick={() => setSearchOpen(false)}>✕ Tutup</button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
          <ul className={styles.mobileLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.mobileLink} ${pathname === link.href ? styles.active : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/wishlist" className={styles.mobileLink}>
                ❤️ Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
              </Link>
            </li>
          </ul>

          <div className={styles.mobileActions}>
            <button className={styles.langBtn} onClick={() => setLang(lang === "id" ? "en" : "id")}>
              {lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
            </button>
            <button className={styles.themeBtn} onClick={toggleTheme}>
              {theme === "dark" ? "☀️ Mode Terang" : "🌙 Mode Gelap"}
            </button>
            {storeInfo && (
              <a
                href={`https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent("Halo TokoDaffa, saya ingin bertanya tentang produk Anda 🙏")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn btn-whatsapp`}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Chat WhatsApp Sekarang
              </a>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
