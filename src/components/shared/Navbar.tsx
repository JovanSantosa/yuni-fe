"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Moon, Sun, X, LogIn, Globe, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage, Locale } from "@/context/LanguageContext";
import { useSWRConfig } from "swr";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, systemTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const { mutate } = useSWRConfig();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      if (pathname === "/") {
        const sections = ["faq", "lokasi", "keunggulan", "tentang", "hero"];
        const scrollPosition = window.scrollY + 200;

        for (const sectionId of sections) {
          const el = document.getElementById(sectionId);
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top) {
              setActiveSection(sectionId);
              break;
            }
          }
        }

        if (window.scrollY < 150) {
          setActiveSection("hero");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const toggleTheme = () => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsLangDropdownOpen(false);
    // Revalidate public data from backend with new Accept-Language
    mutate("/settings");
    mutate("/faqs");
    mutate("/testimonials");
  };

  const languages = [
    { code: "id", label: "Indonesia", flag: "🇮🇩" },
    { code: "zh-TW", label: "繁體中文", flag: "🇹🇼" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const navLinks = [
    { name: t("nav.home", "Beranda"), href: "/#hero", sectionId: "hero" },
    { name: t("nav.about", "Tentang Kami"), href: "/#tentang", sectionId: "tentang" },
    { name: t("nav.features", "Keunggulan"), href: "/#keunggulan", sectionId: "keunggulan" },
    { name: t("nav.branches", "Lokasi Cabang"), href: "/#lokasi", sectionId: "lokasi" },
    { name: t("nav.faq", "FAQ"), href: "/#faq", sectionId: "faq" },
    { name: t("nav.catalog", "Katalog Produk"), href: "/katalog", isPage: true },
  ];

  const isLinkActive = (link: (typeof navLinks)[0]) => {
    if (link.isPage) {
      return pathname.startsWith("/katalog");
    }
    if (pathname === "/") {
      return activeSection === link.sectionId;
    }
    return false;
  };

  return (
    <>
      <nav
        className={`fixed top-2 md:top-3 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] md:w-[calc(100%-48px)] max-w-7xl z-50 flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3 rounded-[20px] md:rounded-[32px] border transition-all duration-300 ${
          isScrolled
            ? "bg-[var(--nav-bg-scrolled)] shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border-[var(--nav-border)]"
            : "bg-[var(--nav-bg)] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border-[var(--nav-border)] backdrop-blur-md"
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-[var(--red)] text-white flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h6 className="font-heading text-[15px] md:text-base font-bold text-[var(--text-heading)] leading-[1.2]">
              Yuni Counter
            </h6>
            <span className="text-[8px] md:text-[9px] font-semibold tracking-[2px] text-[var(--red)]">
              SINCE 2004
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm tracking-[0.01em] transition-all relative py-1 ${
                  active
                    ? "text-[var(--red)] font-semibold"
                    : "text-[var(--nav-text)] hover:text-[var(--red)] font-light"
                }`}
              >
                {link.name}
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--red)] rounded-full transition-all" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA & Controls */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-[var(--theme-toggle-bg)] border border-[var(--theme-toggle-border)] text-[var(--text-heading)] hover:border-[var(--red)] transition-all cursor-pointer"
              title="Ganti Bahasa / Change Language"
            >
              <span>{currentLang.flag}</span>
              <span className="font-semibold">{currentLang.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-[var(--body-text)]" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-xl py-1.5 z-50 flex flex-col">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code as Locale)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs text-left hover:bg-[var(--red-soft)] hover:text-[var(--red)] transition-colors cursor-pointer ${
                      locale === lang.code ? "font-bold text-[var(--red)] bg-[var(--red-soft)]/50" : "text-[var(--text-heading)] font-light"
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--theme-toggle-bg)] border border-[var(--theme-toggle-border)] text-[var(--text-heading)] hover:text-[var(--red)] hover:bg-[var(--red-soft)] hover:rotate-[15deg] hover:scale-105 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" || (theme === "system" && systemTheme === "dark") ? (
                <Sun className="w-[18px] h-[18px]" strokeWidth={2} />
              ) : (
                <Moon className="w-[18px] h-[18px]" strokeWidth={2} />
              )}
            </button>
          )}

          <a
            href="https://wa.me/886987872888?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20di%20Yuni%20Counter"
            target="_blank"
            rel="noreferrer"
            className="btn-gradient-cta !py-2.5 !px-5 !text-[13px]"
          >
            {t("nav.whatsapp", "Chat WhatsApp")}
          </a>

          {/* Icon-only Admin Login Button at far right */}
          <Link
            href="/admin/login"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--theme-toggle-bg)] border border-[var(--theme-toggle-border)] text-[var(--text-heading)] hover:text-[var(--red)] hover:border-[var(--border-red)] hover:bg-[var(--red-soft)] transition-all duration-200"
            title={t("nav.admin_full", "Login Portal Admin")}
            aria-label="Login Portal Admin"
          >
            <LogIn className="w-4 h-4" strokeWidth={2} />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden p-2 flex flex-col gap-[5px]"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Menu"
        >
          <span className="block w-[22px] h-[1.5px] bg-[var(--text-heading)] rounded-full transition-all"></span>
          <span className="block w-[22px] h-[1.5px] bg-[var(--text-heading)] rounded-full transition-all"></span>
          <span className="block w-[22px] h-[1.5px] bg-[var(--text-heading)] rounded-full transition-all"></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-[var(--card-bg)] z-[999] flex flex-col items-center justify-center gap-6 p-6 transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          className="absolute top-6 right-6 p-2 text-[var(--text-heading)] cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="w-8 h-8" />
        </button>

        {navLinks.map((link) => {
          const active = isLinkActive(link);
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`font-heading text-[20px] transition-colors ${
                active
                  ? "text-[var(--red)] font-bold"
                  : "text-[var(--text-heading)] font-medium"
              }`}
            >
              {link.name}
            </Link>
          );
        })}

        {/* Language Selection in Mobile Drawer */}
        <div className="flex items-center gap-2 mt-2 py-2 px-3 rounded-2xl bg-[var(--theme-toggle-bg)] border border-[var(--border)]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                handleLanguageChange(lang.code as Locale);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                locale === lang.code
                  ? "bg-[var(--red)] text-white font-bold"
                  : "text-[var(--text-heading)] font-light hover:text-[var(--red)]"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>

        {/* Theme Toggle Mobile */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--theme-toggle-bg)] border border-[var(--theme-toggle-border)] text-[var(--text-heading)]"
            >
              {theme === "dark" || (theme === "system" && systemTheme === "dark") ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          )}
          <span className="text-sm font-medium text-[var(--text-heading)]">
            {t("nav.theme_toggle", "Ganti Mode Tampilan")}
          </span>
        </div>

        <Link
          href="/admin/login"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-2 text-sm font-medium text-[var(--text-heading)] border border-[var(--border)] px-5 py-2.5 rounded-lg hover:border-[var(--red)] hover:text-[var(--red)] transition-all"
        >
          <LogIn className="w-4 h-4 text-[var(--red)]" />
          <span>{t("nav.admin_full", "Login Portal Admin")}</span>
        </Link>

        <a
          href="https://wa.me/886987872888?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20di%20Yuni%20Counter"
          target="_blank"
          rel="noreferrer"
          className="btn-gradient-cta w-full max-w-xs text-center justify-center"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {t("nav.whatsapp", "Chat via WhatsApp")}
        </a>
      </div>
    </>
  );
}
