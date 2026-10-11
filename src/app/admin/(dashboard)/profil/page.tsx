"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { User, Mail, Shield, KeyRound, Loader2, CheckCircle2 } from "lucide-react";

interface UserData {
  user: { id: number; name: string; email: string };
}

export default function ProfilPage() {
  const { data: userData, isLoading } = useSWR<UserData>(
    "/user",
    (url: string) => fetchApi(url, { requireAuth: true })
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (userData?.user) {
      setName(userData.user.name || "Administrator");
      setEmail(userData.user.email || "admin@yunicounter.com");
    }
  }, [userData]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error("Password baru wajib diisi");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok");
      return;
    }

    setIsUpdating(true);
    try {
      await fetchApi("/profile/password", {
        method: "PUT",
        requireAuth: true,
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      toast.success("Password berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal memperbarui password";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil Admin</h1>
        <p className="text-sm text-muted-foreground">
          Kelola informasi akun dan kredensial akses administrator Anda.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Info Akun */}
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Informasi Akun</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Detail identitas dan role yang terdaftar dalam sistem.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="admin-name" className="text-sm font-medium">Nama Lengkap</label>
              <input
                id="admin-name"
                value={name}
                readOnly
                className="flex h-9 w-full rounded-lg border border-input bg-muted/50 px-3 py-1 text-sm shadow-sm cursor-default opacity-70"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-medium">Alamat Email</label>
              <div className="relative">
                <input
                  id="admin-email"
                  value={email}
                  readOnly
                  className="flex h-9 w-full rounded-lg border border-input bg-muted/50 px-3 py-1 pr-10 text-sm shadow-sm cursor-default opacity-70"
                />
                <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Role: Super Administrator (Full Access)</span>
            </div>
          </div>
        </div>

        {/* Ganti Password */}
        <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm ring-1 ring-foreground/10">
          <div className="flex items-center gap-2 mb-1">
            <KeyRound className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Keamanan &amp; Password</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Perbarui kata sandi login secara berkala untuk menjaga keamanan.
          </p>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="current-pw" className="text-sm font-medium">Password Saat Ini</label>
              <input
                id="current-pw"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="new-pw" className="text-sm font-medium">Password Baru</label>
              <input
                id="new-pw"
                type="password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm-pw" className="text-sm font-medium">Konfirmasi Password Baru</label>
              <input
                id="confirm-pw"
                type="password"
                placeholder="Ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Simpan Perubahan Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
