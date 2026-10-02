// @ts-nocheck
"use client";

import { useState } from "react";
import useSWR from "swr";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { swrFetcher, fetchApi } from "@/lib/api";
import { Category } from "@/types/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
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

const categorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  icon: z.string().optional(),
  order: z.coerce.number().min(0),
  is_active: z.boolean().default(true),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export default function KategoriPage() {
  const { data: response, isLoading, mutate } = useSWR<{ data: Category[] }>(
    "/admin/categories",
    swrFetcher
  );
  
  const categories = response?.data;

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      icon: "",
      order: 0,
      is_active: true,
    },
  });

  const openAdd = () => {
    setEditingId(null);
    form.reset({ name: "", icon: "", order: 0, is_active: true });
    setIsOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingId(cat.id);
    form.reset({
      name: cat.name,
      icon: cat.icon || "",
      order: cat.order,
      is_active: cat.is_active,
    });
    setIsOpen(true);
  };

  async function onSubmit(values: CategoryFormValues) {
    setIsSaving(true);
    try {
      if (editingId) {
        await fetchApi(`/admin/categories/${editingId}`, {
          method: "PUT",
          requireAuth: true,
          body: JSON.stringify(values),
        });
        toast.success("Kategori berhasil diperbarui.");
      } else {
        await fetchApi("/admin/categories", {
          method: "POST",
          requireAuth: true,
          body: JSON.stringify(values),
        });
        toast.success("Kategori berhasil ditambahkan.");
      }
      setIsOpen(false);
      mutate(); // re-fetch table data
    } catch (error: any) {
      toast.error("Gagal menyimpan", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await fetchApi(`/admin/categories/${id}`, {
        method: "DELETE",
        requireAuth: true,
      });
      toast.success("Kategori berhasil dihapus.");
      mutate();
    } catch (error: any) {
      toast.error("Gagal menghapus", { description: error.message });
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategori</h1>
          <p className="text-muted-foreground mt-2">
            Kelola kategori produk untuk mempermudah navigasi katalog.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Kategori" : "Tambah Kategori"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, () => {
                toast.error("Validasi gagal", { description: "Pastikan nama kategori sudah terisi." });
              })} className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Kategori</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Handphone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon (Opsional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama icon lucide-react" {...field} />
                      </FormControl>
                      <FormDescription>Kosongkan jika tidak ada icon.</FormDescription>
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
                        <FormLabel>Urutan</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Semakin kecil tampil lebih awal</FormDescription>
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
                    Simpan Kategori
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Urutan</TableHead>
              <TableHead>Nama Kategori</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Total Produk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : categories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Belum ada kategori.
                </TableCell>
              </TableRow>
            ) : (
              categories?.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.order}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell>
                    <span className="inline-flex h-6 items-center justify-center rounded-full bg-muted px-2.5 text-xs font-medium">
                      {cat.products_count || 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    {cat.is_active ? (
                      <span className="text-green-600 dark:text-green-400">Aktif</span>
                    ) : (
                      <span className="text-muted-foreground">Nonaktif</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" />}>
                          <Trash2 className="h-4 w-4" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Kategori ini akan dihapus dari sistem.
                              Anda tidak bisa menghapus kategori yang masih memiliki produk di dalamnya.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(cat.id)}
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
