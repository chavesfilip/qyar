import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DishForm } from "@/components/dashboard/dish-form";
import { ChevronLeft } from "lucide-react";

export default async function NovoPratoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!restaurant) redirect("/auth/login");

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .order("order", { ascending: true });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/pratos">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Novo prato</h1>
          <p className="text-muted-foreground mt-0.5">Adicione um novo item ao seu cardápio.</p>
        </div>
      </div>

      {categories && categories.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          ⚠️ Você ainda não tem categorias.{" "}
          <Link href="/categorias" className="underline font-medium">
            Crie uma categoria
          </Link>{" "}
          antes de adicionar pratos.
        </div>
      ) : null}

      <DishForm
        restaurantId={restaurant.id}
        categories={categories || []}
      />
    </div>
  );
}
