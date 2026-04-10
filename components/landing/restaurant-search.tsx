"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  description?: string | null;
}

interface Props {
  restaurants: Restaurant[];
}

export function RestaurantSearch({ restaurants }: Props) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const q = query.toLowerCase().trim();
    const cards = document.querySelectorAll<HTMLElement>(".restaurant-card");
    let visibleCount = 0;

    cards.forEach((card) => {
      const name = card.dataset.name || "";
      const match = q === "" || name.includes(q);
      card.style.display = match ? "" : "none";
      if (match) visibleCount++;
    });

    // Update count label
    const label = document.getElementById("restaurant-count-label");
    if (label) {
      if (q === "") {
        label.textContent = `${restaurants.length} ${restaurants.length === 1 ? "restaurante registado" : "restaurantes registados"}`;
      } else {
        label.textContent = visibleCount === 0
          ? `Nenhum restaurante encontrado para "${query}"`
          : `${visibleCount} resultado${visibleCount !== 1 ? "s" : ""} para "${query}"`;
      }
    }
  }, [query, restaurants.length]);

  return (
    <div className="relative max-w-sm mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar restaurante..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Limpar pesquisa"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
