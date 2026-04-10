import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-6">
        <QrCode className="w-6 h-6 text-white" />
      </div>
      <h1 className="font-display text-5xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground mb-6">
        Página ou cardápio não encontrado.
      </p>
      <Button asChild>
        <Link href="/">Voltar ao início</Link>
      </Button>
    </div>
  );
}
