"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  LayoutDashboard, UtensilsCrossed, Tag, QrCode,
  LogOut, Menu, X, ExternalLink, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Restaurant } from "@/types";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/pratos", label: "Pratos", icon: UtensilsCrossed },
  { href: "/categorias", label: "Categorias", icon: Tag },
  { href: "/dashboard/qr-code", label: "QR Code", icon: QrCode },
  { href: "/dashboard/perfil", label: "Perfil", icon: User },
];

interface Props {
  restaurant: Restaurant;
  user: SupabaseUser;
}

export function DashboardSidebar({ restaurant, user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Até logo!");
    router.push("/auth/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold">Qyar</span>
        </div>
      </div>

      {/* Restaurant info */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={restaurant.logo_url} alt={restaurant.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {restaurant.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{restaurant.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              isActive(item.href, item.exact)
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <a
          href={`/menu/${restaurant.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          Ver cardápio público
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col bg-background border-r border-border/50 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b border-border/50 z-40 flex items-center px-4 gap-3">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <QrCode className="w-3 h-3 text-white" />
          </div>
          <span className="font-display font-bold text-base">Qyar</span>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="relative w-72 bg-background flex flex-col h-full shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Mobile top padding */}
      <div className="lg:hidden h-14" />
    </>
  );
}
