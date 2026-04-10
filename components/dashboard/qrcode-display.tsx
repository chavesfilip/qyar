"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Copy, ExternalLink, QrCode, Check } from "lucide-react";

interface Props {
  menuUrl: string;
  restaurantName: string;
  slug: string;
}

export function QrCodeDisplay({ menuUrl, restaurantName, slug }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, menuUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: "#1a1a1a",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
    }
  }, [menuUrl]);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a new canvas with padding and restaurant name
    const finalCanvas = document.createElement("canvas");
    const ctx = finalCanvas.getContext("2d");
    if (!ctx) return;

    const padding = 40;
    const labelHeight = 60;
    finalCanvas.width = canvas.width + padding * 2;
    finalCanvas.height = canvas.height + padding * 2 + labelHeight;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

    // QR code
    ctx.drawImage(canvas, padding, padding);

    // Restaurant name
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 18px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(
      restaurantName,
      finalCanvas.width / 2,
      canvas.height + padding + 30
    );

    ctx.font = "13px sans-serif";
    ctx.fillStyle = "#888";
    ctx.fillText("Acesse nosso cardápio", finalCanvas.width / 2, canvas.height + padding + 52);

    const url = finalCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `qrcode-${slug}.png`;
    link.href = url;
    link.click();
    toast.success("QR Code baixado!");
  };

  const handleDownloadSVG = async () => {
    const svgString = await QRCode.toString(menuUrl, {
      type: "svg",
      margin: 2,
      color: { dark: "#1a1a1a", light: "#ffffff" },
    });
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `qrcode-${slug}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("QR Code SVG baixado!");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* QR Code preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <QrCode className="w-4 h-4" /> Seu QR Code
          </CardTitle>
          <CardDescription>
            Aponte a câmera do celular para testar o acesso ao cardápio.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          {/* QR preview card */}
          <div className="bg-white rounded-2xl shadow-lg border border-border/40 p-6 flex flex-col items-center gap-3">
            <canvas ref={canvasRef} className="rounded-lg" />
            <p className="font-display text-base font-bold text-center text-gray-900">
              {restaurantName}
            </p>
            <p className="text-xs text-gray-500">Acesse nosso cardápio</p>
          </div>

          {/* Download buttons */}
          <div className="flex gap-3 w-full">
            <Button onClick={handleDownloadPNG} className="flex-1" variant="default">
              <Download className="w-4 h-4" /> Baixar PNG
            </Button>
            <Button onClick={handleDownloadSVG} className="flex-1" variant="outline">
              <Download className="w-4 h-4" /> Baixar SVG
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Link & instructions */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Link do cardápio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Label>URL pública</Label>
              <div className="flex gap-2">
                <Input value={menuUrl} readOnly className="text-xs font-mono" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <a href={`/menu/${slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" /> Abrir cardápio em nova aba
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dicas de uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { num: "1", tip: "Baixe o QR Code em PNG para impressão de alta qualidade." },
              { num: "2", tip: "Cole nas mesas, cardápios físicos, janelas ou paredes." },
              { num: "3", tip: "Use o formato SVG para impressões em tamanho grande." },
              { num: "4", tip: "Compartilhe o link direto no WhatsApp ou redes sociais." },
            ].map((item) => (
              <div key={item.num} className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {item.num}
                </span>
                <p className="text-sm text-muted-foreground">{item.tip}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
