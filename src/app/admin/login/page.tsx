// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchApi } from "@/lib/api";
import { setToken } from "@/lib/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, ShoppingBag, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email({ message: "Email tidak valid." }),
  password: z.string().min(1, { message: "Password wajib diisi." }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response = await fetchApi("/login", {
        method: "POST",
        body: JSON.stringify(values),
      });

      setToken(response.token);
      toast.success("Login berhasil", {
        description: `Selamat datang, ${response.user.name}!`,
      });
      
      // Navigate to dashboard
      window.location.href = "/admin/dashboard";
    } catch (error: any) {
      toast.error("Gagal Login", {
        description: error.message || "Email atau password salah.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr] bg-[var(--bg-page)] text-[var(--text-heading)]">
      
      {/* Left Pane - Form Card */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-16">
        <div>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-medium text-[var(--body-text)] hover:text-[var(--red)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Website</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-12 space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--red-soft)] text-[var(--red)] text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Portal Terproteksi</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-heading)]">
              Login Admin
            </h1>
            <p className="text-sm text-[var(--body-text)] font-light leading-relaxed">
              Masukkan kredensial akun administrator Anda untuk mengelola inventaris, banner, dan pengaturan Yuni Counter.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[var(--text-heading)]">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="admin@yunicounter.com"
                          type="email"
                          autoComplete="email"
                          className="bg-[var(--search-bg)] border-[var(--border)] h-11 text-sm focus:border-[var(--red)] focus:ring-[var(--red-soft)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-[var(--red)]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold uppercase tracking-wider text-[var(--text-heading)]">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          autoComplete="current-password"
                          className="bg-[var(--search-bg)] border-[var(--border)] h-11 text-sm focus:border-[var(--red)] focus:ring-[var(--red-soft)]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-[var(--red)]" />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-gradient-cta w-full !py-3 !text-sm mt-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memverifikasi...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Masuk ke Dashboard</span>
                    </>
                  )}
                </button>
              </form>
            </Form>
          </div>

          <div className="text-center">
            <p className="text-xs text-[var(--body-text)] font-light">
              Default akses demo: <span className="font-medium text-[var(--text-heading)]">admin@yunicounter.com</span> / <span className="font-medium text-[var(--text-heading)]">password</span>
            </p>
          </div>
        </div>

        <div className="text-xs text-[var(--body-text)] font-light text-center lg:text-left">
          &copy; {new Date().getFullYear()} Yuni Counter Management System.
        </div>
      </div>

      {/* Right Pane - Visual Branding Display */}
      <div className="hidden lg:relative lg:flex flex-col justify-between p-12 bg-[#0E1015] text-white border-l border-white/10 overflow-hidden">
        {/* Background glow and image */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(227,48,56,0.25)_0%,transparent_60%)] pointer-events-none z-0"></div>
        <Image
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80"
          alt="Tech Pattern"
          fill
          className="object-cover opacity-20 grayscale contrast-125 pointer-events-none"
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--red)] text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-600/30">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold text-white leading-tight">Yuni Counter</h3>
            <span className="text-[10px] tracking-[2px] font-semibold text-[var(--red-light)] uppercase">Taichung, Taiwan</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md my-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[2px] text-[var(--red-light)]">Administrator Control</span>
          <h2 className="font-heading text-3xl font-extrabold leading-tight text-white">
            Kelola Stok, Harga & Promosi dengan Cepat.
          </h2>
          <p className="text-sm text-white/70 font-light leading-relaxed">
            Sistem terintegrasi untuk mengelola dua cabang toko di First Square Lantai 3 (Room 281 & Room 330), sinkronisasi kurs NT$ ke Rupiah, serta pengaturan katalog publik secara realtime.
          </p>
        </div>

        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-light">
          <span>First Square Lt. 3 Room 281 & 330</span>
          <span>Versi 2.0</span>
        </div>
      </div>

    </div>
  );
}
