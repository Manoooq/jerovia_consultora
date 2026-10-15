"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  /** Intensidad del hundimiento 3D bajo el cursor (grados) */
  sinkIntensity?: number;
  /** Si es true, aplica un hundimiento adicional al hacer clic */
  pressable?: boolean;
}

/**
 * Panel corporativo con iluminación especular de doble capa (borde + superficie)
 * y física de presión 3D: la superficie bajo el cursor se hunde suavemente
 * a 60 FPS usando variables CSS sin re-renderizar React.
 */
export function SpotlightCard({
  children,
  className,
  sinkIntensity = 4.2,
  pressable = false,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Matemática de hundimiento: la zona donde está el cursor se inclina hacia adentro (eje Z negativo)
      const rx = ((cy - y) / cy) * sinkIntensity;
      const ry = ((x - cx) / cx) * sinkIntensity;

      el.style.setProperty("--mx", `${x.toFixed(0)}px`);
      el.style.setProperty("--my", `${y.toFixed(0)}px`);
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--scale", "0.988");
      el.style.setProperty("--tz", "-6px");
    });
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--scale", "1");
    el.style.setProperty("--tz", "0px");
  }

  return (
    <div className="[perspective:1100px] h-full">
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            " rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(var(--tz, 0px)) scale(var(--scale, 1))",
        }}
        className={cn(
          "group relative h-full rounded-2xl border border-overlay0/90 bg-surface0/90 backdrop-blur-xl overflow-hidden",
          "transition-[transform,border-color,box-shadow,background-color] duration-200 ease-out will-change-transform",
          "hover:border-gold/45 hover:bg-surface1/70",
          "shadow-[0_8px_28px_-6px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.06)]",
          "hover:shadow-[inset_0_3px_16px_rgba(0,0,0,0.45),0_2px_10px_rgba(0,0,0,0.25)]",
          pressable && "active:scale-[0.975] cursor-pointer",
          className
        )}
        {...props}
      >
        {/* Capa 1: Brillo especular sobre la superficie interna */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--spotlight-rgb), 0.14), transparent 55%)",
          }}
        />

        {/* Capa 2: Iluminación intensa de borde que sigue al puntero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            padding: "1px",
            background:
              "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(var(--spotlight-rgb), 0.7), transparent 70%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <div className="relative z-10 h-full">{children}</div>
      </div>
    </div>
  );
}
