import { QrCode } from "lucide-react";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export default function UpdatePasswordPage() {
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
          <h1 className="font-display text-2xl font-bold mb-1">Nova senha</h1>
          <p className="text-muted-foreground text-sm">
            Escolha uma nova senha para sua conta.
          </p>
        </div>
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
