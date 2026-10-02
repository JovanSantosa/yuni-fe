"use client";

import Image from "next/image";
import Link from "next/link";
import { useSettings, useTestimonials, useFaqs } from "@/hooks/useCoreData";
import { ArrowRight, ChevronDown, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

// Fade up animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const { testimonials } = useTestimonials();
  const { faqs } = useFaqs();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Dynamic Content from Settings (Already resolved to current locale by Laravel backend)
  const cleanHeroTitle = (settings?.hero_title || t("hero.badge", "Konter HP Terpercaya di Taichung")).replace(/\.+$/, "");
  const heroSubtitle = settings?.hero_subtitle || t("hero.badge_sub", "Jual beli HP, laptop, MacBook, iPad, tablet, dan aksesoris baru & bekas. Harga termurah dengan kualitas terbaik.");
  const aboutText = settings?.about_text || t("about.badge_location", "Yuni Counter telah melayani kebutuhan handphone dan gadget di Taichung, Taiwan sejak tahun 2004.");
  
  const statCustomers = settings?.stat_customers || "1000+";
  const statYears = settings?.stat_years || "20+";
  const statBranches = settings?.stat_branches || "2";

  // Helper to ensure full URL resolution
  const resolveImageUrl = (url?: string, fallback: string = "") => {
    if (!url || typeof url !== "string" || url.trim() === "") return fallback;
    const trimmed = url.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    const apiHost = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://127.0.0.1:8000";
    return `${apiHost}/storage/${trimmed.replace(/^\/?storage\//, "")}`;
  };

  // Dynamic Image Settings with fallbacks
  const heroImage = settings?.hero_image
    ? resolveImageUrl(settings.hero_image, "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80")
    : "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1000&q=80";

  const aboutImage = settings?.about_image
    ? resolveImageUrl(settings.about_image, "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80")
    : "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80";

  const ctaImage = settings?.cta_image
    ? resolveImageUrl(settings.cta_image, "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80")
    : "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80";

  // Format split for gradient word in hero title
  const hasTaichung = cleanHeroTitle.includes("Taichung") || cleanHeroTitle.includes("台中");
  const keyword = cleanHeroTitle.includes("台中") ? "台中" : "Taichung";
  const titleBefore = hasTaichung ? cleanHeroTitle.split(keyword)[0] : cleanHeroTitle;
  const titleAfter = hasTaichung ? cleanHeroTitle.split(keyword)[1].replace(/^\.+/, "") : "";
  const whatsappLink = `https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || "886987872888"}?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20di%20Yuni%20Counter`;

  return (
    <main className="min-h-screen">
      
      {/* ===== HERO SECTION ===== */}
      <section className="relative pt-[140px] pb-20 md:pb-[80px] overflow-hidden min-h-[90vh] flex items-center" id="hero">
        <motion.div 
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.06 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 right-[-10%] w-[55%] h-full bg-gradient-to-br from-[var(--red)] via-[#ffdad7] to-[#ffdad7] rounded-bl-[80px] z-0"
        />
        
        <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-full lg:max-w-[660px]"
            >
              <motion.div variants={fadeInUp}>
                <Link href="/katalog" className="inline-flex items-center gap-3 border border-[var(--border-red)] rounded-[38px] py-1.5 pr-4 pl-1.5 bg-[var(--card-bg)] mb-8 hover:bg-[var(--light-gray)] transition-colors">
                  <span className="bg-[var(--red)] text-white text-[10px] font-semibold px-3 py-1 rounded-[23px] tracking-wide">
                    {t("hero.badge", "TERPERCAYA")}
                  </span>
                  <span className="text-[13px] text-[var(--body-text)]">
                    {t("hero.badge_sub", "Harga Jujur, Kualitas Terjamin")}
                  </span>
                </Link>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="font-heading text-[36px] md:text-[52px] lg:text-[64px] font-extrabold tracking-[-0.04em] leading-[1.05] text-[var(--text-heading)] mb-6">
                {titleBefore}
                {hasTaichung && (
                  <span className="gradient-word">{keyword}.</span>
                )}
                {titleAfter}
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-[15px] lg:text-[17px] text-[var(--body-text)] leading-[1.6] lg:leading-[1.7] mb-10 max-w-[540px] font-light">
                {heroSubtitle}
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-gradient-cta">
                  {t("hero.btn_whatsapp", "Hubungi WhatsApp")}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
                </a>
                <Link href="/katalog" className="btn-secondary border-none font-semibold shadow-none">
                  {t("hero.btn_catalog", "Lihat Katalog")}
                  <ArrowRight className="w-[15px] h-[15px]" strokeWidth={2.5} />
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex flex-wrap sm:grid sm:grid-cols-3 gap-6 sm:gap-10 items-center">
                <div className="flex flex-col">
                  <span className="font-heading text-[28px] lg:text-[36px] font-bold text-[var(--red)] leading-none">{statYears}</span>
                  <span className="text-[11px] lg:text-[13px] text-[var(--body-text)] mt-1">{t("hero.stat_years", "Tahun Berdiri")}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-[28px] lg:text-[36px] font-bold text-[var(--red)] leading-none">{statBranches}</span>
                  <span className="text-[11px] lg:text-[13px] text-[var(--body-text)] mt-1">{t("hero.stat_branches", "Cabang Toko")}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-[28px] lg:text-[36px] font-bold text-[var(--red)] leading-none">{statCustomers}</span>
                  <span className="text-[11px] lg:text-[13px] text-[var(--body-text)] mt-1">{t("hero.stat_customers", "Pelanggan Setia")}</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex justify-center lg:justify-end order-first lg:order-last mb-10 lg:mb-0"
            >
              <div className="relative w-full max-w-[400px] lg:max-w-[440px] aspect-[16/11] lg:aspect-[4/5] rounded-[var(--radius-xl)] lg:rounded-[var(--radius-xl)] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.05)] bg-white group">
                {heroImage && (
                  <Image 
                    key={heroImage}
                    src={heroImage} 
                    alt="Yuni Counter Display" 
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    priority
                  />
                )}
                
                {/* Floating Card */}
                <div className="absolute bottom-[-12px] lg:bottom-[-20px] left-2.5 lg:left-[-20px] right-2.5 lg:right-auto bg-[var(--card-bg)]/95 backdrop-blur-md border border-[var(--border-red)] rounded-[var(--radius-md)] p-3 lg:p-4 shadow-[0_12px_30px_rgba(227,48,56,0.15)] flex items-center gap-3 z-10">
                  <div className="w-[38px] h-[38px] rounded-full bg-[var(--red)] text-white flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <div className="flex flex-col">
                    <strong className="text-[13px] font-bold text-[var(--text-heading)]">{t("hero.condition_card_title", "100% Kondisi Terbuka")}</strong>
                    <span className="text-[11px] text-[var(--body-text)]">{t("hero.condition_card_desc", "Baru & Bekas Bergaransi")}</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===== TENTANG KAMI ===== */}
      <section className="py-[90px] lg:py-[120px]" id="tentang">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col gap-5"
            >
              <motion.div variants={fadeInUp}>
                <span className="section-tag">{t("about.tag", "Tentang Kami")}</span>
                <h2 className="section-heading !mb-0">{t("nav.about", "Tentang Kami")}</h2>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="space-y-4">
                {aboutText.split('\n\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="section-body">
                    {paragraph}
                  </p>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="flex gap-10 my-6 py-6 border-y border-[var(--border)]">
                <div className="text-center">
                  <div className="font-heading text-[22px] lg:text-[32px] font-bold text-[var(--text-heading)] leading-[1.2]">{statCustomers}</div>
                  <div className="text-[13px] text-[var(--body-text)] mt-1">{t("about.stat_customers", "Pelanggan")}</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-[22px] lg:text-[32px] font-bold text-[var(--text-heading)] leading-[1.2]">{statYears}</div>
                  <div className="text-[13px] text-[var(--body-text)] mt-1">{t("about.stat_years", "Tahun")}</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-[22px] lg:text-[32px] font-bold text-[var(--text-heading)] leading-[1.2]">{statBranches}</div>
                  <div className="text-[13px] text-[var(--body-text)] mt-1">{t("about.stat_branches", "Cabang")}</div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-primary">
                  {t("about.btn_contact", "Hubungi Kami")}
                </a>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[var(--radius-xl)] overflow-hidden aspect-[4/3] bg-white border border-[var(--border)] shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
            >
              {aboutImage && (
                <Image 
                  key={aboutImage}
                  src={aboutImage} 
                  alt="Yuni Counter Store" 
                  fill
                  unoptimized
                  className="object-cover"
                />
              )}
              <div className="absolute bottom-5 left-5 bg-[#111111]/85 backdrop-blur-md text-white px-4 py-2.5 rounded-[var(--radius-sm)] text-xs tracking-[0.5px] flex items-center gap-2 border border-white/15">
                <span className="w-2 h-2 rounded-full bg-[var(--red)]"></span>
                {t("about.badge_location", "First Square Lantai 3 -- Taichung, Taiwan")}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ===== PRODUK KATEGORI ===== */}
      <section className="py-[90px] lg:py-[120px]" id="produk">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-12">
            <div className="max-w-[500px]">
              <span className="section-tag">{t("categories.tag", "Produk & Layanan")}</span>
              <h2 className="section-heading !mb-0">{t("categories.title", "Apa yang Kami Jual.")}</h2>
            </div>
            <Link href="/katalog" className="text-[14px] font-medium text-[var(--red)] flex items-center gap-1.5 hover:gap-2.5 transition-all">
              {t("categories.view_all", "Buka Katalog Lengkap")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[18px] lg:gap-5">
            <Link href="/katalog?category=handphone" className="group rounded-[var(--radius-lg)] overflow-hidden relative bg-[var(--card-bg)] border border-[var(--border)] text-left flex flex-col transition-all duration-300 hover:border-[var(--border-red)] hover:shadow-[0_12px_32px_rgba(227,48,56,0.12)] hover:-translate-y-1">
              <div className="w-full h-[140px] md:h-[180px] overflow-hidden bg-[var(--light-gray)] relative">
                <Image src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80" alt="Handphone" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
              </div>
              <div className="p-[14px] md:p-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold tracking-[1px] uppercase text-[var(--red)] mb-1.5">{t("categories.tag_phone", "Ready Stock")}</span>
                <h3 className="font-heading text-[14px] md:text-[16px] font-semibold mb-2 text-[var(--text-heading)]">{t("categories.phone", "Handphone")}</h3>
                <p className="text-[13px] text-[var(--body-text)] leading-[1.5] font-light">{t("categories.phone_desc", "iPhone, Samsung, Xiaomi, OPPO...")}</p>
              </div>
            </Link>

            <Link href="/katalog?category=laptop-macbook" className="group rounded-[var(--radius-lg)] overflow-hidden relative bg-[var(--card-bg)] border border-[var(--border)] text-left flex flex-col transition-all duration-300 hover:border-[var(--border-red)] hover:shadow-[0_12px_32px_rgba(227,48,56,0.12)] hover:-translate-y-1">
              <div className="w-full h-[140px] md:h-[180px] overflow-hidden bg-[var(--light-gray)] relative">
                <Image src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80" alt="Laptop & MacBook" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
              </div>
              <div className="p-[14px] md:p-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold tracking-[1px] uppercase text-[var(--red)] mb-1.5">{t("categories.tag_laptop", "Baru & Bekas")}</span>
                <h3 className="font-heading text-[14px] md:text-[16px] font-semibold mb-2 text-[var(--text-heading)]">{t("categories.laptop", "Laptop & MacBook")}</h3>
                <p className="text-[13px] text-[var(--body-text)] leading-[1.5] font-light">{t("categories.laptop_desc", "MacBook Air, MacBook Pro...")}</p>
              </div>
            </Link>

            <Link href="/katalog?category=ipad-tablet" className="group rounded-[var(--radius-lg)] overflow-hidden relative bg-[var(--card-bg)] border border-[var(--border)] text-left flex flex-col transition-all duration-300 hover:border-[var(--border-red)] hover:shadow-[0_12px_32px_rgba(227,48,56,0.12)] hover:-translate-y-1">
              <div className="w-full h-[140px] md:h-[180px] overflow-hidden bg-[var(--light-gray)] relative">
                <Image src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=700&q=80" alt="iPad & Tablet" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
              </div>
              <div className="p-[14px] md:p-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold tracking-[1px] uppercase text-[var(--red)] mb-1.5">{t("categories.tag_tablet", "Garansi Toko")}</span>
                <h3 className="font-heading text-[14px] md:text-[16px] font-semibold mb-2 text-[var(--text-heading)]">{t("categories.tablet", "iPad & Tablet")}</h3>
                <p className="text-[13px] text-[var(--body-text)] leading-[1.5] font-light">{t("categories.tablet_desc", "iPad Pro, iPad Air, Samsung Tab...")}</p>
              </div>
            </Link>

            <Link href="/katalog?category=aksesoris" className="group rounded-[var(--radius-lg)] overflow-hidden relative bg-[var(--card-bg)] border border-[var(--border)] text-left flex flex-col transition-all duration-300 hover:border-[var(--border-red)] hover:shadow-[0_12px_32px_rgba(227,48,56,0.12)] hover:-translate-y-1">
              <div className="w-full h-[140px] md:h-[180px] overflow-hidden bg-[var(--light-gray)] relative">
                <Image src="https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=700&q=80" alt="Aksesoris" fill className="object-cover transition-transform duration-500 group-hover:scale-[1.06]" />
              </div>
              <div className="p-[14px] md:p-5 flex flex-col flex-1">
                <span className="text-[10px] font-bold tracking-[1px] uppercase text-[var(--red)] mb-1.5">{t("categories.tag_acc", "Lengkap")}</span>
                <h3 className="font-heading text-[14px] md:text-[16px] font-semibold mb-2 text-[var(--text-heading)]">{t("categories.acc", "Aksesoris")}</h3>
                <p className="text-[13px] text-[var(--body-text)] leading-[1.5] font-light">{t("categories.acc_desc", "Casing, tempered glass...")}</p>
              </div>
            </Link>
          </div>

          {/* Trade In Banner */}
          <div className="mt-8 bg-[linear-gradient(135deg,#FFFFFF_0%,#F9F9F8_100%)] dark:bg-[linear-gradient(135deg,#161A24_0%,#10121A_100%)] border border-[var(--border)] dark:border-white/15 rounded-[var(--radius-xl)] p-7 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-4 md:gap-7 relative overflow-hidden text-center md:text-left transition-colors duration-350">
            <div className="absolute top-[-50%] right-[-20%] w-[60%] h-[200%] bg-[radial-gradient(circle,rgba(227,48,56,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(227,48,56,0.25)_0%,transparent_70%)] pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="font-heading text-[20px] md:text-[24px] font-bold mb-1.5 text-[var(--text-heading)]">
                {t("trade_in.title", "Mau Tukar Tambah HP Lama Anda?")}
              </h3>
              <p className="text-[14px] text-[var(--body-text)] font-light">
                {t("trade_in.desc", "Bawa HP, tablet, atau laptop lama Anda ke Room 281 atau Room 330...")}
              </p>
            </div>
            
            <a 
              href="https://wa.me/886987872888?text=Halo%20Yuni%20Counter%2C%20saya%20mau%20konsultasi%20tukar%20tambah%20HP" 
              target="_blank" 
              rel="noreferrer" 
              className="btn-gradient-cta shrink-0 relative z-10 whitespace-nowrap !px-6 !py-3.5"
            >
              {t("trade_in.btn", "Tanya Tukar Tambah")}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </a>
          </div>

        </div>
      </section>

      {/* ===== KEUNGGULAN ===== */}
      <section className="py-[90px] lg:py-[120px]" id="keunggulan">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-[600px] mx-auto mb-10 md:mb-[60px]">
            <span className="section-tag">{t("features.tag", "Kenapa Yuni Counter")}</span>
            <h2 className="section-heading">{t("features.title", "Alasan Pelanggan Memilih Kami.")}</h2>
            <p className="section-body">{t("features.subtitle", "Bukan hanya soal harga...")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            
            <div className="p-6 md:p-8 border border-[var(--border-red)] shadow-[0_4px_20px_rgba(227,48,56,0.12)] rounded-[var(--radius-lg)] bg-[var(--card-bg)] text-center transition-all">
              <div className="w-[52px] h-[52px] mx-auto mb-4 rounded-full bg-[var(--red-soft)] text-[var(--red)] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div className="font-heading text-[28px] font-bold text-[var(--red-20)] mb-2">01</div>
              <h3 className="font-heading text-[18px] font-semibold mb-2.5 text-[var(--text-heading)]">{t("features.f1_title", "100% Jujur & Transparan")}</h3>
              <p className="text-[14px] text-[var(--body-text)] leading-[1.6] font-light">{t("features.f1_desc", "Kondisi setiap produk kami sampaikan apa adanya...")}</p>
            </div>

            <div className="p-6 md:p-8 border border-[var(--border)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-[var(--radius-lg)] bg-[var(--card-bg)] text-center transition-all hover:-translate-y-0.5">
              <div className="w-[52px] h-[52px] mx-auto mb-4 rounded-full bg-[var(--red-soft)] text-[var(--red)] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="1" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div className="font-heading text-[28px] font-bold text-gray-500/20 mb-2">02</div>
              <h3 className="font-heading text-[18px] font-semibold mb-2.5 text-[var(--text-heading)]">{t("features.f2_title", "Harga Paling Kompetitif")}</h3>
              <p className="text-[14px] text-[var(--body-text)] leading-[1.6] font-light">{t("features.f2_desc", "Kami menawarkan harga termurah...")}</p>
            </div>

            <div className="p-6 md:p-8 border border-[var(--border)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-[var(--radius-lg)] bg-[var(--card-bg)] text-center transition-all hover:-translate-y-0.5">
              <div className="w-[52px] h-[52px] mx-auto mb-4 rounded-full bg-[var(--red-soft)] text-[var(--red)] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              </div>
              <div className="font-heading text-[28px] font-bold text-gray-500/20 mb-2">03</div>
              <h3 className="font-heading text-[18px] font-semibold mb-2.5 text-[var(--text-heading)]">{t("features.f3_title", "Dipercaya 20+ Tahun")}</h3>
              <p className="text-[14px] text-[var(--body-text)] leading-[1.6] font-light">{t("features.f3_desc", "Sejak 2004, ribuan pelanggan...")}</p>
            </div>

            <div className="p-6 md:p-8 border border-[var(--border)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-[var(--radius-lg)] bg-[var(--card-bg)] text-center transition-all hover:-translate-y-0.5">
              <div className="w-[52px] h-[52px] mx-auto mb-4 rounded-full bg-[var(--red-soft)] text-[var(--red)] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </div>
              <div className="font-heading text-[28px] font-bold text-gray-500/20 mb-2">04</div>
              <h3 className="font-heading text-[18px] font-semibold mb-2.5 text-[var(--text-heading)]">{t("features.f4_title", "Terima Tukar Tambah")}</h3>
              <p className="text-[14px] text-[var(--body-text)] leading-[1.6] font-light">{t("features.f4_desc", "Tukarkan HP lama Anda...")}</p>
            </div>

            <div className="p-6 md:p-8 border border-[var(--border)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-[var(--radius-lg)] bg-[var(--card-bg)] text-center transition-all hover:-translate-y-0.5">
              <div className="w-[52px] h-[52px] mx-auto mb-4 rounded-full bg-[var(--red-soft)] text-[var(--red)] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <div className="font-heading text-[28px] font-bold text-gray-500/20 mb-2">05</div>
              <h3 className="font-heading text-[18px] font-semibold mb-2.5 text-[var(--text-heading)]">{t("features.f5_title", "Produk Lengkap")}</h3>
              <p className="text-[14px] text-[var(--body-text)] leading-[1.6] font-light">{t("features.f5_desc", "Dari HP, laptop, MacBook...")}</p>
            </div>

            <div className="p-6 md:p-8 border border-[var(--border)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-[var(--radius-lg)] bg-[var(--card-bg)] text-center transition-all hover:-translate-y-0.5">
              <div className="w-[52px] h-[52px] mx-auto mb-4 rounded-full bg-[var(--red-soft)] text-[var(--red)] flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div className="font-heading text-[28px] font-bold text-gray-500/20 mb-2">06</div>
              <h3 className="font-heading text-[18px] font-semibold mb-2.5 text-[var(--text-heading)]">{t("features.f6_title", "Lokasi Strategis")}</h3>
              <p className="text-[14px] text-[var(--body-text)] leading-[1.6] font-light">{t("features.f6_desc", "Terletak di First Square Lantai 3...")}</p>
            </div>

          </div>
        </div>
      </section>

      {/* ===== LOKASI ===== */}
      <section className="py-[90px] lg:py-[120px]" id="lokasi">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-12">
            <span className="section-tag">{t("branches.tag", "Lokasi Toko")}</span>
            <h2 className="section-heading">{t("branches.title", "Kunjungi Kami.")}</h2>
            <p className="section-body max-w-[500px] mx-auto mt-2">{t("branches.desc", "Dua lokasi di First Square...")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-[900px] mx-auto">
            
            <div className="p-[26px] md:p-9 border border-[var(--border)] hover:border-[var(--border-red)] hover:shadow-[0_4px_20px_rgba(227,48,56,0.08)] rounded-[var(--radius-lg)] bg-[var(--card-bg)] text-center transition-all">
              <span className="inline-block px-3.5 py-1 rounded-[var(--radius-pill)] text-[10px] font-semibold tracking-[1.5px] uppercase mb-4 bg-[var(--red-soft)] text-[var(--red)]">{t("branches.b1_badge", "CABANG UTAMA")}</span>
              <h3 className="font-heading text-[22px] font-bold mb-2 text-[var(--text-heading)]">{t("branches.b1_name", "Room 281")}</h3>
              <p className="text-[14px] text-[var(--body-text)] leading-[1.6] font-light whitespace-pre-line">{settings?.address_room281 || t("branches.b1_addr")}</p>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-center gap-1.5 text-[12px] text-[var(--body-text)] w-full">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--red)]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {t("branches.b1_since", "Beroperasi sejak 2004")}
              </div>
            </div>

            <div className="p-[26px] md:p-9 border border-[var(--border)] hover:border-[var(--border-red)] hover:shadow-[0_4px_20px_rgba(227,48,56,0.08)] rounded-[var(--radius-lg)] bg-[var(--card-bg)] text-center transition-all">
              <span className="inline-block px-3.5 py-1 rounded-[var(--radius-pill)] text-[10px] font-semibold tracking-[1.5px] uppercase mb-4 bg-[var(--red)] text-white">{t("branches.b2_badge", "CABANG BARU")}</span>
              <h3 className="font-heading text-[22px] font-bold mb-2 text-[var(--text-heading)]">{t("branches.b2_name", "Room 330")}</h3>
              <p className="text-[14px] text-[var(--body-text)] leading-[1.6] font-light whitespace-pre-line">{settings?.address_room330 || t("branches.b2_addr")}</p>
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-center gap-1.5 text-[12px] text-[var(--body-text)] w-full">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--red)]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {t("branches.b2_since", "Beroperasi sejak 2024")}
              </div>
            </div>

          </div>

          <div className="mt-10 text-center flex flex-col items-center">
            <a href={settings?.map_url || "https://share.google/oFDeRwP7eAVEDpr5u"} target="_blank" rel="noreferrer" className="btn-secondary !py-2.5 !px-5 mb-3 !text-[13px]">
              <MapPin className="w-4 h-4" />
              {t("branches.maps_btn", "Lihat di Google Maps")}
            </a>
            <p className="text-[14px] text-[var(--body-text)] mt-2">
              {settings?.operating_hours ? settings.operating_hours.replace(/\n/g, ' - ') : t("branches.hours", "Jam Operasional: Senin - Minggu, 10:00 - 21:00")}
            </p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-[90px] lg:py-[120px]" id="testimoni">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="section-tag">{t("testimonials.tag", "Kata Pelanggan")}</span>
            <h2 className="section-heading">{t("testimonials.title", "Dipercaya Banyak Orang.")}</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-5 md:gap-12 my-7 md:my-10">
            <div className="text-center">
              <div className="font-heading text-[24px] md:text-[28px] font-bold text-[var(--text-heading)]">{statCustomers}</div>
              <div className="text-[13px] text-[var(--body-text)] mt-1">{t("testimonials.stat_customers", "Pelanggan Puas")}</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-[24px] md:text-[28px] font-bold text-[var(--text-heading)]">{statYears}</div>
              <div className="text-[13px] text-[var(--body-text)] mt-1">{t("testimonials.stat_years", "Tahun Beroperasi")}</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-[24px] md:text-[28px] font-bold text-[var(--text-heading)]">{statBranches}</div>
              <div className="text-[13px] text-[var(--body-text)] mt-1">{t("testimonials.stat_branches", "Lokasi Toko")}</div>
            </div>
            <div className="text-center">
              <div className="font-heading text-[24px] md:text-[28px] font-bold text-[var(--text-heading)]">5</div>
              <div className="text-[13px] text-[var(--body-text)] mt-1">{t("testimonials.stat_categories", "Kategori Produk")}</div>
            </div>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-8">
            {testimonials && testimonials.length > 0 ? (
              testimonials.map((item) => (
                <div key={item.id} className="w-full p-5 lg:p-8 border border-[var(--border)] rounded-[var(--radius-lg)] bg-[var(--card-bg)] flex flex-col justify-between transition-all hover:-translate-y-1 hover:border-[var(--border-red)] hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)]">
                  <p className="text-[15px] text-[var(--body-text)] leading-[1.7] mb-6 italic font-light whitespace-normal break-words">
                    "{item.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--red-soft)] text-[var(--red)] flex items-center justify-center shrink-0 border-2 border-[var(--border)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] relative">
                      {item.avatar_url ? (
                        <Image src={item.avatar_url} alt={item.customer_name} fill unoptimized className="object-cover" />
                      ) : (
                        <span className="font-heading font-bold">{item.customer_name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[var(--text-heading)]">{item.customer_name}</div>
                      <div className="text-[12px] text-[var(--body-text)] font-light">{item.customer_status}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-[60px] lg:py-[120px]">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="relative rounded-[var(--radius-lg)] lg:rounded-[var(--radius-xl)] overflow-hidden py-[50px] px-5 lg:py-20 lg:px-16 text-center min-h-auto lg:min-h-[400px] flex flex-col items-center justify-center bg-[#111111] dark:bg-[#141720] border border-[var(--border)] dark:border-white/15">
            {ctaImage && (
              <Image 
                key={ctaImage}
                src={ctaImage} 
                alt="Tech Background" 
                fill 
                unoptimized
                className="absolute inset-0 object-cover opacity-[0.18] grayscale-[80%] contrast-[120%] pointer-events-none" 
              />
            )}
            <div className="absolute top-[-50%] right-[-30%] w-[80%] h-[200%] bg-[radial-gradient(ellipse,rgba(227,48,56,0.25)_0%,transparent_70%)] pointer-events-none z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <span className="section-tag !text-[var(--red-light)] before:!bg-[var(--red)]">{t("cta.tag", "Hubungi Kami")}</span>
              <h2 className="font-heading text-[26px] lg:text-[48px] font-bold text-white mb-4 tracking-[-0.03em] leading-[1.1]">{t("cta.title", "Cari HP, Laptop, atau Aksesoris?")}</h2>
              <p className="text-[15px] lg:text-[16px] text-white/70 max-w-[500px] mx-auto mb-8 font-light leading-[1.6]">
                {t("cta.desc", "Hubungi kami via WhatsApp untuk tanya stok, harga, atau konsultasi.")}
              </p>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-gradient-cta !text-[15px] !py-4 !px-9">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t("cta.btn", "Chat via WhatsApp")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-[60px] lg:py-[120px]" id="faq">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="section-tag">{t("faq.tag", "FAQ")}</span>
            <h2 className="section-heading">{t("faq.title", "Pertanyaan Umum")}</h2>
          </div>
          
          <div className="max-w-[800px] mx-auto flex flex-col gap-3">
            {faqs && faqs.length > 0 ? (
              faqs.map((faq, index) => {
                const isActive = activeFaq === index;
                return (
                  <div 
                    key={faq.id || index}
                    className={`border rounded-[var(--radius-lg)] bg-[var(--card-bg)] overflow-hidden transition-all duration-300 ${
                      isActive ? "border-[var(--border-red)]" : "border-[var(--border)]"
                    }`}
                  >
                    <button 
                      onClick={() => setActiveFaq(isActive ? null : index)}
                      className="flex items-center justify-between p-5 lg:px-6 w-full text-left bg-transparent border-none cursor-pointer gap-4"
                    >
                      <h4 className="font-sans text-[14px] md:text-[15px] font-medium text-[var(--text-heading)] flex-1">
                        {faq.question}
                      </h4>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[var(--red)] transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 lg:px-6 pb-5 pt-0 text-[13px] md:text-[14px] text-[var(--body-text)] leading-[1.7] font-light">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : null}
          </div>
        </div>
      </section>

    </main>
  );
}
