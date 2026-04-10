import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MenuHeader } from "@/components/menu/menu-header";
import { MenuContent } from "@/components/menu/menu-content";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, description, logo_url")
    .eq("slug", slug)
    .single();

  if (!restaurant) return { title: "Cardápio não encontrado" };

  return {
    title: `${restaurant.name} — Cardápio Digital`,
    description: restaurant.description || `Veja o cardápio completo de ${restaurant.name}`,
    openGraph: {
      title: `${restaurant.name} — Cardápio`,
      description: restaurant.description || `Cardápio digital de ${restaurant.name}`,
      images: restaurant.logo_url ? [restaurant.logo_url] : [],
    },
  };
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!restaurant) notFound();

  const [{ data: categories }, { data: dishes }] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("order", { ascending: true }),
    supabase
      .from("dishes")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .eq("is_available", true)
      .order("name", { ascending: true }),
  ]);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <MenuHeader restaurant={restaurant} />
      <MenuContent
        categories={categories || []}
        dishes={dishes || []}
      />
      {/* Footer */}
      <footer className="mt-16 border-t border-border/30 py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Cardápio digital criado com{" "}
          <a
            href="/"
            className="font-semibold text-primary hover:underline"
          >
            Qyar
          </a>
        </p>
      </footer>
    </div>
  );
}
