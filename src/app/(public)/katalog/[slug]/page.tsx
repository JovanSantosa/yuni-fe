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
  // Await the params object (required in Next.js 15)
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const response = await fetchApi(`/products/${slug}`);
    const product: Product = response.data;

    return {
      title: product.meta_title || `${product.name} | Yuni Counter`,
      description: product.meta_description || product.description?.substring(0, 160),
      openGraph: {
        title: product.meta_title || product.name,
        description: product.meta_description || product.description?.substring(0, 160) || "",
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch (error) {
    return {
      title: "Produk Tidak Ditemukan | Yuni Counter",
    };
  }
}

export default async function ProductPage({ params }: PageProps) {
  // Await the params object (required in Next.js 15)
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    // Fetch initial data on server for SSR
    const response = await fetchApi(`/products/${slug}`);
    const initialData: Product = response.data;

    return <ProductDetailClient initialData={initialData} slug={slug} />;
  } catch (error) {
    notFound();
  }
}
