// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { swrFetcher, fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Save, MessageSquareQuote, HelpCircle, Plus, Trash2, Edit2, Upload, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const settingsSchema = z.object({
  hero_image: z.string().optional(),
  about_image: z.string().optional(),
  cta_image: z.string().optional(),
  address_room330: z.string().optional(),
  address_room281: z.string().optional(),
  phone_number: z.string().optional(),
  whatsapp_number: z.string().min(1, "Nomor WhatsApp wajib diisi"),
  whatsapp_default_message: z.string().optional(),
  tiktok_account_1: z.string().optional(),
  tiktok_account_2: z.string().optional(),
  operating_hours: z.string().optional(),
  map_url: z.string().optional(),
  stat_customers: z.string().optional(),
  stat_years: z.string().optional(),
  stat_branches: z.string().optional(),
  low_stock_threshold: z.coerce.number().min(1),
  idr_exchange_rate: z.coerce.number().min(0),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function PengaturanPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [contentLang, setContentLang] = useState<"id" | "zh-TW" | "en">("id");

  // Multi-language text state for Hero and About
  const [transValues, setTransValues] = useState({
    hero_title: { id: "", "zh-TW": "", en: "" },
    hero_subtitle: { id: "", "zh-TW": "", en: "" },
    about_text: { id: "", "zh-TW": "", en: "" },
  });

  // Settings Data
  const { data: response, isLoading, mutate: mutateSettings } = useSWR<{ data: Record<string, any> }>(
    "/admin/settings",
    swrFetcher
  );
  const data = response?.data;

  // Testimonials Data
  const { data: testResponse, mutate: mutateTestimonials } = useSWR<{ data: any[] }>(
    "/admin/testimonials",
    swrFetcher
  );
  const testimonials = testResponse?.data || [];

  // FAQs Data
  const { data: faqResponse, mutate: mutateFaqs } = useSWR<{ data: any[] }>(
    "/admin/faqs",
    swrFetcher
  );
  const faqs = faqResponse?.data || [];

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      hero_image: "",
      about_image: "",
      cta_image: "",
      address_room330: "",
      address_room281: "",
      phone_number: "",
      whatsapp_number: "",
      whatsapp_default_message: "",
      tiktok_account_1: "",
      tiktok_account_2: "",
      operating_hours: "",
      map_url: "",
      stat_customers: "",
      stat_years: "",
      stat_branches: "",
      low_stock_threshold: 3,
      idr_exchange_rate: 500,
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        hero_image: data.hero_image || "",
        about_image: data.about_image || "",
        cta_image: data.cta_image || "",
        address_room330: data.address_room330 || "",
        address_room281: data.address_room281 || "",
        phone_number: data.phone_number || "",
        whatsapp_number: data.whatsapp_number || "",
        whatsapp_default_message: data.whatsapp_default_message || "Halo Yuni Counter, saya tertarik dengan {product_name}",
        tiktok_account_1: data.tiktok_account_1 || "",
        tiktok_account_2: data.tiktok_account_2 || "",
        operating_hours: data.operating_hours || "",
        map_url: data.map_url || "",
        stat_customers: data.stat_customers || "1000+",
        stat_years: data.stat_years || "20+",
        stat_branches: data.stat_branches || "2",
        low_stock_threshold: Number(data.low_stock_threshold) || 3,
        idr_exchange_rate: Number(data.idr_exchange_rate) || 500,
      });

      // Parse translatable values
      const parseField = (val: any) => {
        if (typeof val === "object" && val !== null) {
          return { id: val.id || "", "zh-TW": val["zh-TW"] || "", en: val.en || "" };
        }
        if (typeof val === "string" && val.startsWith("{")) {
          try {
            const parsed = JSON.parse(val);
            return { id: parsed.id || "", "zh-TW": parsed["zh-TW"] || "", en: parsed.en || "" };
          } catch (e) {
            return { id: val, "zh-TW": "", en: "" };
          }
        }
        return { id: val || "", "zh-TW": "", en: "" };
      };

      setTransValues({
        hero_title: parseField(data.hero_title),
        hero_subtitle: parseField(data.hero_subtitle),
        about_text: parseField(data.about_text),
      });
    }
  }, [data, form]);

  async function onSubmit(values: SettingsFormValues) {
    setIsSaving(true);
    try {
      const payload = {
        ...values,
        hero_title: transValues.hero_title,
        hero_subtitle: transValues.hero_subtitle,
        about_text: transValues.about_text,
      };

      await fetchApi("/admin/settings", {
        method: "PUT",
        requireAuth: true,
        body: JSON.stringify(payload),
      });
      toast.success("Pengaturan berhasil disimpan.");
      mutateSettings();
    } catch (error: any) {
      toast.error("Gagal menyimpan", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  }

  // Handle direct image file upload to Backend
  const handleUploadImage = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const formData = new FormData();
      formData.append("key", key);
      formData.append("image", file);

      const res = await fetchApi("/admin/settings/upload-image", {
        method: "POST",
        requireAuth: true,
        body: formData,
      });

      toast.success("Gambar berhasil diupload");
      form.setValue(key, res.url);
      mutateSettings();
    } catch (err: any) {
      toast.error("Gagal upload gambar", { description: err.message });
    } finally {
      setUploadingKey(null);
    }
  };

  // --- Testimonials Modal & Actions ---
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<number | null>(null);
  const [testForm, setTestForm] = useState({
    customer_name: "",
    customer_status: "",
    quote: "",
    avatar_path: "",
  });

  const openAddTestimonial = () => {
    setEditingTestId(null);
    setTestForm({ customer_name: "", customer_status: "", quote: "", avatar_path: "" });
    setTestModalOpen(true);
  };

  const openEditTestimonial = (item: any) => {
    setEditingTestId(item.id);
    setTestForm({
      customer_name: item.customer_name,
      customer_status: item.customer_status,
      quote: item.quote,
      avatar_path: item.avatar_url || "",
    });
    setTestModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestId) {
        await fetchApi(`/admin/testimonials/${editingTestId}`, {
          method: "PUT",
          requireAuth: true,
          body: JSON.stringify(testForm),
        });
        toast.success("Testimoni diperbarui");
      } else {
        await fetchApi("/admin/testimonials", {
          method: "POST",
          requireAuth: true,
          body: JSON.stringify(testForm),
        });
        toast.success("Testimoni ditambahkan");
      }
      mutateTestimonials();
      setTestModalOpen(false);
    } catch (err: any) {
      toast.error("Gagal menyimpan testimoni", { description: err.message });
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Hapus testimoni ini?")) return;
    try {
      await fetchApi(`/admin/testimonials/${id}`, {
        method: "DELETE",
        requireAuth: true,
      });
      toast.success("Testimoni dihapus");
      mutateTestimonials();
    } catch (err: any) {
      toast.error("Gagal menghapus", { description: err.message });
    }
  };

  // --- FAQ Modal & Actions ---
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
  });

  const openAddFaq = () => {
    setEditingFaqId(null);
    setFaqForm({ question: "", answer: "" });
    setFaqModalOpen(true);
  };

  const openEditFaq = (item: any) => {
    setEditingFaqId(item.id);
    setFaqForm({
      question: item.question,
      answer: item.answer,
    });
    setFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFaqId) {
        await fetchApi(`/admin/faqs/${editingFaqId}`, {
          method: "PUT",
          requireAuth: true,
          body: JSON.stringify(faqForm),
        });
        toast.success("FAQ diperbarui");
      } else {
        await fetchApi("/admin/faqs", {
          method: "POST",
          requireAuth: true,
          body: JSON.stringify(faqForm),
        });
        toast.success("FAQ ditambahkan");
      }
      mutateFaqs();
      setFaqModalOpen(false);
    } catch (err: any) {
      toast.error("Gagal menyimpan FAQ", { description: err.message });
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!confirm("Hapus FAQ ini?")) return;
    try {
      await fetchApi(`/admin/faqs/${id}`, {
        method: "DELETE",
        requireAuth: true,
      });
      toast.success("FAQ dihapus");
      mutateFaqs();
    } catch (err: any) {
      toast.error("Gagal menghapus", { description: err.message });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan & Konten</h1>
          <p className="text-muted-foreground mt-1">
            Kelola informasi toko, gambar beranda, teks multi-bahasa, testimoni pelanggan, dan FAQ.
          </p>
        </div>
      </div>

      <Tabs defaultValue="toko" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-xl mb-6">
          <TabsTrigger value="toko">Toko & Kontak</TabsTrigger>
          <TabsTrigger value="konten">Teks & Gambar</TabsTrigger>
          <TabsTrigger value="testimoni">Testimoni ({testimonials.length})</TabsTrigger>
          <TabsTrigger value="faq">FAQ ({faqs.length})</TabsTrigger>
        </TabsList>

        {/* TAB 1: TOKO & KONTAK */}
        <TabsContent value="toko">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <Card>
                <CardHeader>
                  <CardTitle>Kontak & Alamat Cabang</CardTitle>
                  <CardDescription>Nomor telepon, WhatsApp, akun TikTok, dan alamat dua cabang di First Square.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input placeholder="0987-872-888" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="whatsapp_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor WhatsApp</FormLabel>
                          <FormControl>
                            <Input placeholder="886987872888" {...field} />
                          </FormControl>
                          <FormDescription>Gunakan format kode negara (contoh: 886987872888).</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="tiktok_account_1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link TikTok Cabang Room 330</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.tiktok.com/@..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tiktok_account_2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link TikTok Utama / Room 281</FormLabel>
                          <FormControl>
                            <Input placeholder="https://www.tiktok.com/@..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="address_room281"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat Cabang Utama (Room 281)</FormLabel>
                          <FormControl>
                            <Textarea rows={2} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address_room330"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat Cabang Baru (Room 330)</FormLabel>
                          <FormControl>
                            <Textarea rows={2} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="operating_hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jam Operasional</FormLabel>
                          <FormControl>
                            <Input placeholder="Senin - Minggu: 10:00 - 21:00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="map_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link Google Maps</FormLabel>
                          <FormControl>
                            <Input placeholder="https://share.google/..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sistem & Kurs Mata Uang</CardTitle>
                  <CardDescription>Pengaturan nilai tukar TWD ke IDR dan batas stok menipis.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="idr_exchange_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kurs 1 NT$ ke Rupiah (IDR)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Nilai estimasi yang muncul di katalog (contoh: 500 = Rp 500).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="low_stock_threshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batas Peringatan Stok Menipis</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>Jika sisa unit di bawah angka ini, badge 'Stok Menipis' akan tampil.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} className="btn-gradient-cta !text-sm">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan Pengaturan Toko
                </Button>
              </div>

            </form>
          </Form>
        </TabsContent>

        {/* TAB 2: TEKS & GAMBAR BERANDA (DENGAN SELECTOR BAHASA) */}
        <TabsContent value="konten">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Image Upload Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Gambar Beranda</CardTitle>
                  <CardDescription>Upload foto asli toko, showcase HP, dan background banner langsung ke server.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                  
                  {/* Hero Image */}
                  <div className="p-4 border rounded-xl bg-card space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Gambar Hero Showcase</h4>
                      <p className="text-xs text-muted-foreground mb-3 font-light">Foto display smartphone di samping judul utama.</p>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border bg-muted/20 mb-3">
                        {form.watch("hero_image") ? (
                          <Image src={form.watch("hero_image")!} alt="Hero Preview" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">Belum ada gambar</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="btn-secondary w-full cursor-pointer !py-2 !text-xs flex items-center justify-center gap-1.5">
                        {uploadingKey === "hero_image" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Ganti Gambar Hero</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleUploadImage("hero_image", e.target.files[0]);
                          }} 
                        />
                      </label>
                    </div>
                  </div>

                  {/* About Image */}
                  <div className="p-4 border rounded-xl bg-card space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Gambar Tentang Kami</h4>
                      <p className="text-xs text-muted-foreground mb-3 font-light">Foto suasana toko / konter di bagian Tentang Kami.</p>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border bg-muted/20 mb-3">
                        {form.watch("about_image") ? (
                          <Image src={form.watch("about_image")!} alt="About Preview" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">Belum ada gambar</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="btn-secondary w-full cursor-pointer !py-2 !text-xs flex items-center justify-center gap-1.5">
                        {uploadingKey === "about_image" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Ganti Gambar Tentang</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleUploadImage("about_image", e.target.files[0]);
                          }} 
                        />
                      </label>
                    </div>
                  </div>

                  {/* CTA Image */}
                  <div className="p-4 border rounded-xl bg-card space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Background Banner CTA</h4>
                      <p className="text-xs text-muted-foreground mb-3 font-light">Foto latar belakang gelap di box ajakan WhatsApp.</p>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border bg-muted/20 mb-3">
                        {form.watch("cta_image") ? (
                          <Image src={form.watch("cta_image")!} alt="CTA Preview" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">Belum ada gambar</div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="btn-secondary w-full cursor-pointer !py-2 !text-xs flex items-center justify-center gap-1.5">
                        {uploadingKey === "cta_image" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                        <span>Ganti Background CTA</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleUploadImage("cta_image", e.target.files[0]);
                          }} 
                        />
                      </label>
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Multilingual Text Editor Card */}
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-[var(--red)]" />
                      Teks Beranda Multi-Bahasa
                    </CardTitle>
                    <CardDescription>
                      Pilih tab bahasa di sebelah kanan untuk menyesuaikan teks dalam Bahasa Indonesia, Mandarin (Taiwan), atau Inggris.
                    </CardDescription>
                  </div>

                  {/* Language Selector Pills */}
                  <div className="flex p-1 bg-muted rounded-xl">
                    <button
                      type="button"
                      onClick={() => setContentLang("id")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        contentLang === "id" ? "bg-[var(--card-bg)] shadow text-[var(--red)]" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      🇮🇩 Indonesia
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentLang("zh-TW")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        contentLang === "zh-TW" ? "bg-[var(--card-bg)] shadow text-[var(--red)]" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      🇹🇼 繁體中文
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentLang("en")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        contentLang === "en" ? "bg-[var(--card-bg)] shadow text-[var(--red)]" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      🇬🇧 English
                    </button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-heading)]">
                        Judul Utama Hero ({contentLang.toUpperCase()})
                      </label>
                      <Input
                        value={transValues.hero_title[contentLang] || ""}
                        onChange={(e) =>
                          setTransValues({
                            ...transValues,
                            hero_title: { ...transValues.hero_title, [contentLang]: e.target.value },
                          })
                        }
                        placeholder={
                          contentLang === "zh-TW"
                            ? "台中最值得信賴的手機專賣店"
                            : contentLang === "en"
                            ? "Trusted Phone Store in Taichung"
                            : "Konter HP Terpercaya di Taichung"
                        }
                      />
                      <p className="text-[11px] text-muted-foreground font-light">
                        {contentLang === "zh-TW" ? "文字中的「台中」將會自動套用漸層紅效果。" : "Kata 'Taichung' akan otomatis dihias gradasi merah elegan."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-heading)]">
                        Sub-judul Penjelas Hero ({contentLang.toUpperCase()})
                      </label>
                      <Input
                        value={transValues.hero_subtitle[contentLang] || ""}
                        onChange={(e) =>
                          setTransValues({
                            ...transValues,
                            hero_subtitle: { ...transValues.hero_subtitle, [contentLang]: e.target.value },
                          })
                        }
                        placeholder="Deskripsi singkat layanan..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-heading)]">
                      Teks Tentang Kami ({contentLang.toUpperCase()})
                    </label>
                    <Textarea
                      rows={5}
                      value={transValues.about_text[contentLang] || ""}
                      onChange={(e) =>
                        setTransValues({
                          ...transValues,
                          about_text: { ...transValues.about_text, [contentLang]: e.target.value },
                        })
                      }
                      placeholder="Cerita dan sejarah Yuni Counter..."
                    />
                    <p className="text-[11px] text-muted-foreground font-light">Gunakan enter dua kali untuk memisahkan paragraf.</p>
                  </div>

                  <div className="grid gap-5 grid-cols-3 pt-3 border-t">
                    <FormField
                      control={form.control}
                      name="stat_years"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tahun Berdiri</FormLabel>
                          <FormControl>
                            <Input placeholder="20+" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stat_branches"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jumlah Cabang</FormLabel>
                          <FormControl>
                            <Input placeholder="2" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="stat_customers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pelanggan Setia</FormLabel>
                          <FormControl>
                            <Input placeholder="1000+" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} className="btn-gradient-cta !text-sm">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan Teks & Gambar
                </Button>
              </div>

            </form>
          </Form>
        </TabsContent>

        {/* TAB 3: TESTIMONI */}
        <TabsContent value="testimoni">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Testimoni Pelanggan</CardTitle>
                <CardDescription>Ulasan dan rating dari pembeli yang tampil di halaman depan.</CardDescription>
              </div>
              <Button onClick={openAddTestimonial} className="btn-gradient-cta !py-2 !px-4 !text-xs">
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah Testimoni
              </Button>
            </CardHeader>
            <CardContent>
              {testimonials.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl">
                  <MessageSquareQuote className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Belum ada testimoni.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {testimonials.map((t) => (
                    <div key={t.id} className="p-5 border rounded-xl bg-card flex flex-col justify-between space-y-4">
                      <p className="text-xs text-muted-foreground italic leading-relaxed">
                        "{t.quote}"
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <div className="text-sm font-semibold">{t.customer_name}</div>
                          <div className="text-xs text-muted-foreground">{t.customer_status}</div>
                        </div>
                        <div className="flex gap-1.5">
                          <Button variant="ghost" size="icon" onClick={() => openEditTestimonial(t)} className="h-8 w-8">
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteTestimonial(t.id)} className="h-8 w-8 text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: FAQ */}
        <TabsContent value="faq">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daftar FAQ (Pertanyaan Umum)</CardTitle>
                <CardDescription>Kelola pertanyaan dan jawaban accordion yang sering ditanyakan pelanggan.</CardDescription>
              </div>
              <Button onClick={openAddFaq} className="btn-gradient-cta !py-2 !px-4 !text-xs">
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah FAQ
              </Button>
            </CardHeader>
            <CardContent>
              {faqs.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-xl">
                  <HelpCircle className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Belum ada FAQ.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {faqs.map((f, i) => (
                    <div key={f.id} className="p-4 border rounded-xl bg-card flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-mono">Q{i + 1}.</span>
                          {f.question}
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                          {f.answer}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => openEditFaq(f)} className="h-8 w-8">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteFaq(f.id)} className="h-8 w-8 text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Modal Testimoni */}
      <Dialog open={testModalOpen} onOpenChange={setTestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTestId ? "Edit Testimoni" : "Tambah Testimoni Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveTestimonial} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold">Nama Pelanggan</label>
              <Input 
                value={testForm.customer_name} 
                onChange={(e) => setTestForm({ ...testForm, customer_name: e.target.value })} 
                placeholder="Andi Saputra" 
                required 
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Status / Label</label>
              <Input 
                value={testForm.customer_status} 
                onChange={(e) => setTestForm({ ...testForm, customer_status: e.target.value })} 
                placeholder="Pelanggan Setia / Pembeli MacBook" 
                required 
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Isi Ulasan / Testimoni</label>
              <Textarea 
                value={testForm.quote} 
                onChange={(e) => setTestForm({ ...testForm, quote: e.target.value })} 
                placeholder="Sudah langganan dari 2018..." 
                rows={3} 
                required 
              />
            </div>
            <div>
              <label className="text-xs font-semibold">URL Foto Avatar (Opsional)</label>
              <Input 
                value={testForm.avatar_path} 
                onChange={(e) => setTestForm({ ...testForm, avatar_path: e.target.value })} 
                placeholder="https://images.unsplash.com/..." 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setTestModalOpen(false)}>Batal</Button>
              <Button type="submit" className="btn-gradient-cta !text-xs">Simpan Testimoni</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal FAQ */}
      <Dialog open={faqModalOpen} onOpenChange={setFaqModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingFaqId ? "Edit Pertanyaan FAQ" : "Tambah FAQ Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveFaq} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold">Pertanyaan</label>
              <Input 
                value={faqForm.question} 
                onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} 
                placeholder="Apakah bisa tukar tambah HP lama?" 
                required 
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Jawaban</label>
              <Textarea 
                value={faqForm.answer} 
                onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} 
                placeholder="Tentu! Kami menerima tukar tambah..." 
                rows={4} 
                required 
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setFaqModalOpen(false)}>Batal</Button>
              <Button type="submit" className="btn-gradient-cta !text-xs">Simpan FAQ</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
