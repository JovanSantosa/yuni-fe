"use client";

import Link from "next/link";
import { ShoppingBag, MapPin, Phone, MessageCircle } from "lucide-react";
import { useSettings } from "@/hooks/useCoreData";

export function Footer() {
  const { settings } = useSettings();

  const siteTitle = settings?.site_title || "Yuni Counter";
  const aboutText = settings?.about_text || "Konter HP terpercaya di Taichung, Taiwan sejak 2004. Jual beli HP, laptop, MacBook, iPad, tablet, dan aksesoris. Harga jujur, kualitas terjamin.";
  const phone = settings?.phone || "0987-872-888";
  const whatsapp = settings?.whatsapp_number || "886987872888";
  const operatingHours = settings?.operating_hours || "Buka Setiap Hari\n10:00 - 21:00";
  const address = settings?.address_1 || "First Square (Asean Square Pyramid)\nLantai 3, Room 281 & Room 330\nTaichung, Taiwan";
  
  // Custom parsing for newline characters in text areas
  const formatAddress = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i !== text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <footer className="bg-[#0B0D11] text-white pt-20 pb-8 border-t border-white/5">
      <div className="container max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Column 1: Brand & About */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-[var(--red)] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h6 className="font-heading text-[15px] font-bold text-white leading-tight">
                  {siteTitle}
                </h6>
                <span className="text-[9px] font-medium tracking-[2px] text-[var(--red-light)]">
                  SINCE 2004
                </span>
              </div>
            </div>
            <p className="text-[13px] text-white/45 leading-[1.6] font-light">
              {aboutText}
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h5 className="text-[11px] font-semibold tracking-[2px] uppercase text-white/35 mb-5">
              Navigasi
            </h5>
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-[13px] text-white/60 hover:text-white font-light transition-colors">Beranda</Link>
              <Link href="/katalog" className="text-[13px] text-white/60 hover:text-white font-light transition-colors">Katalog Produk</Link>
              <Link href="/#tentang" className="text-[13px] text-white/60 hover:text-white font-light transition-colors">Tentang Kami</Link>
              <Link href="/#keunggulan" className="text-[13px] text-white/60 hover:text-white font-light transition-colors">Keunggulan</Link>
              <Link href="/#lokasi" className="text-[13px] text-white/60 hover:text-white font-light transition-colors">Lokasi Cabang</Link>
              <Link href="/#faq" className="text-[13px] text-white/60 hover:text-white font-light transition-colors">FAQ</Link>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h5 className="text-[11px] font-semibold tracking-[2px] uppercase text-white/35 mb-5">
              Kontak
            </h5>
            <p className="text-[13px] text-white/60 mb-3 leading-[1.5] font-light">
              {formatAddress(address)}
            </p>
            <p className="text-[13px] mb-3">
              <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-white/60 hover:text-white font-light transition-colors">
                {phone}
              </a>
            </p>
            <p className="text-[13px] mb-3">
              <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-white/60 hover:text-white font-light transition-colors">
                WhatsApp: +{whatsapp}
              </a>
            </p>
            <p className="text-[13px] text-white/60 mt-3 pt-3 border-t border-white/10 font-light leading-[1.5]">
              {formatAddress(operatingHours)}
            </p>
          </div>

          {/* Column 4: Socials & Map */}
          <div>
            <h5 className="text-[11px] font-semibold tracking-[2px] uppercase text-white/35 mb-5">
              Ikuti Kami
            </h5>
            <div className="flex flex-col gap-3">
              <a 
                href={settings?.tiktok_url_1 || "https://www.tiktok.com/@yunistore.lt3room330"} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 text-[13px] text-white/60 hover:text-white font-light transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.52a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.51V6.8a4.83 4.83 0 0 1-1-.11z"/></svg>
                TikTok Room 330
              </a>
              <a 
                href={settings?.tiktok_url_2 || "https://www.tiktok.com/@yuni.counter.3f"} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 text-[13px] text-white/60 hover:text-white font-light transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.52a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.51V6.8a4.83 4.83 0 0 1-1-.11z"/></svg>
                TikTok Yuni Counter
              </a>
            </div>
            
            <div className="mt-6">
              <a 
                href={settings?.map_url || "https://share.google/oFDeRwP7eAVEDpr5u"} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-[13px] text-white/60 hover:text-white font-light transition-colors"
              >
                <MapPin className="w-[14px] h-[14px]" />
                Lihat di Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/30 font-light text-center md:text-left">
            &copy; {new Date().getFullYear()} {siteTitle}. Konter HP Terpercaya di Taichung, Taiwan.
          </p>
          <div className="flex gap-3">
            <a 
              href={settings?.tiktok_url_1 || "https://www.tiktok.com/@yunistore.lt3room330"} 
              target="_blank" 
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-[var(--red-soft)] hover:border-[var(--red)] hover:text-white transition-all"
              aria-label="TikTok Room 330"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.52a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.51V6.8a4.83 4.83 0 0 1-1-.11z"/></svg>
            </a>
            <a 
              href={settings?.tiktok_url_2 || "https://www.tiktok.com/@yuni.counter.3f"} 
              target="_blank" 
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-[var(--red-soft)] hover:border-[var(--red)] hover:text-white transition-all"
              aria-label="TikTok Yuni Counter"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.52a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.28 8.28 0 0 0 4.76 1.51V6.8a4.83 4.83 0 0 1-1-.11z"/></svg>
            </a>
            <a 
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-[var(--red-soft)] hover:border-[var(--red)] hover:text-white transition-all"
              aria-label="WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
