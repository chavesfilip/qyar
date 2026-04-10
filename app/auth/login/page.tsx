import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { QrCode } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-foreground text-background flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold text-background">Qyar</span>
        </div>
        <div>
          <blockquote className="font-display text-3xl font-light leading-relaxed text-background/90 mb-6">
            &ldquo;O cardápio digital que os nossos clientes adoraram. Simples de configurar e lindo de ver.&rdquo;
          </blockquote>
          <p className="text-background/60 text-sm">— Chef Marco Aurélio, Restaurante Boa Mesa</p>
        </div>
        <div className="text-background/40 text-xs">
          © {new Date().getFullYear()} Qyar
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden flex items-center gap-2 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl font-bold">Qyar</span>
          </div>
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold mb-1">Bem-vindo de volta</h1>
            <p className="text-muted-foreground text-sm">Entre na sua conta para gerenciar seu cardápio.</p>
          </div>
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link href="/auth/register" className="text-primary font-medium hover:underline">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
