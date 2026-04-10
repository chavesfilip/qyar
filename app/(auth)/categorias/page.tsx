import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CategoriesManager } from "@/components/dashboard/categories-manager";

export default async function CategoriasPage() {
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
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Categorias</h1>
        <p className="text-muted-foreground mt-1">
          Organize seus pratos por seções como Entradas, Pratos Principais, Sobremesas, etc.
        </p>
      </div>
      <CategoriesManager
        restaurantId={restaurant.id}
        initialCategories={categories || []}
      />
    </div>
  );
}
