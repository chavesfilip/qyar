import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!restaurant) redirect("/auth/login");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">Perfil do restaurante</h1>
        <p className="text-muted-foreground mt-1">
          Essas informações aparecem no seu cardápio público.
        </p>
      </div>
      <ProfileForm restaurant={restaurant} />
    </div>
  );
}
