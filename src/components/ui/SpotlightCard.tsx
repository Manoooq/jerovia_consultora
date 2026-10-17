"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  sinkIntensity?: number;
  pressable?: boolean;
}

export function SpotlightCard({
  children,
  className,
  sinkIntensity = 6,
  pressable = false,
  ...props
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  function handleMouseEnter() {
    const el = ref.current;
    if (!el) return;
    el.style.transition =
      "transform 70ms linear, border-color 180ms ease, box-shadow 180ms ease";
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

      const hasFocusedInput = el.matches(":focus-within");
      const effectiveIntensity = hasFocusedInput
        ? sinkIntensity * 0.2
        : sinkIntensity;
      const tz = hasFocusedInput ? -2 : -8;
      const scale = hasFocusedInput ? 0.998 : 0.988;

      const rx = (-ny * effectiveIntensity).toFixed(2);
      const ry = (nx * effectiveIntensity).toFixed(2);

      el.style.setProperty("--mx", `${x.toFixed(0)}px`);
      el.style.setProperty("--my", `${y.toFixed(0)}px`);
      el.style.transform = `perspective(950px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${tz}px) scale(${scale})`;
    });
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.transition =
      "transform 400ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms ease, box-shadow 250ms ease";
    el.style.transform =
      "perspective(950px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)";
  }

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform:
          "perspective(950px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)",
      }}
      className={cn(
        "group relative h-full rounded-2xl tactile-card overflow-hidden will-change-transform",
        pressable && "active:scale-[0.97] cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {/* Iluminación de borde fina (1.5px) siguiendo al cursor sin manchar el interior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          padding: "1.5px",
          background:
            "radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), var(--spotlight-border), transparent 72%)",
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
