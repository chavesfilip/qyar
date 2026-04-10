"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, ImageIcon, Leaf, Sprout, Flame } from "lucide-react";
import type { Dish, Category } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, "Preço deve ser maior que zero"),
  category_id: z.string().min(1, "Selecione uma categoria"),
  is_available: z.boolean(),
  is_vegetarian: z.boolean(),
  is_vegan: z.boolean(),
  is_spicy: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  restaurantId: string;
  categories: Category[];
  dish?: Dish;
}

export function DishForm({ restaurantId, categories, dish }: Props) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(dish?.image_url || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: dish?.name || "",
      description: dish?.description || "",
      price: dish?.price || 0,
      category_id: dish?.category_id || "",
      is_available: dish?.is_available ?? true,
      is_vegetarian: dish?.is_vegetarian ?? false,
      is_vegan: dish?.is_vegan ?? false,
      is_spicy: dish?.is_spicy ?? false,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Imagem deve ter no máximo 3MB");
      return;
    }
    setUploadingImage(true);
    const ext = file.name.split(".").pop();
    const fileName = `${restaurantId}/dishes/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("restaurant-assets")
      .upload(fileName, file, { upsert: true });

    if (error) {
      toast.error("Erro ao fazer upload da imagem");
    } else {
      const { data: urlData } = supabase.storage
        .from("restaurant-assets")
        .getPublicUrl(fileName);
      setImageUrl(urlData.publicUrl);
      toast.success("Imagem carregada!");
    }
    setUploadingImage(false);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const payload = { ...data, image_url: imageUrl || null, restaurant_id: restaurantId };

    let error;
    if (dish) {
      ({ error } = await supabase.from("dishes").update(payload).eq("id", dish.id));
    } else {
      ({ error } = await supabase.from("dishes").insert(payload));
    }

    if (error) {
      toast.error("Erro ao salvar prato");
    } else {
      toast.success(dish ? "Prato atualizado!" : "Prato criado!");
      router.push("/pratos");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informações do prato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Nome *</Label>
                <Input id="name" placeholder="Ex: Frango Grelhado" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Ingredientes, modo de preparo, acompanhamentos..."
                  rows={3}
                  {...register("description")}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Preço (AOA) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="5000"
                    {...register("price")}
                  />
                  {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label>Categoria *</Label>
                  <Controller
                    name="category_id"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.category_id && <p className="text-xs text-destructive">{errors.category_id.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tags & Disponibilidade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "is_available" as const, label: "Disponível no cardápio", icon: null, desc: "Exibe o prato para os clientes" },
                { name: "is_vegetarian" as const, label: "Vegetariano", icon: <Leaf className="w-4 h-4 text-green-600" />, desc: "Não contém carne" },
                { name: "is_vegan" as const, label: "Vegano", icon: <Sprout className="w-4 h-4 text-emerald-600" />, desc: "Sem produtos de origem animal" },
                { name: "is_spicy" as const, label: "Picante", icon: <Flame className="w-4 h-4 text-red-500" />, desc: "Contém ingredientes apimentados" },
              ].map((field) => (
                <Controller
                  key={field.name}
                  name={field.name}
                  control={control}
                  render={({ field: f }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {field.icon}
                        <div>
                          <p className="text-sm font-medium">{field.label}</p>
                          <p className="text-xs text-muted-foreground">{field.desc}</p>
                        </div>
                      </div>
                      <Switch
                        checked={f.value as boolean}
                        onCheckedChange={f.onChange}
                      />
                    </div>
                  )}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Image sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Foto do prato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="aspect-square rounded-lg bg-muted overflow-hidden border border-border/60">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Prévia"
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <span className="text-xs">Sem imagem</span>
                  </div>
                )}
              </div>

              <label htmlFor="dish-image">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full cursor-pointer"
                  disabled={uploadingImage}
                  asChild
                >
                  <span>
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploadingImage ? "Enviando..." : "Escolher imagem"}
                  </span>
                </Button>
              </label>
              <input
                id="dish-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <p className="text-xs text-muted-foreground text-center">JPG, PNG até 3MB</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-border/50 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/pratos")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {dish ? "Salvar alterações" : "Criar prato"}
        </Button>
      </div>
    </form>
  );
}
