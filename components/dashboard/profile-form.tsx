"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Upload, Globe } from "lucide-react";
import type { Restaurant } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  description: z.string().max(300, "Máximo 300 caracteres").optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  restaurant: Restaurant;
}

export function ProfileForm({ restaurant }: Props) {
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState(restaurant.logo_url || "");
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description || "",
      address: restaurant.address || "",
      phone: restaurant.phone || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { error } = await supabase
      .from("restaurants")
      .update({
        name: data.name,
        description: data.description,
        address: data.address,
        phone: data.phone,
      })
      .eq("id", restaurant.id);

    if (error) {
      toast.error("Erro ao salvar alterações");
    } else {
      toast.success("Perfil atualizado com sucesso!");
    }
    setLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB");
      return;
    }

    setUploadingLogo(true);
    const ext = file.name.split(".").pop();
    const fileName = `${restaurant.id}/logo.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("restaurant-assets")
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      toast.error("Erro ao fazer upload da logo");
      setUploadingLogo(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("restaurant-assets")
      .getPublicUrl(fileName);

    const newLogoUrl = urlData.publicUrl;
    setLogoUrl(newLogoUrl);

    await supabase
      .from("restaurants")
      .update({ logo_url: newLogoUrl })
      .eq("id", restaurant.id);

    toast.success("Logo atualizada!");
    setUploadingLogo(false);
  };

  return (
    <div className="space-y-6">
      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Logo do restaurante</CardTitle>
          <CardDescription>Aparece no topo do seu cardápio público. JPG ou PNG, máx. 2MB.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={logoUrl} alt={restaurant.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-display text-xl font-bold">
                {restaurant.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <label htmlFor="logo-upload">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploadingLogo}
                  asChild
                  className="cursor-pointer"
                >
                  <span>
                    {uploadingLogo ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    {uploadingLogo ? "Enviando..." : "Alterar logo"}
                  </span>
                </Button>
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
              <p className="text-xs text-muted-foreground mt-1.5">PNG, JPG até 2MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slug info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Link público do cardápio</CardTitle>
          <CardDescription>Este é o endereço único do seu cardápio digital.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 bg-muted rounded-lg p-3">
            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-mono text-muted-foreground">
              {typeof window !== "undefined" ? window.location.origin : ""}/menu/
              <span className="text-foreground font-medium">{restaurant.slug}</span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Info form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informações do restaurante</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome do restaurante *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Uma breve descrição do seu restaurante..."
                rows={3}
                {...register("description")}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <Input id="phone" placeholder="(11) 99999-9999" {...register("phone")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" placeholder="Rua, número, bairro" {...register("address")} />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Salvar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
