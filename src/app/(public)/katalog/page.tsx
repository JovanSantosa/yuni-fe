import { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import KatalogClient from "./client-page";

export const metadata: Metadata = constructMetadata({
  title: "Katalog Handphone, Laptop & Aksesoris Terlengkap",
  description:
    "Cek katalog lengkap HP baru & second (iPhone, Samsung, Xiaomi), MacBook, iPad, tablet, dan aksesoris original di Taichung Taiwan. Harga transparan & bergaransi.",
  url: "/katalog",
});

export default function KatalogPage() {
  return <KatalogClient />;
}
