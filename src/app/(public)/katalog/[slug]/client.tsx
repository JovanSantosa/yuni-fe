"use client";

import { Product } from "@/types/api";
import { useProduct } from "@/hooks/useProducts";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatTWD, formatIDR } from "@/components/shared/ProductCard";
import { ArrowLeft, MessageCircle, Store, Tag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface ClientProps {
  initialData: Product;
  slug: string;
}

export default function ProductDetailClient({ initialData, slug }: ClientProps) {
  const { t } = useLanguage();
  // Use SWR to keep data fresh, but fallback to SSR initialData
  const { product: freshData } = useProduct(slug);
  const product = freshData || initialData;

  const [activeImage, setActiveImage] = useState(
    product.images?.[0]?.url || "/placeholder.svg"
  );

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8 md:py-12">
      <Link
        href="/katalog"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> {t("product_detail.back_to_catalog", "Kembali ke Katalog")}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-muted/20">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img.url)}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                    activeImage === img.url
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/30 opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {product.category && (
              <Badge variant="secondary" className="font-medium">
                {product.category.name}
              </Badge>
            )}
            <Badge variant="outline" className="text-muted-foreground">
              {product.condition === "new" ? "Baru" : "Bekas"}
            </Badge>
            <Badge 
              variant={product.stock_status === "Stok Habis" ? "destructive" : "outline"}
              className={cn(
                product.stock_status === "Tersedia" && "border-green-500/30 text-green-600 dark:text-green-400 bg-green-500/10",
                product.stock_status === "Stok Menipis" && "border-orange-500/30 text-orange-600 dark:text-orange-400 bg-orange-500/10"
              )}
            >
              {product.stock_status}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-balance mb-6">
            {product.name}
          </h1>

          <div className="space-y-1 mb-8 p-6 rounded-2xl bg-muted/30 border">
            <p className="text-3xl font-bold tracking-tight text-primary">
              {formatTWD(product.price)}
            </p>
            <p className="text-muted-foreground">
              Est. <span className="font-medium">{formatIDR(product.price_idr)}</span>
            </p>
          </div>

          <div className="space-y-6 mb-10 flex-1">
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-3">{t("product_detail.description", "Deskripsi")}</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 py-4 border-y">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("product_detail.location", "Lokasi Tersedia")}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {product.branch === "both" ? "Room 330 & 281" : product.branch}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t("product_detail.stock_left", "Sisa Stok")}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.stock} {t("product_detail.unit", "Unit")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <a 
              href={product.wa_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex w-full h-14 items-center justify-center rounded-md text-base font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-[var(--red)] hover:bg-[var(--red-hover)] text-white shadow-lg shadow-red-500/20 hover:scale-[0.99]"
            >
              <MessageCircle className="mr-2 h-5 w-5 fill-current" />
              {t("product_detail.buy_whatsapp", "Beli via WhatsApp")}
            </a>
            <p className="text-xs text-center text-muted-foreground mt-4 text-balance font-light">
              {t("product_detail.price_notice", "Harga dan ketersediaan stok dapat berubah sewaktu-waktu. Silakan hubungi admin untuk konfirmasi.")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
