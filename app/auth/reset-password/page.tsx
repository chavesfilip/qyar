import Link from "next/link";
import { QrCode } from "lucide-react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2 justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <span className="font-display text-xl font-bold">Qyar</span>
        </div>
        <div className="mb-6 text-center">
          <h1 className="font-display text-2xl font-bold mb-1">Recuperar senha</h1>
          <p className="text-muted-foreground text-sm">
            Informe seu email e enviaremos um link para redefinir sua senha.
          </p>
        </div>
        <ResetPasswordForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Lembrou a senha?{" "}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
