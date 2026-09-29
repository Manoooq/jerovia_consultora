"use client";

import { useState, useCallback } from "react";
import { Camera, Loader2, CheckCircle, AlertCircle, Upload, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FotoUploaderProps {
  tipo: "vivienda" | "factura";
  onAnalizado: (data: Record<string, unknown>) => void;
  onFotoGuardada?: (base64: string) => void;
}

/**
 * Comprime imágenes en el cliente a máx 1000px y 75% calidad para respuesta en < 1 segundo
 */
function comprimirImagen(file: File, maxDim = 1000, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

export function FotoUploader({ tipo, onAnalizado, onFotoGuardada }: FotoUploaderProps) {
  const [state, setState] = useState<"idle" | "analyzing" | "done" | "error">("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    // Compresión instantánea en el cliente antes de enviar
    const compressedDataUrl = await comprimirImagen(file);
    if (!compressedDataUrl) return;

    setPreview(compressedDataUrl);
    const base64 = compressedDataUrl.split(",")[1];
    onFotoGuardada?.(compressedDataUrl);
    setState("analyzing");

    try {
      const res = await fetch("/api/ai/analizar-foto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imagen: base64, tipo }),
      });
      if (!res.ok) throw new Error("Error analizando imagen");
      const data = await res.json();
      onAnalizado(data);
      setState("done");
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 3000);
    }
  }, [tipo, onAnalizado, onFotoGuardada]);

  const titulos = {
    vivienda: "Fotografía de la Vivienda",
    factura: "Factura de Suministro (ANDE / ESSAP)",
  };
  const hints = {
    vivienda: "Extracción automática de materiales (techo, paredes, pisos)",
    factura: "Lectura rápida de NIS, titular y monto del suministro",
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-text">{titulos[tipo]}</p>
        <span className="text-[11px] font-medium text-gold flex items-center gap-1">
          <Zap className="h-3 w-3" /> Optimizado para velocidad
        </span>
      </div>

      <div
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-all duration-200 cursor-pointer",
          dragging ? "border-gold bg-gold/10 scale-[1.01]" : "border-overlay0 bg-surface1/60 hover:border-gold/50 hover:bg-surface1",
          state === "done" && "border-green/50 bg-green/5",
          state === "error" && "border-red/50 bg-red/5"
        )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) processFile(f); }}
        onClick={() => document.getElementById(`foto-${tipo}`)?.click()}
      >
        <input
          id={`foto-${tipo}`}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
        />

        {preview ? (
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Vista previa" className="w-full max-h-48 object-cover rounded-xl" />
            {state === "analyzing" && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-base/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-7 w-7 text-gold animate-spin" />
                  <p className="text-xs text-text font-semibold">Analizando instantáneamente...</p>
                </div>
              </div>
            )}
            {state === "done" && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-green text-black px-3 py-1 font-bold shadow-md">
                <CheckCircle className="h-3.5 w-3.5" />
                <span className="text-xs">Campos reconocidos</span>
              </div>
            )}
            {state === "error" && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-red text-white px-3 py-1 font-bold shadow-md">
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="text-xs">Reintentar</span>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface2 text-subtext0">
              {state === "idle" ? (
                <Camera className="h-6 w-6" />
              ) : (
                <Upload className="h-6 w-6 text-gold" />
              )}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-text">Toma una foto o selecciona una imagen</p>
              <p className="text-xs text-subtext0 mt-0.5">{hints[tipo]}</p>
            </div>
          </>
        )}
      </div>

      {preview && state !== "analyzing" && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start text-xs"
          onClick={(e) => { e.stopPropagation(); setPreview(null); setState("idle"); }}
        >
          Tomar otra foto
        </Button>
      )}
    </div>
  );
}
