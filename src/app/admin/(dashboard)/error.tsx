"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-destructive/10 p-3 text-destructive">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold">Terjadi Kesalahan</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Halaman tidak dapat dimuat: {error.message || "Terjadi kesalahan sistem internal."}
      </p>
      <div className="flex gap-2">
        <Button onClick={() => reset()} variant="default">
          Coba Lagi
        </Button>
        <Button onClick={() => window.location.href = "/admin/dashboard"} variant="outline">
          Kembali ke Dashboard
        </Button>
      </div>
    </div>
  );
}
