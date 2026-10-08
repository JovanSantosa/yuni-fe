"use client";

import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-muted p-3 text-muted-foreground">
        <FileQuestion className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-semibold">Halaman Tidak Ditemukan</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Halaman admin yang Anda cari tidak tersedia atau rute telah berubah.
      </p>
      <Button onClick={() => window.location.href = "/admin/dashboard"}>
        Kembali ke Dashboard
      </Button>
    </div>
  );
}
