"use client";

import { QrCode, X, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";

interface QrCodeBoxProps {
  url: string;
  title?: string;
  subtitle?: string;
}

export function QrCodeBox({ url, title, subtitle }: QrCodeBoxProps) {
  const [copied, setCopied] = useState(false);
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&color=1a2216&bgcolor=ffffff&data=${encodeURIComponent(
    url
  )}`;

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-overlay1 bg-surface1/80 p-4 flex flex-col sm:flex-row items-center gap-4">
      <div className="p-2.5 rounded-2xl bg-white border border-overlay1 shrink-0 shadow-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrImgSrc}
          alt={`Código QR para ${title || "expediente"}`}
          width={136}
          height={136}
          className="h-[136px] w-[136px] object-contain block"
        />
      </div>

      <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
          <QrCode className="h-3.5 w-3.5" />
          <span>ACCESO MÓVIL POR CÓDIGO QR</span>
        </div>
        {title && <p className="text-sm font-black text-text truncate">{title}</p>}
        <p className="text-xs text-subtext1 leading-relaxed">
          {subtitle ||
            "Escanee este código con la cámara de su teléfono para abrir el cuestionario directamente en terreno."}
        </p>
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[34px] px-3 rounded-lg border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-text inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-gold" />
            )}
            <span>{copied ? "Copiado" : "Copiar Link"}</span>
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[34px] px-3 rounded-lg bg-gold text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <span>Abrir</span>
            <ExternalLink className="h-3.5 w-3.5" />
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
        className="w-full max-w-md recessed-well rounded-3xl p-3"
      >
        <div className="tactile-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-overlay0 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-text">
              Código QR del Expediente
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-subtext1 hover:text-text cursor-pointer"
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
