"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";
import {
  Pencil, Trash2, Plus, UtensilsCrossed,
  Leaf, Flame, Sprout
} from "lucide-react";
import type { Dish, Category } from "@/types";

interface DishWithCategory extends Dish {
  categories?: { name: string } | null;
}

interface Props {
  dishes: DishWithCategory[];
  categories: Category[];
  restaurantId: string;
}

export function DishesTable({ dishes: initialDishes, categories }: Props) {
  const [dishes, setDishes] = useState(initialDishes);
  const supabase = createClient();

  const handleToggleAvailable = async (dish: DishWithCategory) => {
    const newValue = !dish.is_available;
    setDishes((prev) =>
      prev.map((d) => (d.id === dish.id ? { ...d, is_available: newValue } : d))
    );
    const { error } = await supabase
      .from("dishes")
      .update({ is_available: newValue })
      .eq("id", dish.id);

    if (error) {
      setDishes((prev) =>
        prev.map((d) => (d.id === dish.id ? { ...d, is_available: !newValue } : d))
      );
      toast.error("Erro ao atualizar disponibilidade");
    } else {
      toast.success(newValue ? "Prato ativado" : "Prato desativado");
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("dishes").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir prato");
    } else {
      setDishes((prev) => prev.filter((d) => d.id !== id));
      toast.success("Prato excluído");
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(price);

  if (dishes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-1">Nenhum prato ainda</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Adicione seu primeiro prato ao cardápio.
          </p>
          <Button asChild size="sm">
            <Link href="/pratos/novo">
              <Plus className="w-4 h-4" /> Adicionar prato
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {dishes.map((dish) => (
        <div
          key={dish.id}
          className={`flex items-center gap-4 bg-background rounded-xl border px-4 py-3 transition-all ${
            dish.is_available ? "border-border/60" : "border-border/30 opacity-60"
          }`}
        >
          {/* Image */}
          <div className="h-12 w-12 rounded-lg bg-muted shrink-0 overflow-hidden">
            {dish.image_url ? (
              <Image
                src={dish.image_url}
                alt={dish.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm truncate">{dish.name}</span>
              <div className="flex items-center gap-1">
                {dish.is_vegetarian && (
                  <span title="Vegetariano" className="text-green-600">
                    <Leaf className="w-3.5 h-3.5" />
                  </span>
                )}
                {dish.is_vegan && (
                  <span title="Vegano" className="text-emerald-600">
                    <Sprout className="w-3.5 h-3.5" />
                  </span>
                )}
                {dish.is_spicy && (
                  <span title="Picante" className="text-red-500">
                    <Flame className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold text-primary">
                {formatPrice(dish.price)}
              </span>
              {dish.categories && (
                <Badge variant="secondary" className="text-xs h-4 px-1.5">
                  {dish.categories.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Switch
              checked={dish.is_available}
              onCheckedChange={() => handleToggleAvailable(dish)}
              aria-label="Disponível"
            />
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
              <Link href={`/pratos/editar/${dish.id}`}>
                <Pencil className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir prato?</AlertDialogTitle>
                  <AlertDialogDescription>
                    O prato <strong>&quot;{dish.name}&quot;</strong> será removido permanentemente do cardápio.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(dish.id)}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
