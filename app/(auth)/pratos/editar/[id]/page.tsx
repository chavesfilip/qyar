import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DishForm } from "@/components/dashboard/dish-form";
import { ChevronLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarPratoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!restaurant) redirect("/auth/login");

  const [{ data: dish }, { data: categories }] = await Promise.all([
    supabase.from("dishes").select("*").eq("id", id).eq("restaurant_id", restaurant.id).single(),
    supabase.from("categories").select("*").eq("restaurant_id", restaurant.id).order("order", { ascending: true }),
  ]);

  if (!dish) notFound();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/pratos">
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Editar prato</h1>
          <p className="text-muted-foreground mt-0.5">{dish.name}</p>
        </div>
      </div>
      <DishForm
        restaurantId={restaurant.id}
        categories={categories || []}
        dish={dish}
      />
    </div>
  );
}
