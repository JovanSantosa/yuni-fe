"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  Tags,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/kategori", label: "Kategori", icon: Tags },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
  { href: "/admin/profil", label: "Profil Akun", icon: User },
];

export function Sidebar({ onItemClick }: { onItemClick?: () => void } = {}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      <div className="p-6">
        <Link 
          href="/" 
          onClick={onItemClick}
          className="flex items-center gap-2 text-sidebar-foreground transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Yuni Counter</span>
        </Link>
      </div>
      <div className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={onItemClick}
              className={cn(
              "flex w-full justify-start items-center gap-3 h-10 px-4 rounded-md transition-colors",
              isActive 
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
