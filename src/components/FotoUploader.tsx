"use client";

import { useState, useCallback, useId } from "react";
import {
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ImagePlus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FotoUploaderProps {
  tipo: "vivienda" | "factura";
  onAnalizado: (data: Record<string, unknown>) => void;
  onFotoGuardada?: (base64: string) => void;
  initialPreview?: string;
}

function comprimirImagen(file: File, maxDim = 800, quality = 0.72): Promise<string> {
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

export function FotoUploader({
  tipo,
  onAnalizado,
  onFotoGuardada,
  initialPreview,
}: FotoUploaderProps) {
  const uid = useId();
  const cameraInputId = `cam-${tipo}-${uid}`;
  const galleryInputId = `gal-${tipo}-${uid}`;

  const [state, setState] = useState<"idle" | "analyzing" | "done" | "error">(
    initialPreview ? "done" : "idle"
  );
  const [preview, setPreview] = useState<string | null>(initialPreview || null);
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;

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
      }
    },
    [tipo, onAnalizado, onFotoGuardada]
  );

  const titulos = {
    vivienda: "Registro Fotográfico de Fachada e Inmueble",
    factura: "Comprobante de Suministro (ANDE / ESSAP)",
  };
  const hints = {
    vivienda:
      "Reconocimiento asistido de mampostería, techo, pisos y estado general",
    factura:
      "Detección de NIS, titularidad y estado del suministro eléctrico",
  };

  return (
    <div className="rounded-2xl border border-overlay0/70 bg-surface1/40 p-4 sm:p-5 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs sm:text-sm font-bold text-text">{titulos[tipo]}</p>
          <p className="text-[11px] text-subtext0">{hints[tipo]}</p>
        </div>
        {state === "done" && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green bg-green/10 border border-green/30 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="h-3.5 w-3.5" /> Evidencia adjuntada
          </span>
        )}
      </div>

      {/* Inputs ocultos separados: uno para Cámara directa en celular y otro para Galería/PC */}
      <input
        id={cameraInputId}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) processFile(f);
        }}
      />
      <input
        id={galleryInputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) processFile(f);
        }}
      />

      {preview ? (
        <div className="space-y-3">
          <div className="relative w-full overflow-hidden rounded-xl border border-overlay0/60 bg-crust">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={`Evidencia ${tipo}`}
              className="w-full max-h-56 object-cover"
            />
            {state === "analyzing" && (
              <div className="absolute inset-0 flex items-center justify-center bg-base/80 backdrop-blur-xs">
                <div className="flex items-center gap-2.5 rounded-xl bg-surface0 border border-overlay1 px-4 py-2.5 shadow-lg">
                  <Loader2 className="h-4 w-4 text-gold animate-spin" />
                  <span className="text-xs font-semibold text-text">
                    Relevando características constructivas...
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            {state === "error" ? (
              <span className="text-xs text-subtext0 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-yellow" />
                Foto guardada (complete los materiales manualmente abajo).
              </span>
            ) : (
              <span className="text-xs text-subtext0">
                Imagen comprimida y vinculada al expediente.
              </span>
            )}

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setPreview(null);
                setState("idle");
                onFotoGuardada?.("");
              }}
            >
              <Trash2 className="h-3.5 w-3.5 text-red" />
              <span>Reemplazar foto</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const f = e.dataTransfer.files[0];
            if (f) processFile(f);
          }}
          className={cn(
            "rounded-xl border border-dashed p-5 transition-colors flex flex-col items-center justify-center gap-3 text-center",
            dragging
              ? "border-gold bg-gold/10"
              : "border-overlay1/70 bg-surface0/60"
          )}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-sm">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => document.getElementById(cameraInputId)?.click()}
              className="w-full sm:flex-1"
            >
              <Camera className="h-4 w-4" />
              <span>Tomar Foto</span>
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => document.getElementById(galleryInputId)?.click()}
              className="w-full sm:flex-1"
            >
              <ImagePlus className="h-4 w-4 text-gold" />
              <span>Subir de Galería</span>
            </Button>
          </div>
          <p className="text-[11px] text-subtext0">
            Compatible con cámara móvil en terreno o arrastrando archivos en PC
          </p>
        </div>
      )}
    </div>
  );
}
