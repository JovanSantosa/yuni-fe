"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories, useSettings } from "@/hooks/useCoreData";
import { ProductCard } from "@/components/shared/ProductCard";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";

export default function KatalogPage() {
  const { t } = useLanguage();
  const { settings } = useSettings();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [condition, setCondition] = useState<string>("all");
  const [branch, setBranch] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [page, setPage] = useState(1);

  // Handle Search Debounce
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const timer = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  };

  const { categories } = useCategories();
  
  const defaultWaText = encodeURIComponent(
    settings?.whatsapp_hero_message || 
    t("hero.default_wa_message", "Halo Yuni Counter, saya tertarik dengan produk Anda dan ingin bertanya.")
  );
  const whatsappLink = `https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '') || "886987872888"}?text=${defaultWaText}`;
  
  let sort_by = "created_at";
  let sort_order = "desc";
  if (sortBy === "price-asc") {
    sort_by = "price";
    sort_order = "asc";
  } else if (sortBy === "price-desc") {
    sort_by = "price";
    sort_order = "desc";
  } else if (sortBy === "name-asc") {
    sort_by = "name";
    sort_order = "asc";
  } else if (sortBy === "featured") {
    sort_by = "is_featured";
    sort_order = "desc";
  }

  const queryParams = {
    page,
    per_page: 20,
    search: debouncedSearch || undefined,
    category: category !== "all" ? category : undefined,
    condition: condition !== "all" ? condition : undefined,
    branch: branch !== "all" ? branch : undefined,
    sort_by,
    sort_order,
  };

  const { data, isLoading } = useProducts(queryParams);
  const products = data?.data || [];
  const totalCount = data?.meta?.total || 0;

  return (
    <main className="min-h-screen bg-[var(--bg-page)]">
      
      {/* ===== CATALOG HEADER ===== */}
      <header className="pt-[130px] md:pt-[140px] pb-[35px] md:pb-[40px] bg-[var(--header-bg)] border-b border-[var(--border)] relative">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[radial-gradient(circle_at_top_right,rgba(227,48,56,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
          <span className="section-tag">{t("catalog_page.tag", "Katalog Lengkap")}</span>
          <h1 className="font-heading text-[28px] md:text-[38px] lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.15] md:leading-[1.15] text-[var(--text-heading)] mb-3">
            {t("catalog_page.title_main", "Pilihan Gadget & Aksesoris di")} <span className="gradient-word">Yuni Counter.</span>
          </h1>
          <p className="text-[14px] md:text-[16px] text-[var(--body-text)] max-w-[680px] leading-[1.6] font-light">
            {t("catalog_page.subtitle", "Temukan HP baru & bekas berkualitas, MacBook, iPad, tablet, dan aksesoris original di Taichung. Semua kondisi kami jelaskan jujur dan transparan tanpa ada yang ditutup-tutupi.")}
          </p>
          
          <div className="inline-flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--border)] px-3.5 py-1.5 rounded-[var(--radius-pill)] text-[11px] md:text-[12px] text-[var(--body-text)] mt-4 md:mt-5 font-light w-full md:w-auto">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-[var(--text-heading)]"><circle cx="12" cy="12" r="10"/><path d="m12 6-2 6 6-2-2 6"/></svg>
            <span className="truncate">
              {t("catalog_page.currency_notice", "Mata uang: NT$ (TWD) • Est: 1 NT$ ≈ Rp 500")}
            </span>
          </div>
        </div>
      </header>

      {/* ===== MAIN CATALOG SECTION ===== */}
      <section className="py-6 md:py-10 pb-[60px] md:pb-[100px]">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">

          {/* Category Chips */}
          <div className="flex gap-1.5 md:gap-2 overflow-x-auto pb-3 mb-4 md:mb-7 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <button 
              onClick={() => { setCategory("all"); setPage(1); }}
              className={`px-[14px] md:px-[18px] py-[7px] md:py-[9px] rounded-[var(--radius-pill)] text-[12px] md:text-[13px] font-medium whitespace-nowrap cursor-pointer transition-all inline-flex items-center gap-1.5 md:gap-2 border ${
                category === "all" 
                  ? "bg-[var(--red)] text-white border-[var(--red)]" 
                  : "bg-[var(--chip-bg)] text-[var(--text-heading)] border-[var(--border)] hover:border-[var(--red)] hover:text-[var(--red)]"
              }`}
            >
              {t("catalog_page.all_categories", "Semua Kategori")}
              <span className={`text-[10px] md:text-[11px] px-1.5 md:px-[7px] py-[2px] rounded-xl ${category === "all" ? "bg-white/25 text-white" : "bg-[var(--chip-count-bg)]"}`}>
                {totalCount > 0 ? totalCount : '-'}
              </span>
            </button>

            {categories?.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => { setCategory(cat.slug); setPage(1); }}
                className={`px-[14px] md:px-[18px] py-[7px] md:py-[9px] rounded-[var(--radius-pill)] text-[12px] md:text-[13px] font-medium whitespace-nowrap cursor-pointer transition-all inline-flex items-center gap-1.5 md:gap-2 border ${
                  category === cat.slug 
                    ? "bg-[var(--red)] text-white border-[var(--red)]" 
                    : "bg-[var(--chip-bg)] text-[var(--text-heading)] border-[var(--border)] hover:border-[var(--red)] hover:text-[var(--red)]"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Toolbar: Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-3.5 items-stretch md:items-center justify-between mb-7 bg-[var(--toolbar-bg)] p-3.5 md:p-4 rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
            
            <div className="relative flex-1 min-w-0 md:min-w-[260px] md:max-w-[420px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--body-text)] pointer-events-none" />
              <input 
                type="text" 
                value={search}
                onChange={handleSearch}
                className="w-full py-2.5 md:py-[11px] px-4 pl-10 bg-[var(--search-bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[13px] md:text-[14px] text-[var(--text-heading)] outline-none transition-all focus:bg-[var(--card-bg)] focus:border-[var(--red)] focus:ring-2 focus:ring-[var(--red-soft)] placeholder-[var(--body-text)] font-light"
                placeholder={t("catalog_page.search_placeholder", "Cari iPhone, Samsung, MacBook...")}
              />
            </div>

            <div className="grid grid-cols-2 md:flex items-center gap-2 md:gap-2.5 w-full md:w-auto">
              <select 
                value={condition} 
                onChange={(e) => { setCondition(e.target.value); setPage(1); }}
                className="w-full md:w-auto py-[9px] md:py-2.5 px-2.5 md:px-3.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[12px] md:text-[13px] font-medium text-[var(--text-heading)] outline-none cursor-pointer transition-all hover:border-[var(--red)] focus:border-[var(--red)]"
              >
                <option value="all">{t("catalog_page.all_conditions", "Semua Kondisi")}</option>
                <option value="new">{t("catalog_page.condition_new", "Kondisi Baru")}</option>
                <option value="used">{t("catalog_page.condition_used", "Kondisi Bekas")}</option>
              </select>

              <select 
                value={branch} 
                onChange={(e) => { setBranch(e.target.value); setPage(1); }}
                className="w-full md:w-auto py-[9px] md:py-2.5 px-2.5 md:px-3.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[12px] md:text-[13px] font-medium text-[var(--text-heading)] outline-none cursor-pointer transition-all hover:border-[var(--red)] focus:border-[var(--red)]"
              >
                <option value="all">{t("catalog_page.all_branches", "Semua Lokasi")}</option>
                <option value="room281">{t("catalog_page.branch_281", "Room 281")}</option>
                <option value="room330">{t("catalog_page.branch_330", "Room 330")}</option>
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="col-span-2 md:col-span-1 w-full md:w-auto py-[9px] md:py-2.5 px-2.5 md:px-3.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-[var(--radius-sm)] text-[12px] md:text-[13px] font-medium text-[var(--text-heading)] outline-none cursor-pointer transition-all hover:border-[var(--red)] focus:border-[var(--red)]"
              >
                <option value="featured">{t("catalog_page.sort_featured", "Paling Unggulan")}</option>
                <option value="price-asc">{t("catalog_page.sort_price_asc", "Harga: Terendah")}</option>
                <option value="price-desc">{t("catalog_page.sort_price_desc", "Harga: Tertinggi")}</option>
                <option value="name-asc">{t("catalog_page.sort_name_asc", "Nama A-Z")}</option>
              </select>
            </div>

          </div>

          {/* Products Grid Container */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-4 lg:gap-[22px] mb-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="w-full aspect-[16/11] md:aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 px-5 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] col-span-full">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-[var(--body-text)] mx-auto mb-3.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <h3 className="font-heading text-[18px] text-[var(--text-heading)] font-semibold mb-1.5">{t("catalog_page.empty_title", "Tidak Ada Produk yang Cocok")}</h3>
              <p className="text-[14px] text-[var(--body-text)] font-light">{t("catalog_page.empty_desc", "Coba ubah kata kunci pencarian atau reset filter kategori & kondisi Anda.")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 md:gap-4 lg:gap-[22px] mb-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Trade-In Quick Inquiry Banner */}
          <div className="bg-[linear-gradient(135deg,#FFFFFF_0%,#F9F9F8_100%)] dark:bg-[linear-gradient(135deg,#161A24_0%,#10121A_100%)] border border-[var(--border)] dark:border-white/15 rounded-[var(--radius-xl)] p-7 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-4 md:gap-7 relative overflow-hidden mt-5 text-center md:text-left transition-colors duration-350">
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
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm tracking-wide transition-all shadow-md bg-[var(--red)] text-white hover:bg-[var(--red-dark)] hover:shadow-lg active:scale-95"
            >
              {t("trade_in.btn", "Konsultasi Tukar Tambah Sekarang")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>
    </main>
  );
}
