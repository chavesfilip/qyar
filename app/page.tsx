import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { QrCode, Utensils, Smartphone, ArrowRight, Check, Star, Zap, Crown } from "lucide-react";
import { RestaurantSearch } from "@/components/landing/restaurant-search";

async function getRestaurants() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("restaurants")
    .select("id, name, slug, logo_url, description")
    .order("created_at", { ascending: false })
    .limit(16);
  return data || [];
}

const plans = [
  {
    id: "free",
    name: "Grátis",
    price: null,
    label: "Para começar",
    icon: Star,
    border: "border-border",
    headerBg: "bg-muted/60",
    headerText: "text-foreground",
    badge: null,
    features: [
      { text: "1 restaurante", included: true },
      { text: "Até 50 itens no menu", included: true },
      { text: "QR Code simples", included: true },
      { text: "Suporte via FAQ / email", included: true },
      { text: "1 atualização por semana", included: true },
      { text: "QR Code com logo personalizado", included: false },
      { text: "Analytics", included: false },
      { text: "Remoção da marca Qyar", included: false },
    ],
    cta: "Começar grátis",
    ctaHref: "/auth/register",
    ctaVariant: "outline" as const,
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "5.500",
    label: "Maioria dos restaurantes",
    icon: Zap,
    border: "border-primary",
    headerBg: "bg-primary",
    headerText: "text-white",
    badge: "Mais popular",
    features: [
      { text: "Tudo do Grátis", included: true },
      { text: "QR Code com logo + cores personalizadas", included: true },
      { text: "Analytics básicos (scans, itens vistos)", included: true },
      { text: "Remoção da marca Qyar", included: true },
      { text: "Até 200 itens no menu", included: true },
      { text: "Atualizações ilimitadas", included: true },
      { text: "Suporte prioritário (resposta em 24h)", included: true },
      { text: "Múltiplos restaurantes", included: false },
    ],
    cta: "Assinar Pro",
    ctaHref: "/auth/register?plan=pro",
    ctaVariant: "default" as const,
    highlight: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "9.999",
    label: "Redes, hotéis e franquias",
    icon: Crown,
    border: "border-amber-400",
    headerBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    headerText: "text-white",
    badge: "Completo",
    features: [
      { text: "Tudo do Pro", included: true },
      { text: "Até 5 restaurantes / filiais", included: true },
      { text: "Integração com WhatsApp", included: true },
      { text: "Integração com Vendus", included: true },
      { text: "Relatórios avançados + exportação", included: true },
      { text: "Domínio próprio (.ao)", included: true },
      { text: "Prioridade em novas funcionalidades", included: true },
      { text: "Suporte dedicado", included: true },
    ],
    cta: "Assinar Premium",
    ctaHref: "/auth/register?plan=premium",
    ctaVariant: "default" as const,
    highlight: false,
  },
];

export default async function Home() {
  const restaurants = await getRestaurants();

  return (
    <div className="min-h-screen bg-background">

      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold">Qyar</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <a href="#planos" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">Planos</a>
            <a href="#restaurantes" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground transition-colors">Restaurantes</a>
            <Button variant="ghost" size="sm" asChild><Link href="/auth/login">Entrar</Link></Button>
            <Button size="sm" asChild><Link href="/auth/register">Começar grátis</Link></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Cardápio digital para restaurantes angolanos
        </div>
        <h1 className="font-display text-5xl sm:text-7xl font-bold leading-tight mb-6">
          Seu cardápio,
          <br />
          <span className="text-primary">um QR Code</span> de distância
        </h1>
        <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Crie um cardápio digital elegante em minutos. Os seus clientes escaneiam o QR Code
          e visualizam tudo — sem instalar nenhuma aplicação.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="text-base px-8 h-12">
            <Link href="/auth/register">
              Criar o meu cardápio grátis <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8 h-12">
            <a href="#planos">Ver planos</a>
          </Button>
        </div>

        {restaurants.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex -space-x-2">
              {restaurants.slice(0, 5).map((r) => (
                <div key={r.id} className="w-7 h-7 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                  {r.logo_url
                    ? <Image src={r.logo_url} alt={r.name} width={28} height={28} className="object-cover w-full h-full" />
                    : r.name.charAt(0).toUpperCase()
                  }
                </div>
              ))}
            </div>
            <span>
              <strong className="text-foreground">{restaurants.length}</strong>{" "}
              {restaurants.length === 1 ? "restaurante já usa o Qyar" : "restaurantes já usam o Qyar"}
            </span>
          </div>
        )}
      </section>

      {/* Features */}
      <section className="bg-secondary/40 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4">Tudo o que precisa</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Ferramentas simples e poderosas para modernizar o atendimento do seu restaurante.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Utensils, title: "Gerencie os seus pratos", desc: "Adicione fotos, preços em AOA, descrições e categorias. Ative ou desative itens a qualquer hora." },
              { icon: QrCode, title: "QR Code exclusivo", desc: "Gere e baixe o QR Code para imprimir em mesas, cardápios físicos e materiais de marketing." },
              { icon: Smartphone, title: "Mobile-first", desc: "Cardápio otimizado para telemóvel. Os seus clientes veem tudo sem instalar nenhuma aplicação." },
            ].map((f) => (
              <div key={f.title} className="bg-background rounded-xl p-6 border border-border/60 hover:border-primary/30 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">Planos e preços</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Comece grátis e faça upgrade quando precisar. Todos os preços em Kwanzas angolanos (AOA).
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl border-2 overflow-hidden flex flex-col ${plan.border} ${plan.highlight ? "shadow-xl shadow-primary/15 sm:-mt-3" : ""}`}
              >
                {/* Header */}
                <div className={`px-6 py-5 ${plan.headerBg}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <plan.icon className={`w-5 h-5 ${plan.headerText}`} />
                      <span className={`font-display text-xl font-bold ${plan.headerText}`}>{plan.name}</span>
                    </div>
                    {plan.badge && (
                      <span className="text-xs font-semibold bg-white/25 text-white rounded-full px-2.5 py-1">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 ${plan.id === "free" ? "text-muted-foreground" : "text-white/70"}`}>
                    {plan.label}
                  </p>
                </div>

                {/* Price */}
                <div className="px-6 py-5 border-b border-border/40">
                  {plan.price ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm font-medium">AOA/mês</span>
                    </div>
                  ) : (
                    <span className="font-display text-4xl font-bold">Grátis</span>
                  )}
                </div>

                {/* Features */}
                <div className="px-6 py-5 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <div key={f.text} className={`flex items-start gap-2.5 text-sm ${f.included ? "" : "opacity-35"}`}>
                      {f.included
                        ? <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        : <span className="w-4 h-4 mt-0.5 shrink-0 text-center text-muted-foreground leading-4">—</span>
                      }
                      <span className={f.included ? "text-muted-foreground" : "text-muted-foreground line-through"}>
                        {f.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="px-6 pb-6 pt-2">
                  <Button className="w-full" variant={plan.ctaVariant} size="lg" asChild>
                    <Link href={plan.ctaHref}>
                      {plan.cta} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Todos os planos incluem SSL gratuito, backups automáticos e actualizações da plataforma.
            Pagamento mensal sem fidelização.
          </p>
        </div>
      </section>

      {/* Restaurants directory */}
      <section id="restaurantes" className="bg-secondary/40 py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Restaurantes no Qyar
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Clique em qualquer restaurante para ver o cardápio digital. O seu pode ser o próximo!
            </p>
            <RestaurantSearch restaurants={restaurants} />
          </div>

          {restaurants.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-6 h-6 text-muted-foreground/40" />
              </div>
              <p className="text-muted-foreground mb-4">Seja o primeiro a criar o seu cardápio digital!</p>
              <Button asChild><Link href="/auth/register">Criar agora <ArrowRight className="w-4 h-4" /></Link></Button>
            </div>
          ) : (
            <>
              <div id="restaurant-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {restaurants.map((r, i) => (
                  <Link
                    key={r.id}
                    href={`/menu/${r.slug}`}
                    data-name={r.name.toLowerCase()}
                    className="restaurant-card group bg-background rounded-2xl border border-border/60 p-5 flex flex-col items-center text-center gap-3 hover:border-primary/40 hover:shadow-md transition-all"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/10 border-2 border-border/40 group-hover:border-primary/40 transition-colors flex items-center justify-center shrink-0">
                      {r.logo_url ? (
                        <Image src={r.logo_url} alt={r.name} width={64} height={64} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display text-2xl font-bold text-primary">
                          {r.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 w-full">
                      <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                        {r.name}
                      </p>
                      {r.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{r.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-primary/60 group-hover:text-primary font-medium transition-colors flex items-center gap-1">
                      Ver cardápio <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                ))}
              </div>
              <p id="restaurant-count-label" className="text-center text-sm text-muted-foreground mt-8">
                {restaurants.length} {restaurants.length === 1 ? "restaurante registado" : "restaurantes registados"}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
        <h2 className="font-display text-3xl sm:text-5xl font-bold mb-6">
          Pronto para modernizar<br />o seu restaurante?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          {["Grátis para começar", "Sem cartão de crédito", "Configuração em minutos"].map((t) => (
            <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="w-4 h-4 text-primary" />{t}
            </div>
          ))}
        </div>
        <Button size="lg" asChild className="text-base px-10 h-12">
          <Link href="/auth/register">Criar conta grátis <ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <QrCode className="w-3 h-3 text-white" />
            </div>
            <span className="font-display font-semibold text-foreground">Qyar</span>
            <span className="opacity-40">·</span>
            <span className="opacity-60">by itprati</span>
          </div>
          <nav className="flex items-center gap-5">
            <a href="#planos" className="hover:text-foreground transition-colors">Planos</a>
            <a href="#restaurantes" className="hover:text-foreground transition-colors">Restaurantes</a>
            <Link href="/auth/login" className="hover:text-foreground transition-colors">Login</Link>
          </nav>
          <p>© {new Date().getFullYear()} Qyar · itprati</p>
        </div>
      </footer>
    </div>
  );
}
