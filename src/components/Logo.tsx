"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const heights = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
  };

  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      <svg
        viewBox="0 0 210 70"
        className={cn("w-auto text-text transition-colors", heights[size])}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Jerovia Consultora"
        role="img"
      >
        {/* === TIPOGRAFÍA CORPORATIVA JEROVIA CONSULTORA === */}
        {showText && (
          <g className="fill-text font-serif">
            {/* Jerovia */}
            <text
              x="5"
              y="32"
              fontFamily="Georgia, Cambria, 'Times New Roman', Times, serif"
              fontSize="28"
              fontWeight="bold"
              letterSpacing="-0.5"
              fill="currentColor"
            >
              Jerovia
            </text>
            {/* Consultora */}
            <text
              x="5"
              y="58"
              fontFamily="Georgia, Cambria, 'Times New Roman', Times, serif"
              fontSize="24"
              fontWeight="600"
              letterSpacing="-0.2"
              fill="currentColor"
            >
              Consultora
            </text>
          </g>
        )}

        {/* === EMBLEMA CORPORATIVO: EQUIPO + LUPA EVALUADORA + CERTIFICACIÓN === */}
        <g transform="translate(132, 2)">
          {/* Persona Superior (Nodo del equipo) */}
          <circle cx="36" cy="11" r="5.5" fill="currentColor" />
          <path
            d="M 28 22 C 28 17.5, 44 17.5, 44 22"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Persona Izquierda */}
          <circle cx="16" cy="28" r="5" fill="currentColor" opacity="0.85" />
          <path
            d="M 9 39 C 9 34.5, 23 34.5, 23 39"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Persona Derecha */}
          <circle cx="56" cy="28" r="5" fill="currentColor" opacity="0.85" />
          <path
            d="M 49 39 C 49 34.5, 63 34.5, 63 39"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Lupa Central (Evaluación Socioambiental) */}
          {/* Anillo de la lupa */}
          <circle
            cx="36"
            cy="36"
            r="16"
            stroke="currentColor"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Mango de la lupa */}
          <line
            x1="48"
            y1="48"
            x2="62"
            y2="62"
            stroke="currentColor"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          {/* Postulante Evaluado (Dentro de la Lupa) */}
          <circle cx="36" cy="32" r="4.5" fill="currentColor" />
          <path
            d="M 28 44 C 28 39, 44 39, 44 44"
            fill="currentColor"
          />

          {/* Sello de Verificación / Dictamen (Dorado Jerovia) */}
          <circle cx="23" cy="50" r="8" fill="#C9A84C" />
          {/* Checkmark blanco */}
          <path
            d="M 19.5 50 L 22 52.5 L 26.5 47.5"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
