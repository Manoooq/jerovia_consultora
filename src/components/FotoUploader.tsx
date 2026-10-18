"use client";

import { useRef, useState } from "react";
import { Camera, Trash2, Upload, Loader2, CheckCircle2 } from "lucide-react";

interface FotoUploaderProps {
  fotos: string[];
  onChange: (fotos: string[]) => void;
  maxFotos?: number;
}

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Error leyendo imagen"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Formato no soportado"));
      img.onload = () => {
        const MAX_DIM = 1100;
        let w = img.width;
        let h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          if (w > h) {
            h = Math.round((h * MAX_DIM) / w);
            w = MAX_DIM;
          } else {
            w = Math.round((w * MAX_DIM) / h);
            h = MAX_DIM;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function FotoUploader({
  fotos = [],
  onChange,
  maxFotos = 4,
}: FotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setProcessing(true);
    try {
      const remaining = Math.max(0, maxFotos - fotos.length);
      const selected = Array.from(fileList).slice(0, remaining);
      const compressedList: string[] = [];

      for (const file of selected) {
        const dataUrl = await compressImageFile(file);
        compressedList.push(dataUrl);
      }

      if (compressedList.length > 0) {
        onChange([...fotos, ...compressedList]);
      }
    } catch (err) {
      console.error("Error procesando foto:", err);
    } finally {
      setProcessing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeFoto(index: number) {
    const next = fotos.filter((_, i) => i !== index);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxFotos > 1}
        onChange={handleFiles}
        className="hidden"
      />

      {fotos.length > 0 && (
        <div
          className={
            fotos.length === 1
              ? "grid grid-cols-1 gap-3"
              : "grid grid-cols-1 sm:grid-cols-2 gap-3"
          }
        >
          {fotos.map((src, idx) => (
            <div
              key={idx}
              className="relative group rounded-xl overflow-hidden border-2 border-[#536c45] bg-surface1 min-h-[180px] max-h-[260px] flex items-center justify-center p-1.5 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Fotografía ${idx + 1}`}
                className="max-w-full max-h-[240px] w-auto h-auto object-contain rounded-lg block mx-auto"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-[#a3e635]" />
                <span>Foto completa #{idx + 1}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFoto(idx)}
                className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-red text-white flex items-center justify-center shadow-md cursor-pointer hover:opacity-90"
                title="Eliminar fotografía"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {fotos.length < maxFotos && (
        <button
          type="button"
          disabled={processing}
          onClick={() => inputRef.current?.click()}
          className="w-full min-h-[84px] rounded-2xl border-2 border-dashed border-[#85987a] hover:border-[#536c45] bg-surface0/70 hover:bg-[#536c45]/10 px-4 py-4 flex flex-col items-center justify-center gap-1.5 text-xs font-bold text-text cursor-pointer transition-all"
        >
          {processing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-gold" />
              <span>Optimizando y guardando fotografía completa...</span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-gold">
                <Camera className="h-5 w-5" />
                <Upload className="h-4 w-4" />
              </div>
              <span>
                Seleccionar o Tomar Fotografía ({fotos.length}/{maxFotos})
              </span>
              <span className="text-[11px] font-normal text-subtext1">
                Se ajusta automáticamente a proporción completa en el informe PDF y PowerPoint (.PPTX)
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
