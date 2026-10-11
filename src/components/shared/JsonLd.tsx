import React from "react";

export function JsonLd() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ElectronicsStore",
        "@id": "https://yuni.vanzodev.my.id/#store",
        "name": "Yuni Counter",
        "alternateName": ["Yuni Counter Taichung", "Konter HP Yuni Taiwan"],
        "url": "https://yuni.vanzodev.my.id",
        "logo": "https://yuni.vanzodev.my.id/og-image.jpg",
        "image": "https://yuni.vanzodev.my.id/og-image.jpg",
        "description":
          "Pusat jual beli handphone baru & bekas bergaransi, laptop, MacBook, iPad, tablet, dan aksesoris gadget terlengkap sejak 2004 di First Square (Asean Square), Lantai 3, Taichung, Taiwan.",
        "telephone": "+886-987-872-888",
        "priceRange": "$$",
        "currenciesAccepted": "TWD, IDR",
        "paymentAccepted": "Cash, Bank Transfer",
        "openingHours": "Mo-Su 10:00-21:00",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "First Square (Asean Square Pyramid) Lantai 3, Room 281 & Room 330",
          "addressLocality": "Taichung",
          "addressRegion": "Central District",
          "postalCode": "400",
          "addressCountry": "TW"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 24.1368,
          "longitude": 120.6850
        },
        "sameAs": [
          "https://wa.me/886987872888",
          "https://www.tiktok.com/@yunistore.lt3room330",
          "https://www.tiktok.com/@yuni.counter.3f"
        ],
        "department": [
          {
            "@type": "ElectronicsStore",
            "name": "Yuni Counter - Cabang Utama (Room 281)",
            "telephone": "+886-987-872-888",
            "openingHours": "Mo-Su 10:00-21:00",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "First Square Lantai 3, Room 281",
              "addressLocality": "Taichung",
              "addressCountry": "TW"
            }
          },
          {
            "@type": "ElectronicsStore",
            "name": "Yuni Counter - Cabang Baru (Room 330)",
            "telephone": "+886-987-872-888",
            "openingHours": "Mo-Su 10:00-21:00",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "First Square Lantai 3, Room 330",
              "addressLocality": "Taichung",
              "addressCountry": "TW"
            }
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://yuni.vanzodev.my.id/#website",
        "url": "https://yuni.vanzodev.my.id",
        "name": "Yuni Counter",
        "description": "Konter HP Terpercaya di Taichung, Taiwan",
        "publisher": {
          "@id": "https://yuni.vanzodev.my.id/#store"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://yuni.vanzodev.my.id/katalog?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
