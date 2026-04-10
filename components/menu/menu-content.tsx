"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Leaf, Sprout, Flame, UtensilsCrossed } from "lucide-react";
import type { Category, Dish } from "@/types";

interface Props {
  categories: Category[];
  dishes: Dish[];
}

export function MenuContent({ categories, dishes }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    categories[0]?.id ?? null
  );
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const dishesByCategory = categories.reduce<Record<string, Dish[]>>((acc, cat) => {
    acc[cat.id] = dishes.filter((d) => d.category_id === cat.id);
    return acc;
  }, {});

  const uncategorized = dishes.filter(
    (d) => !categories.some((c) => c.id === d.category_id)
  );

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = sectionRefs.current[catId];
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(price);

  const hasAnyDishes = dishes.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 pb-12">
      {/* Category nav - sticky */}
      {categories.length > 1 && (
        <div className="sticky top-0 z-20 bg-[#FAFAF8] pt-4 pb-2 -mx-4 px-4 border-b border-border/20 shadow-sm">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-white border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {!hasAnyDishes ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <h2 className="font-display text-xl font-semibold mb-2">Cardápio em breve</h2>
          <p className="text-muted-foreground text-sm">
            Em breve os pratos estarão disponíveis aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-10 mt-8">
          {categories.map((cat) => {
            const catDishes = dishesByCategory[cat.id] || [];
            if (catDishes.length === 0) return null;

            return (
              <section
                key={cat.id}
                ref={(el) => { sectionRefs.current[cat.id] = el; }}
                id={`cat-${cat.id}`}
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                  {cat.name}
                  <span className="h-px flex-1 bg-border/60" />
                </h2>
                <div className="space-y-3">
                  {catDishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} formatPrice={formatPrice} />
                  ))}
                </div>
              </section>
            );
          })}

          {uncategorized.length > 0 && (
            <section>
              <h2 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-3">
                Outros
                <span className="h-px flex-1 bg-border/60" />
              </h2>
              <div className="space-y-3">
                {uncategorized.map((dish) => (
                  <DishCard key={dish.id} dish={dish} formatPrice={formatPrice} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function DishCard({
  dish,
  formatPrice,
}: {
  dish: Dish;
  formatPrice: (price: number) => string;
}) {
  return (
    <div className="flex gap-4 bg-white rounded-2xl border border-border/40 p-4 hover:border-primary/20 hover:shadow-sm transition-all">
      {/* Image */}
      {dish.image_url && (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0">
          <Image
            src={dish.image_url}
            alt={dish.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm sm:text-base text-foreground leading-tight">
              {dish.name}
            </h3>
            <span className="font-display font-bold text-primary text-sm sm:text-base shrink-0">
              {formatPrice(dish.price)}
            </span>
          </div>

          {dish.description && (
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 leading-relaxed line-clamp-2">
              {dish.description}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
          {dish.is_vegetarian && (
            <Badge variant="success" className="text-xs gap-1 px-2 py-0.5">
              <Leaf className="w-3 h-3" /> Vegetariano
            </Badge>
          )}
          {dish.is_vegan && (
            <Badge className="text-xs gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 border-transparent hover:bg-emerald-100">
              <Sprout className="w-3 h-3" /> Vegano
            </Badge>
          )}
          {dish.is_spicy && (
            <Badge className="text-xs gap-1 px-2 py-0.5 bg-red-100 text-red-700 border-transparent hover:bg-red-100">
              <Flame className="w-3 h-3" /> Picante
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
