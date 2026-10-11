import { Metadata } from "next";

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "https://yuni.vanzodev.my.id";
}

export const defaultSeo = {
  title: "Yuni Counter | Konter HP Terpercaya di Taichung, Taiwan",
  description:
    "Pusat jual beli handphone baru & bekas bergaransi, laptop, MacBook, iPad, tablet, dan aksesoris gadget terlengkap sejak 2004 di First Square (Asean Square), Lantai 3, Taichung, Taiwan. Harga jujur & transparan.",
  keywords: [
    "Yuni Counter",
    "konter hp taichung",
    "konter hp taiwan",
    "toko hp indonesia taichung",
    "first square taichung",
    "asean square pyramid",
    "beli hp di taiwan",
    "jual hp second taiwan",
    "service hp taichung",
    "tukar tambah hp taiwan",
    "iphone taichung",
    "macbook taiwan",
    "gadget indonesia taiwan",
  ],
  siteName: "Yuni Counter",
  locale: "id_ID",
  url: "https://yuni.vanzodev.my.id",
  branches: [
    {
      name: "Yuni Counter - Cabang Utama (Room 281)",
      address: "First Square (Asean Square Pyramid) Lantai 3, Room 281, Taichung, Taiwan",
      telephone: "+886-987-872-888",
      openingHours: "Mo-Su 10:00-21:00",
      since: "2004",
    },
    {
      name: "Yuni Counter - Cabang Baru (Room 330)",
      address: "First Square (Asean Square Pyramid) Lantai 3, Room 330, Taichung, Taiwan",
      telephone: "+886-987-872-888",
      openingHours: "Mo-Su 10:00-21:00",
      since: "2024",
    },
  ],
};

export function constructMetadata({
  title = defaultSeo.title,
  description = defaultSeo.description,
  keywords = defaultSeo.keywords,
  image = "/og-image.jpg",
  url = "https://yuni.vanzodev.my.id",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const baseUrl = getBaseUrl();
  const canonicalUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const imageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: "%s | Yuni Counter",
    },
    description,
    keywords,
    authors: [{ name: "Yuni Counter" }],
    creator: "Yuni Counter",
    publisher: "Yuni Counter",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        id: `${baseUrl}/?lang=id`,
        "zh-TW": `${baseUrl}/?lang=zh-TW`,
        en: `${baseUrl}/?lang=en`,
        vi: `${baseUrl}/?lang=vi`,
        th: `${baseUrl}/?lang=th`,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: defaultSeo.siteName,
      locale: defaultSeo.locale,
      alternateLocale: ["zh_TW", "en_US", "vi_VN", "th_TH"],
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@yunicounter",
    },
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}
