// @ts-nocheck
"use client";

import { useState } from "react";
import useSWR from "swr";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { swrFetcher, fetchApi } from "@/lib/api";
import { Banner } from "@/types/api";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit2, Trash2, Loader2, ImageIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

// Schema for frontend validation
// Note: We don't strictly validate File object in Zod here because React Hook Form handles file inputs a bit differently.
const bannerSchema = z.object({
  title: z.string().optional(),
  link_url: z.string().optional(),
  order: z.coerce.number().min(0),
  is_active: z.boolean().default(true),
});

export default function BannerPage() {
  const { data: response, isLoading, mutate } = useSWR<{ data: Banner[] }>(
    "/admin/banners",
    swrFetcher
  );
  
  const banners = response?.data;

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof bannerSchema>>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      link_url: "",
      order: 0,
      is_active: true,
    },
  });

  const openAdd = () => {
    setEditingId(null);
    setSelectedFile(null);
    form.reset({ title: "", link_url: "", order: 0, is_active: true });
    setIsOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingId(banner.id);
    setSelectedFile(null);
    form.reset({
      title: banner.title || "",
      link_url: banner.link_url || "",
      order: banner.order,
      is_active: banner.is_active,
    });
    setIsOpen(true);
  };

  async function onSubmit(values: z.infer<typeof bannerSchema>) {
    if (!editingId && !selectedFile) {
      toast.error("File gambar banner wajib diupload.");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      if (values.title) formData.append("title", values.title);
      if (values.link_url) formData.append("link_url", values.link_url);
      formData.append("order", String(values.order));
      formData.append("is_active", values.is_active ? "1" : "0");
      
      // Laravel uses PUT/PATCH but multipart/form-data with PUT is buggy in PHP.
      // Standard workaround: use POST and append _method=PUT
      if (editingId) {
        formData.append("_method", "PUT");
      }

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const endpoint = editingId ? `/admin/banners/${editingId}` : "/admin/banners";
      
      await fetchApi(endpoint, {
        method: "POST", // We always POST, but pass _method=PUT if editing
        requireAuth: true,
        body: formData, // fetchApi will automatically NOT set Content-Type so browser sets boundary
      });

      toast.success(editingId ? "Banner diperbarui." : "Banner ditambahkan.");
      setIsOpen(false);
      mutate();
    } catch (error: any) {
      toast.error("Gagal menyimpan", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await fetchApi(`/admin/banners/${id}`, {
        method: "DELETE",
        requireAuth: true,
      });
      toast.success("Banner berhasil dihapus.");
      mutate();
    } catch (error: any) {
      toast.error("Gagal menghapus", { description: error.message });
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Banner Promo</h1>
          <p className="text-muted-foreground mt-2">
            Kelola gambar banner yang tampil di halaman depan.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Banner
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Banner" : "Tambah Banner"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, () => {
                toast.error("Validasi gagal", { description: "Periksa kembali inputan Anda." });
              })} className="space-y-6 pt-4">
                
                <div className="space-y-2">
                  <FormLabel>File Gambar {editingId ? "(Opsional)" : "(Wajib)"}</FormLabel>
                  <Input 
                    type="file" 
                    accept="image/jpeg,image/png,image/webp" 
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  <FormDescription>Format JPG, PNG, WEBP. Maks 10MB.</FormDescription>
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Judul Internal (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Promo Lebaran..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link URL (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>Tujuan klik banner.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urutan Tampil</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-center justify-center pt-8">
                        <div className="flex items-center space-x-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="m-0">Aktif</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Simpan Banner
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Urutan</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : banners?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Belum ada banner.
                </TableCell>
              </TableRow>
            ) : (
              banners?.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="font-medium text-center">{banner.order}</TableCell>
                  <TableCell>
                    <div className="relative w-32 h-16 rounded-md overflow-hidden bg-muted border">
                      <Image 
                        src={banner.image_url} 
                        alt={banner.title || "Banner"} 
                        fill 
                        className="object-cover" 
                        unoptimized // For admin preview, bypass next/image opt if needed, but it's fine
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{banner.title || "-"}</p>
                      <p className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {banner.link_url || "Tanpa Link"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {banner.is_active ? (
                      <span className="text-green-600 dark:text-green-400 font-medium">Aktif</span>
                    ) : (
                      <span className="text-muted-foreground">Nonaktif</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(banner)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" />}>
                          <Trash2 className="h-4 w-4" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Banner?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Banner ini akan dihapus secara permanen. File gambar aslinya juga akan terhapus dari server.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(banner.id)}
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
