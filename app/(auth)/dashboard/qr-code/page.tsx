import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QrCodeDisplay } from "@/components/dashboard/qrcode-display";

export default async function QrCodePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!restaurant) redirect("/auth/login");

  const menuUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://qyar.vercel.app"}/menu/${restaurant.slug}`;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">QR Code</h1>
        <p className="text-muted-foreground mt-1">
          Imprima e disponibilize nas mesas para seus clientes acessarem o cardápio.
        </p>
      </div>
      <QrCodeDisplay menuUrl={menuUrl} restaurantName={restaurant.name} slug={restaurant.slug} />
    </div>
  );
}
