import { Metadata } from "next";
import { fetchApi } from "@/lib/api";
import { Product } from "@/types/api";
import ProductDetailClient from "./client";
import { notFound } from "next/navigation";

// Define the correct type for Page params in Next.js 15
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate SEO Metadata dynamically based on product
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yuni.vanzodev.my.id";

  try {
    const response = await fetchApi(`/products/${slug}`);
    const product: Product = response.data;
    const title = product.meta_title || `${product.name} | Yuni Counter`;
    const description =
      product.meta_description ||
      product.description?.substring(0, 160) ||
      `Beli ${product.name} kualitas terbaik harga termurah di Yuni Counter Taichung, Taiwan.`;
    const firstImage = product.images?.[0]?.url || `${baseUrl}/og-image.jpg`;

    return {
      title,
      description,
      alternates: {
        canonical: `${baseUrl}/katalog/${slug}`,
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/katalog/${slug}`,
        type: "website",
        images: [
          {
            url: firstImage,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [firstImage],
      },
    };
  } catch (error) {
    return {
      title: "Produk Tidak Ditemukan | Yuni Counter",
    };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    // Fetch initial data on server for SSR
    const response = await fetchApi(`/products/${slug}`);
    const initialData: Product = response.data;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yuni.vanzodev.my.id";

    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: initialData.name,
      description: initialData.description,
      image: initialData.images?.map((img) => img.url) || [],
      offers: {
        "@type": "Offer",
        priceCurrency: "TWD",
        price: initialData.price,
        itemCondition:
          initialData.condition === "new"
            ? "https://schema.org/NewCondition"
            : "https://schema.org/UsedCondition",
        availability:
          initialData.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        seller: {
          "@type": "ElectronicsStore",
          name: "Yuni Counter",
          url: baseUrl,
        },
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Beranda",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Katalog",
          item: `${baseUrl}/katalog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: initialData.name,
          item: `${baseUrl}/katalog/${slug}`,
        },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <ProductDetailClient initialData={initialData} slug={slug} />
      </>
    );
  } catch (error) {
    notFound();
  }
}
