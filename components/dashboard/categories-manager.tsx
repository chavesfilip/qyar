"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, GripVertical, Loader2, Tag } from "lucide-react";
import type { Category } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Nome obrigatório").max(60, "Máximo 60 caracteres"),
});
type FormData = z.infer<typeof schema>;

interface Props {
  restaurantId: string;
  initialCategories: Category[];
}

export function CategoriesManager({ restaurantId, initialCategories }: Props) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const openCreate = () => {
    setEditTarget(null);
    reset({ name: "" });
    setShowDialog(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setValue("name", cat.name);
    setShowDialog(true);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    if (editTarget) {
      const { error } = await supabase
        .from("categories")
        .update({ name: data.name })
        .eq("id", editTarget.id);

      if (error) {
        toast.error("Erro ao atualizar categoria");
      } else {
        setCategories((prev) =>
          prev.map((c) => (c.id === editTarget.id ? { ...c, name: data.name } : c))
        );
        toast.success("Categoria atualizada!");
        setShowDialog(false);
      }
    } else {
      const nextOrder = categories.length + 1;
      const { data: newCat, error } = await supabase
        .from("categories")
        .insert({ restaurant_id: restaurantId, name: data.name, order: nextOrder })
        .select()
        .single();

      if (error) {
        toast.error("Erro ao criar categoria");
      } else {
        setCategories((prev) => [...prev, newCat]);
        toast.success("Categoria criada!");
        setShowDialog(false);
        reset();
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir categoria. Verifique se não há pratos vinculados.");
    } else {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Categoria excluída");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {categories.length} {categories.length === 1 ? "categoria" : "categorias"}
        </p>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" /> Nova categoria
        </Button>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Tag className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">Nenhuma categoria ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie categorias para organizar seus pratos.
            </p>
            <Button onClick={openCreate} size="sm">
              <Plus className="w-4 h-4" /> Criar primeira categoria
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 bg-background rounded-lg border border-border/60 px-4 py-3 hover:border-primary/30 transition-colors"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab" />
              <span className="flex-1 text-sm font-medium">{cat.name}</span>
              <span className="text-xs text-muted-foreground bg-muted rounded px-2 py-0.5">
                #{idx + 1}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                      <AlertDialogDescription>
                        A categoria <strong>&quot;{cat.name}&quot;</strong> será removida permanentemente.
                        Pratos vinculados a ela ficam sem categoria.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(cat.id)}
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
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{editTarget ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Nome da categoria</Label>
              <Input
                id="cat-name"
                placeholder="Ex: Entradas, Pratos Principais..."
                {...register("name")}
                autoFocus
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {editTarget ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
