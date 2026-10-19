"use client";

import { useRef, useEffect, useState } from "react";
import { Eraser, CheckCircle2, PenTool, RotateCcw, ShieldCheck } from "lucide-react";
import { FIRMA_IVONE_DATA_URL } from "@/lib/defaultSignature";

interface SignaturePadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
}

export function SignaturePad({ value, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<"oficial" | "dibujar">(
    value && value !== FIRMA_IVONE_DATA_URL ? "dibujar" : "oficial"
  );

  const activeSignature = value || FIRMA_IVONE_DATA_URL;
  const isOfficial = !value || value === FIRMA_IVONE_DATA_URL;

  useEffect(() => {
    if (mode !== "dibujar") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1a2216";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [mode]);

  function getCoords(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    const { x, y } = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  }

  function moveDraw(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDraw() {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    onChange(dataUrl);
  }

  function clearPad() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange(FIRMA_IVONE_DATA_URL);
    setMode("oficial");
  }

  function restoreOfficial() {
    onChange(FIRMA_IVONE_DATA_URL);
    setMode("oficial");
  }

  return (
    <div className="rounded-2xl border border-overlay1 bg-surface1/70 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-overlay0 pb-2.5">
        <div className="flex items-center gap-2">
          <PenTool className="h-4 w-4 text-gold" />
          <span className="text-xs font-bold text-text">
            Firma Digital Oficial del Perito Evaluador
          </span>
        </div>

        <div className="flex items-center gap-2">
          {mode === "oficial" ? (
            <button
              type="button"
              onClick={() => setMode("dibujar")}
              className="min-h-[32px] px-3 rounded-lg border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-subtext1 hover:text-text inline-flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool className="h-3.5 w-3.5 text-gold" />
              <span>Dibujar Firma Manual</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={clearPad}
                className="min-h-[32px] px-3 rounded-lg border border-overlay1 bg-surface0 hover:border-red text-xs font-bold text-subtext1 hover:text-red inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Eraser className="h-3.5 w-3.5 text-red" />
                <span>Limpiar</span>
              </button>
              <button
                type="button"
                onClick={restoreOfficial}
                className="min-h-[32px] px-3 rounded-lg border border-gold/50 bg-gold/15 text-xs font-bold text-gold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Usar Firma Oficial</span>
              </button>
            </>
          )}
        </div>
      </div>

      {mode === "oficial" ? (
        <div className="rounded-xl border border-[#536c45]/40 bg-[#f8faf7] p-4 text-center space-y-2">
          <div className="h-18 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeSignature}
              alt="Firma Oficial de Lic. Ivonne Rodas"
              className="max-h-16 max-w-[180px] object-contain mx-auto block"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#536c45]/15 border border-[#536c45]/30 text-[11px] font-bold text-[#35482d]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#536c45]" />
            <span>Firma Oficial Digitalizada · Lic. Ivonne Rodas (Jerovia Consultora)</span>
          </div>
          <p className="text-[11px] text-stone-500">
            Esta firma oficial será estampada en la Página 5 del dictamen pericial (PDF y PPTX).
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative rounded-xl border border-overlay1 bg-white overflow-hidden">
            <canvas
              ref={canvasRef}
              width={520}
              height={150}
              onPointerDown={startDraw}
              onPointerMove={moveDraw}
              onPointerUp={endDraw}
              onPointerCancel={endDraw}
              className="w-full h-[130px] touch-none cursor-crosshair block"
            />
            <div className="pointer-events-none absolute inset-x-8 bottom-3 border-b border-dashed border-stone-300 text-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                Dibuje su firma con el dedo o el cursor
              </span>
            </div>
          </div>
          <p className="text-[11px] font-bold text-green flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Trazo manual capturado y vinculado al expediente.</span>
          </p>
        </div>
      )}
    </div>
  );
}
