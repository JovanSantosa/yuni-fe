"use client";

import useSWR from "swr";
import { swrFetcher } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Tags, AlertTriangle, AlertCircle, Star } from "lucide-react";

interface DashboardData {
  total_products: number;
  total_categories: number;
  out_of_stock: number;
  low_stock: number;
  featured_products: number;
}

export default function DashboardPage() {
  const { data: response, isLoading, error } = useSWR<{ data: DashboardData }>(
    "/admin/dashboard",
    swrFetcher
  );

  const data = response?.data;

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
        Gagal memuat data dashboard. Pastikan Anda sudah login dan server berjalan.
      </div>
    );
  }

  const stats = [
    {
      title: "Total Produk",
      value: data?.total_products ?? 0,
      icon: Package,
      description: "Total produk terdaftar",
    },
    {
      title: "Total Kategori",
      value: data?.total_categories ?? 0,
      icon: Tags,
      description: "Kategori produk aktif",
    },
    {
      title: "Produk Unggulan",
      value: data?.featured_products ?? 0,
      icon: Star,
      description: "Tampil di halaman utama",
    },
    {
      title: "Stok Menipis",
      value: data?.low_stock ?? 0,
      icon: AlertTriangle,
      description: "Butuh perhatian",
      alert: (data?.low_stock ?? 0) > 0,
    },
    {
      title: "Stok Habis",
      value: data?.out_of_stock ?? 0,
      icon: AlertCircle,
      description: "Tidak bisa dibeli",
      danger: (data?.out_of_stock ?? 0) > 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Ringkasan performa dan inventaris Yuni Counter.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array(5)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))
          : stats.map((stat, i) => (
              <Card 
                key={i} 
                className={
                  stat.danger 
                    ? "border-destructive/50 bg-destructive/5" 
                    : stat.alert 
                    ? "border-orange-500/50 bg-orange-500/5" 
                    : ""
                }
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon 
                    className={`h-4 w-4 ${
                      stat.danger ? "text-destructive" : stat.alert ? "text-orange-500" : "text-muted-foreground"
                    }`} 
                  />
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold tracking-tight ${
                      stat.danger ? "text-destructive" : stat.alert ? "text-orange-600 dark:text-orange-400" : ""
                    }`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
