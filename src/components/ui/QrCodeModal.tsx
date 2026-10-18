"use client";

import { useState } from "react";
import { QrCode, X, Copy, Check, ExternalLink, Download } from "lucide-react";
import { Logo } from "@/components/Logo";

interface QrCodeBoxProps {
  url: string;
  title?: string;
  subtitle?: string;
}

export function QrCodeBox({ url, title, subtitle }: QrCodeBoxProps) {
  const [copied, setCopied] = useState(false);

  // QR en color Verde Oliva Oficial (#364228) con corrección de errores alta (ECC=H) para alojar el emblema central
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&ecc=H&margin=8&color=364228&bgcolor=f4f6f2&data=${encodeURIComponent(
    url
  )}`;

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl border border-[#85987a]/60 bg-gradient-to-br from-[#f4f6f2] to-[#e4ece0] dark:from-[#161d14] dark:to-[#1f291c] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 shadow-md">
      {/* Marco QR Personalizado con Emblema Central de Jerovia */}
      <div className="relative p-3 rounded-2xl bg-[#f4f6f2] border-2 border-[#536c45] shadow-md shrink-0 flex flex-col items-center">
        <div className="relative h-[148px] w-[148px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrImgSrc}
            alt={`Código QR Jerovia para ${title || "postulante"}`}
            width={148}
            height={148}
            className="h-[148px] w-[148px] object-contain rounded-lg block"
          />
          {/* Insignia Central Jerovia */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-10 w-10 rounded-xl bg-[#536c45] border-2 border-[#f4f6f2] shadow-md flex flex-col items-center justify-center text-white">
              <span className="font-serif font-black text-sm leading-none">J</span>
              <span className="text-[6px] font-mono uppercase tracking-tighter leading-none mt-0.5">
                JEROVIA
              </span>
            </div>
          </div>
        </div>
        <span className="mt-2 text-[9px] font-mono font-bold uppercase tracking-widest text-[#485536]">
          VERIFICACIÓN OFICIAL
        </span>
      </div>

      {/* Información y Acciones del Enlace */}
      <div className="space-y-2.5 text-center sm:text-left flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <Logo size="sm" />
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#536c45]/15 border border-[#536c45]/40 text-[10px] font-mono font-bold uppercase text-gold">
            <QrCode className="h-3 w-3" /> QR Personalizado
          </span>
        </div>

        {title && (
          <p className="text-sm sm:text-base font-black text-text truncate">
            Postulante: {title}
          </p>
        )}

        <p className="text-xs text-subtext1 leading-relaxed">
          {subtitle ||
            "Envíe este enlace o código QR al postulante o evaluador para completar la ficha socioambiental desde el celular."}
        </p>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[36px] px-3.5 rounded-xl border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-text inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-gold" />
            )}
            <span>{copied ? "Enlace Copiado" : "Copiar Enlace"}</span>
          </button>

          <a
            href={qrImgSrc}
            download={`QR_Jerovia_${(title || "Expediente").replace(/\s+/g, "_")}.png`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[36px] px-3.5 rounded-xl border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-text inline-flex items-center gap-1.5 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-gold" />
            <span>Guardar QR</span>
          </a>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[36px] px-3.5 rounded-xl bg-gold text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Abrir Link</span>
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
        className="w-full max-w-lg recessed-well rounded-3xl p-3"
      >
        <div className="tactile-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-overlay0 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-text">
              Código QR Oficial Jerovia Consultora
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
