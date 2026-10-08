"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchApi, swrFetcher } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield, KeyRound, Loader2, CheckCircle2 } from "lucide-react";

export default function ProfilPage() {
  const { data: userData, isLoading } = useSWR<{ user: { id: number; name: string; email: string } }>(
    "/user",
    swrFetcher
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
      await fetchApi("/admin/profile/password", {
        method: "PUT",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      toast.success("Password berhasil diperbarui!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui password");
    } finally {
      setIsUpdating(false);
    }
  };

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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Informasi Akun</CardTitle>
            </div>
            <CardDescription>
              Detail identitas dan role yang terdaftar dalam sistem.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Nama Lengkap</Label>
              <Input
                id="admin-name"
                value={name}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Alamat Email</Label>
              <div className="relative">
                <Input
                  id="admin-email"
                  value={email}
                  disabled
                  className="bg-muted/50 pr-10"
                />
                <Mail className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Role: Super Administrator (Full Access)</span>
            </div>
          </CardContent>
        </Card>

        {/* Ganti Password */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <CardTitle>Keamanan & Password</CardTitle>
            </div>
            <CardDescription>
              Perbarui kata sandi login secara berkala untuk menjaga keamanan.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-pw">Password Saat Ini</Label>
                <Input
                  id="current-pw"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pw">Password Baru</Label>
                <Input
                  id="new-pw"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-pw">Konfirmasi Password Baru</Label>
                <Input
                  id="confirm-pw"
                  type="password"
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={isUpdating} className="w-full">
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
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
