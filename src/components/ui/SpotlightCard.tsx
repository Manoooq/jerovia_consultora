"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  /** Grados de inclinación al hundirse bajo el cursor */
  sinkIntensity?: number;
  /** Hundimiento extra al hacer clic */
  pressable?: boolean;
}

export function SpotlightCard({
  children,
  className,
  sinkIntensity = 7,
  pressable = false,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  function handleMouseEnter() {
    const el = ref.current;
    if (!el) return;
    el.style.transition =
      "transform 60ms linear, border-color 150ms ease, box-shadow 150ms ease, background-color 150ms ease";
  }

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

      const nx = (x - cx) / cx;
      const ny = (y - cy) / cy;

      // Si el usuario está escribiendo en un input dentro del panel, suavizar la inclinación
      const hasFocusedInput = el.matches(":focus-within");
      const effectiveIntensity = hasFocusedInput ? sinkIntensity * 0.25 : sinkIntensity;
      const tz = hasFocusedInput ? -4 : -10;
      const scale = hasFocusedInput ? 0.996 : 0.984;

      const rx = (-ny * effectiveIntensity).toFixed(2);
      const ry = (nx * effectiveIntensity).toFixed(2);

      el.style.setProperty("--mx", `${x.toFixed(0)}px`);
      el.style.setProperty("--my", `${y.toFixed(0)}px`);
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${tz}px) scale(${scale})`;
    });
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.transition =
      "transform 420ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms ease, box-shadow 250ms ease, background-color 250ms ease";
    el.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)";
  }

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform:
          "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)",
      }}
      className={cn(
        "group relative h-full rounded-2xl border border-overlay1/80 bg-surface0/90 backdrop-blur-xl overflow-hidden will-change-transform",
        "shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]",
        "hover:border-gold/60 hover:bg-crust/90",
        "hover:shadow-[inset_0_6px_24px_rgba(0,0,0,0.75),0_2px_8px_rgba(0,0,0,0.4)]",
        pressable && "active:scale-[0.96] cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {/* Haz de luz interno sobre la superficie hundida */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background:
            "radial-gradient(360px circle at var(--mx, 50%) var(--my, 50%), rgba(229, 192, 123, 0.22), rgba(212, 175, 55, 0.05) 45%, transparent 70%)",
        }}
      />

      {/* Borde láser de 1.5px que brilla intensamente siguiendo al cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          padding: "1.5px",
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(243, 229, 171, 0.95), rgba(212, 175, 55, 0.35) 50%, transparent 75%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
