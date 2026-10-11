import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yuni.vanzodev.my.id";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://yuni.vanzodev.my.id/api";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/katalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  try {
    const res = await fetch(`${apiUrl}/products?per_page=100`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      return staticRoutes;
    }

    const json = await res.json();
    const products = json.data || [];

    const productRoutes: MetadataRoute.Sitemap = products.map((item: any) => ({
      url: `${baseUrl}/katalog/${item.slug}`,
      lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
    return staticRoutes;
  }
}
