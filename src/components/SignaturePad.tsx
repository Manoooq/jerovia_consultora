"use client";

import { useRef, useEffect, useState } from "react";
import { Eraser, CheckCircle2, PenTool } from "lucide-react";

interface SignaturePadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
}

export function SignaturePad({ value, onChange }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStroke, setHasStroke] = useState(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#1a2216";
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

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
    setHasStroke(true);
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
    onChange(canvas.toDataURL("image/png"));
  }

  function clearPad() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasStroke(false);
    onChange("");
  }

  return (
    <div className="rounded-2xl border border-overlay1 bg-surface1/70 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PenTool className="h-4 w-4 text-gold" />
          <span className="text-xs font-bold text-text">
            Firma Digital del Perito Evaluador (Opcional: si se deja vacío usa la firma oficial de Michelle Romero)
          </span>
        </div>

        <button
          type="button"
          onClick={clearPad}
          className="min-h-[32px] px-3 rounded-lg border border-overlay1 bg-surface0 hover:border-gold text-xs font-bold text-subtext1 hover:text-text inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Eraser className="h-3.5 w-3.5 text-gold" />
          <span>Limpiar Firma</span>
        </button>
      </div>

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
        <div className="pointer-events-none absolute inset-x-8 bottom-4 border-b border-dashed border-stone-300 text-center">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
            Firme aquí con el dedo o el cursor
          </span>
        </div>
      </div>

      {hasStroke && (
        <p className="text-[11px] font-bold text-green flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Firma capturada y vinculada a la Página 5 del informe.</span>
        </p>
      )}
    </div>
  );
}
