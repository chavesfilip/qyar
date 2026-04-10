import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  UtensilsCrossed, Tag, QrCode, ExternalLink,
  ArrowRight, TrendingUp, Eye
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!restaurant) redirect("/auth/login");

  const [{ count: dishCount }, { count: categoryCount }] = await Promise.all([
    supabase.from("dishes").select("*", { count: "exact", head: true }).eq("restaurant_id", restaurant.id),
    supabase.from("categories").select("*", { count: "exact", head: true }).eq("restaurant_id", restaurant.id),
  ]);

  const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/menu/${restaurant.slug}`;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">
            Olá, {restaurant.name} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Aqui está um resumo do seu cardápio digital.</p>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <a href={`/menu/${restaurant.slug}`} target="_blank" rel="noopener noreferrer">
            <Eye className="w-4 h-4" />
            Ver cardápio
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" /> Pratos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold">{dishCount ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" /> Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-bold">{categoryCount ?? 0}</p>
            <p className="text-xs text-muted-foreground mt-1">criadas</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="font-semibold text-green-700">Cardápio ativo</p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">público e acessível</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Ações rápidas</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              href: "/pratos/novo",
              icon: UtensilsCrossed,
              title: "Adicionar prato",
              desc: "Cadastre um novo item no seu cardápio",
              color: "text-orange-600 bg-orange-50",
            },
            {
              href: "/categorias",
              icon: Tag,
              title: "Gerenciar categorias",
              desc: "Organize seus pratos por seções",
              color: "text-blue-600 bg-blue-50",
            },
            {
              href: "/dashboard/qr-code",
              icon: QrCode,
              title: "Baixar QR Code",
              desc: "Imprima e disponibilize nas mesas",
              color: "text-purple-600 bg-purple-50",
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border/60 hover:border-primary/40 hover:shadow-sm transition-all group"
            >
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", action.color)}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{action.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all ml-auto mt-0.5 shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Menu link */}
      <Card className="bg-primary text-white border-0">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-display font-bold text-lg">Link do seu cardápio</p>
            <p className="text-white/80 text-sm mt-0.5 break-all">{menuUrl}</p>
          </div>
          <Button variant="secondary" size="sm" className="shrink-0" asChild>
            <a href={`/menu/${restaurant.slug}`} target="_blank" rel="noopener noreferrer">
              Abrir <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
