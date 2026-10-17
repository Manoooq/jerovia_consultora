import { cn } from "@/lib/utils";
import { useId } from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "auto" | "light";
  className?: string;
}

export function Logo({ size = "md", variant = "auto", className }: LogoProps) {
  const uid = useId();
  const gradShield = `jv-shield-${uid}`;
  const gradAccent = `jv-accent-${uid}`;

  const sizes = {
    sm: { box: "h-9 w-9", title: "text-base", sub: "text-[9px]" },
    md: { box: "h-10 w-10", title: "text-lg", sub: "text-[10px]" },
    lg: { box: "h-14 w-14", title: "text-2xl", sub: "text-xs" },
  };

  const s = sizes[size];
  const isLightForced = variant === "light";

  return (
    <div className={cn("inline-flex items-center gap-3 select-none group", className)}>
      {/* Emblema Vectorial HD Multicapa de Jerovia */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl p-0.5 transition-transform duration-200 group-hover:scale-[1.03]",
          s.box
        )}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(29,78,216,0.35)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradShield} x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#0F296B" />
            </linearGradient>
            <linearGradient id={gradAccent} x1="16" y1="12" x2="48" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>

          {/* Escudo Hexagonal Arquitectónico Exterior */}
          <path
            d="M32 4L56 14.5V31.5C56 46.8 45.8 56.9 32 61C18.2 56.9 8 46.8 8 31.5V14.5L32 4Z"
            fill={`url(#${gradShield})`}
            stroke={`url(#${gradAccent})`}
            strokeWidth="2"
          />

          {/* Bisel Interior de Precisión */}
          <path
            d="M32 10L50 18V31.2C50 42.9 42.3 50.8 32 54.2C21.7 50.8 14 42.9 14 31.2V18L32 10Z"
            fill="#0A193B"
            fillOpacity="0.55"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1"
          />

          {/* Hojas Geométricas de Confianza (Inspiradas en la flor de tres pétalos + Check de Verificación) */}
          <path
            d="M32 16C32 16 25 23.5 25 32.5C25 37.5 28.1 41.5 32 43.5C35.9 41.5 39 37.5 39 32.5C39 23.5 32 16 32 16Z"
            fill={`url(#${gradAccent})`}
          />
          <path
            d="M20 23C20 23 18.5 31 22.5 37C25 40.8 28.5 42.8 31.2 43.5C27.2 39.2 25.5 31.5 20 23Z"
            fill="#60A5FA"
            fillOpacity="0.85"
          />
          <path
            d="M44 23C44 23 45.5 31 41.5 37C39 40.8 35.5 42.8 32.8 43.5C36.8 39.2 38.5 31.5 44 23Z"
            fill="#38BDF8"
            fillOpacity="0.85"
          />

          {/* Trazo de Verificación Luminoso */}
          <path
            d="M24.5 33.5L29.8 38.8L40.5 27.5"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Logotipo Tipográfico de Alta Precisión */}
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-black tracking-[0.06em] uppercase",
            isLightForced ? "text-white" : "text-text",
            s.title
          )}
        >
          JEROVIA
        </span>
        <span
          className={cn(
            "font-mono font-bold uppercase tracking-[0.22em] mt-1",
            isLightForced ? "text-sky-300" : "text-gold",
            s.sub
          )}
        >
          CONSULTORA
        </span>
      </div>
    </div>
  );
}
