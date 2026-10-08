// @ts-nocheck
"use client";

import { useState } from "react";
import useSWR from "swr";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { swrFetcher, fetchApi } from "@/lib/api";
import { Product, Category, PaginatedResponse } from "@/types/api";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit2, Trash2, Loader2, ImagePlus, X, Filter } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form, FormControl, FormDescription, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/components/ui/form";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { formatTWD } from "@/components/shared/ProductCard";

// Schema for product details
const productSchema = z.object({
  category_id: z.coerce.number().min(1, "Pilih kategori"),
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  condition: z.enum(["new", "used"]),
  stock: z.coerce.number().min(0),
  branch: z.enum(["room330", "room281", "both"]),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  wa_message_template: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export default function ProdukPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  // Data Fetching
  const { data: productsData, isLoading, mutate } = useSWR<PaginatedResponse<Product>>(
    `/admin/products?page=${page}&per_page=10${search ? `&search=${search}` : ''}`,
    swrFetcher
  );
  const { data: categoriesResponse } = useSWR<{ data: Category[] }>(
    "/admin/categories", 
    swrFetcher
  );

  const categories = categoriesResponse?.data;
  const products = productsData?.data || [];
  const meta = productsData?.meta;

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Image Upload State
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category_id: 0,
      name: "",
      description: "",
      price: 0,
      condition: "new",
      stock: 0,
      branch: "both",
      is_featured: false,
      is_active: true,
      wa_message_template: "",
      meta_title: "",
      meta_description: "",
    },
  });

  const openAdd = () => {
    setEditingProduct(null);
    form.reset({
      category_id: categories?.[0]?.id || 0,
      name: "",
      description: "",
      price: 0,
      condition: "new",
      stock: 1,
      branch: "both",
      is_featured: false,
      is_active: true,
      wa_message_template: "",
      meta_title: "",
      meta_description: "",
    });
    setIsFormOpen(true);
  };

  const openEdit = (prod: Product) => {
    setEditingProduct(prod);
    form.reset({
      category_id: prod.category?.id || 0,
      name: prod.name,
      description: prod.description || "",
      price: Number(prod.price),
      condition: prod.condition,
      stock: prod.stock,
      branch: prod.branch,
      is_featured: prod.is_featured,
      is_active: prod.is_active,
      wa_message_template: prod.wa_message_template || "",
      meta_title: prod.meta_title || "",
      meta_description: prod.meta_description || "",
    });
    setIsFormOpen(true);
  };

  const openImageManager = (prod: Product) => {
    setEditingProduct(prod);
    setSelectedFiles([]);
    setIsImageOpen(true);
  };

  // --- Handlers ---

  async function onSubmitData(values: z.infer<typeof productSchema>) {
    setIsSaving(true);
    try {
      if (editingProduct) {
        await fetchApi(`/admin/products/${editingProduct.id}`, {
          method: "PUT",
          requireAuth: true,
          body: JSON.stringify(values),
        });
        toast.success("Data produk diperbarui.");
      } else {
        await fetchApi("/admin/products", {
          method: "POST",
          requireAuth: true,
          body: JSON.stringify(values), // We don't upload images on creation to keep it simple, we do it after via Image Manager
        });
        toast.success("Produk ditambahkan. Silakan upload gambar.");
      }
      setIsFormOpen(false);
      mutate();
    } catch (error: any) {
      toast.error("Gagal menyimpan", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteProduct(id: number) {
    try {
      await fetchApi(`/admin/products/${id}`, { method: "DELETE", requireAuth: true });
      toast.success("Produk dihapus.");
      mutate();
    } catch (error: any) {
      toast.error("Gagal menghapus", { description: error.message });
    }
  }

  async function handleUploadImages() {
    if (!editingProduct || selectedFiles.length === 0) return;
    
    setIsSaving(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append("images[]", file);
      });

      await fetchApi(`/admin/products/${editingProduct.id}/images`, {
        method: "POST",
        requireAuth: true,
        body: formData,
      });

      toast.success("Gambar berhasil diupload.");
      setSelectedFiles([]);
      mutate(); // This will refresh the table
      
      // Also need to refresh the editingProduct state to show new images in modal
      const res = await fetchApi(`/products/${editingProduct.slug}`);
      setEditingProduct(res.data);

    } catch (error: any) {
      toast.error("Gagal upload", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteImage(imgId: number) {
    if (!editingProduct) return;
    try {
      await fetchApi(`/admin/products/${editingProduct.id}/images/${imgId}`, {
        method: "DELETE",
        requireAuth: true,
      });
      toast.success("Gambar dihapus.");
      mutate();
      
      // Refresh local state
      const res = await fetchApi(`/products/${editingProduct.slug}`);
      setEditingProduct(res.data);
    } catch (error: any) {
      toast.error("Gagal menghapus gambar", { description: error.message });
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Produk</h1>
          <p className="text-muted-foreground mt-2">Kelola inventaris dan katalog.</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <Input 
          placeholder="Cari produk..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card"
        />
        <Button variant="outline" size="icon" onClick={() => mutate()}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></TableCell></TableRow>
            ) : products.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">Tidak ada produk.</TableCell></TableRow>
            ) : (
              products.map((prod) => (
                <TableRow key={prod.id}>
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-muted border">
                      {prod.images?.[0] ? (
                        <Image src={prod.images[0].url} alt="" fill unoptimized className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No img</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium line-clamp-1">{prod.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">{prod.category?.name}</Badge>
                      <span className="text-xs text-muted-foreground">{prod.condition === 'new' ? 'Baru' : 'Bekas'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatTWD(prod.price)}</TableCell>
                  <TableCell>
                    <Badge variant={prod.stock <= 0 ? "destructive" : "outline"}>{prod.stock} unit</Badge>
                  </TableCell>
                  <TableCell>
                    {prod.is_active ? <span className="text-green-600 dark:text-green-400 text-sm">Aktif</span> : <span className="text-muted-foreground text-sm">Nonaktif</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openImageManager(prod)} title="Kelola Gambar">
                        <ImagePlus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(prod)} title="Edit Data">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" />}>
                          <Trash2 className="h-4 w-4" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Produk?</AlertDialogTitle>
                            <AlertDialogDescription>Data produk dan semua gambarnya akan terhapus dari server.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDeleteProduct(prod.id)}>Hapus</AlertDialogAction>
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

      {/* Pagination Controls */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-4">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
          <span className="text-sm text-muted-foreground">Hal {page} dari {meta.last_page}</span>
          <Button variant="outline" disabled={page === meta.last_page} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}

      {/* DIALOG 1: FORM DATA PRODUK */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Data Produk" : "Tambah Produk Baru"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitData, () => {
              toast.error("Validasi gagal", { description: "Ada input wajib yang terlewat. Cek tulisan merah." });
            })} className="space-y-6 pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Nama Produk</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category_id" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value || "")}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Deskripsi</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <div className="grid sm:grid-cols-3 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem><FormLabel>Harga (NT$)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="stock" render={({ field }) => (
                  <FormItem><FormLabel>Stok Fisik</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="condition" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kondisi</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="new">Baru</SelectItem>
                        <SelectItem value="used">Bekas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="branch" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lokasi Tersedia</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="both">Keduanya (Room 330 & 281)</SelectItem>
                        <SelectItem value="room330">Room 330 Saja</SelectItem>
                        <SelectItem value="room281">Room 281 Saja</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="wa_message_template" render={({ field }) => (
                  <FormItem><FormLabel>Custom WA Teks (Opsional)</FormLabel><FormControl><Input placeholder="Bawaan setting global" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              {/* Switches */}
              <div className="flex gap-8 py-4 border-y">
                <FormField control={form.control} name="is_featured" render={({ field }) => (
                  <FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Produk Unggulan</FormLabel></FormItem>
                )} />
                <FormField control={form.control} name="is_active" render={({ field }) => (
                  <FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="!mt-0">Status Aktif</FormLabel></FormItem>
                )} />
              </div>

              {/* SEO */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">SEO Meta (Opsional)</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="meta_title" render={({ field }) => (
                    <FormItem><FormControl><Input placeholder="Meta Title" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="meta_description" render={({ field }) => (
                    <FormItem><FormControl><Input placeholder="Meta Description" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Simpan Data Produk
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: IMAGE MANAGER */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Kelola Gambar - {editingProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            
            {/* Existing Images */}
            <div>
              <h4 className="text-sm font-medium mb-3">Gambar Tersimpan ({editingProduct?.images?.length || 0}/5)</h4>
              <div className="grid grid-cols-4 gap-4">
                {editingProduct?.images?.map((img) => (
                  <div key={img.id} className="relative group aspect-square rounded-lg border overflow-hidden bg-muted">
                    <Image src={img.url} alt="" fill unoptimized className="object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteImage(img.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {(!editingProduct?.images || editingProduct.images.length === 0) && (
                <p className="text-sm text-muted-foreground">Belum ada gambar diupload.</p>
              )}
            </div>

            {/* Upload New Images */}
            {editingProduct && (editingProduct.images?.length || 0) < 5 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Upload Baru</h4>
                <div className="flex gap-4 items-start">
                  <Input 
                    type="file" 
                    multiple 
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      // Limit array strictly to the remaining slots
                      const remaining = 5 - (editingProduct.images?.length || 0);
                      setSelectedFiles(files.slice(0, remaining));
                    }}
                  />
                  <Button onClick={handleUploadImages} disabled={selectedFiles.length === 0 || isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Pilih maksimal {5 - (editingProduct.images?.length || 0)} gambar. Format: JPG/PNG/WEBP (Maks 10MB per file).
                </p>
              </div>
            )}
            
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
