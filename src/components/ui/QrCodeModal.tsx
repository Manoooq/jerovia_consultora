"use client";

import { useState, useEffect, useRef } from "react";
import {
  QrCode,
  X,
  Copy,
  Check,
  ExternalLink,
  Download,
  Share2,
} from "lucide-react";
import { Logo } from "@/components/Logo";

interface QrCodeBoxProps {
  url: string;
  title?: string;
  subtitle?: string;
}

function drawOriginalJeroviaEmblem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale = 1,
  color = "#485536"
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  ctx.beginPath();
  ctx.arc(0, -18, 5.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -4, 11, Math.PI, 0, false);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-20, -6, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-20, 10, 12, Math.PI, 0, false);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(20, -6, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(20, 10, 12, Math.PI, 0, false);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 4, 15, 0, Math.PI * 2);
  ctx.fillStyle = "#536c45";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 4, 13.5, 0, Math.PI * 2);
  ctx.lineWidth = 4.2;
  ctx.strokeStyle = color;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, 4.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, 12, 9.5, Math.PI, 0, false);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(10, 14);
  ctx.lineTo(23, 27);
  ctx.lineWidth = 5.5;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(-15, 16, 8.5, 0, Math.PI * 2);
  ctx.fillStyle = "#85987a";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#f4f6f2";
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-19, 16);
  ctx.lineTo(-16, 19);
  ctx.lineTo(-11, 13);
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.restore();
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function QrCodeBox({ url, title, subtitle }: QrCodeBoxProps) {
  const [copied, setCopied] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // QR 100% despejado en Verde Oliva Oscuro (#2b3720) sobre fondo blanco para lectura instantánea en cualquier cámara
  const qrRawUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&ecc=M&margin=2&color=2b3720&bgcolor=ffffff&data=${encodeURIComponent(
    url
  )}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const W = 560;
      const H = 700;
      canvas.width = W;
      canvas.height = H;

      // 1. Fondo general de la tarjeta en Verde Oliva (#536c45 -> #38492f)
      const bgGrad = ctx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, "#536c45");
      bgGrad.addColorStop(1, "#38492f");
      roundRectPath(ctx, 0, 0, W, H, 36);
      ctx.fillStyle = bgGrad;
      ctx.fill();

      roundRectPath(ctx, 12, 12, W - 24, H - 24, 28);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(213, 221, 209, 0.45)";
      ctx.stroke();

      // 2. Cabecera con el Logo Original de Jerovia Consultora (sin tapar los puntos del QR)
      ctx.fillStyle = "#f4f6f2";
      ctx.font = "bold 38px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "left";
      ctx.fillText("Jerovia", 130, 62);
      ctx.fillText("Consultora", 130, 102);

      drawOriginalJeroviaEmblem(ctx, 326, 54, 0.9, "#f4f6f2");

      // 3. Marco blanco con bordes redondeados y QR 100% libre de obstrucciones
      roundRectPath(ctx, 55, 130, 450, 450, 28);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "#85987a";
      ctx.stroke();

      ctx.drawImage(img, 80, 155, 400, 400);

      // 4. Pie de la tarjeta con el nombre del postulante
      ctx.fillStyle = "#f4f6f2";
      ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      const displayTitle = (title || "Cuestionario Socioambiental").slice(
        0,
        34
      );
      ctx.fillText(displayTitle, W / 2, 624);

      ctx.fillStyle = "#d5ddd1";
      ctx.font = "600 13px monospace";
      ctx.fillText("ESCANEE EL QR PARA COMPLETAR SUS DATOS", W / 2, 654);

      setReady(true);
    };
    img.src = qrRawUrl;
  }, [qrRawUrl, title]);

  function handleCopyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownloadCard() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `QR_Jerovia_${(title || "Postulante").replace(/\s+/g, "_")}.png`;
    a.click();
  }

  async function handleShareCustomQr() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const fileName = `QR_Jerovia_${(title || "Postulante").replace(/\s+/g, "_")}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const textMsg = `Estimado/a ${
        title || "postulante"
      }, le saluda Jerovia Consultora. Escanee este código QR o ingrese al enlace para completar sus datos: ${url}`;

      if (
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            title: `Jerovia Consultora - ${title || "Cuestionario"}`,
            text: textMsg,
            files: [file],
          });
          return;
        } catch {}
      }

      try {
        if (typeof ClipboardItem !== "undefined") {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setShareMsg(
            "¡Imagen del QR Verde Oliva copiada! Solo presione Pegar (Ctrl+V) en WhatsApp."
          );
          setTimeout(() => setShareMsg(null), 5000);
        }
      } catch {
        handleDownloadCard();
        setShareMsg("Tarjeta QR descargada lista para adjuntar en WhatsApp.");
        setTimeout(() => setShareMsg(null), 4000);
      }
    }, "image/png");
  }

  return (
    <div className="rounded-3xl border border-[#85987a]/60 bg-gradient-to-br from-[#f4f6f2] to-[#e4ece0] dark:from-[#161d14] dark:to-[#1f291c] p-4 sm:p-5 flex flex-col md:flex-row items-center gap-5 shadow-md">
      <div className="shrink-0 flex flex-col items-center">
        <canvas
          ref={canvasRef}
          className="w-[210px] h-[262px] rounded-2xl shadow-lg border border-[#536c45]/40 bg-[#536c45]"
        />
      </div>

      <div className="space-y-3 text-center md:text-left flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
          <Logo size="sm" />
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#536c45]/15 border border-[#536c45]/40 text-[10px] font-mono font-bold uppercase text-gold">
            <QrCode className="h-3 w-3" /> QR Oficial Verde Oliva
          </span>
        </div>

        {title && (
          <p className="text-sm sm:text-base font-black text-text truncate">
            Postulante: {title}
          </p>
        )}

        <p className="text-xs text-subtext1 leading-relaxed">
          {subtitle ||
            "Al presionar 'Enviar QR Personalizado', se envía o copia esta tarjeta QR en Verde Oliva con el logo original de Jerovia y lectura instantánea."}
        </p>

        {shareMsg && (
          <div className="p-2.5 rounded-xl bg-[#536c45]/15 border border-[#536c45] text-xs font-bold text-gold">
            ✓ {shareMsg}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
          <button
            type="button"
            disabled={!ready}
            onClick={handleShareCustomQr}
            className="min-h-[40px] px-4 rounded-xl bg-[#536c45] hover:bg-[#485536] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm cursor-pointer transition-all"
          >
            <Share2 className="h-4 w-4" />
            <span>Enviar QR Personalizado</span>
          </button>

          <button
            type="button"
            disabled={!ready}
            onClick={handleDownloadCard}
            className="min-h-[40px] px-3.5 rounded-xl border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-text inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-gold" />
            <span>Descargar Imagen QR</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="min-h-[40px] px-3.5 rounded-xl border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-text inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-gold" />
            )}
            <span>{copied ? "Link Copiado" : "Copiar Link"}</span>
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[40px] px-3.5 rounded-xl border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-text inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Abrir</span>
            <ExternalLink className="h-3.5 w-3.5 text-gold" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function QrModal({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl recessed-well rounded-3xl p-3"
      >
        <div className="tactile-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-overlay0 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-text">
              Tarjeta QR Oficial Jerovia Consultora
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar modal"
              className="text-subtext1 hover:text-text cursor-pointer rounded-lg focus-visible:ring-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <QrCodeBox url={url} title={title} />
        </div>
      </div>
    </div>
  );
}
