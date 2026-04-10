import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DishesTable } from "@/components/dashboard/dishes-table";
import { Plus } from "lucide-react";

export default async function PratosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!restaurant) redirect("/auth/login");

  const [{ data: dishes }, { data: categories }] = await Promise.all([
    supabase
      .from("dishes")
      .select("*, categories(name)")
      .eq("restaurant_id", restaurant.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("order", { ascending: true }),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Pratos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os itens do seu cardápio.
          </p>
        </div>
        <Button asChild>
          <Link href="/pratos/novo">
            <Plus className="w-4 h-4" /> Novo prato
          </Link>
        </Button>
      </div>

      <DishesTable
        dishes={dishes || []}
        categories={categories || []}
        restaurantId={restaurant.id}
      />
    </div>
  );
}
