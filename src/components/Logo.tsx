import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "auto" | "cover" | "light";
  className?: string;
}

/**
 * Logo Oficial de Jerovia Consultora (Tipografía Serif + Emblema de Personas, Lupa y Check)
 * 100% vectorial, sin fondo y adaptable automáticamente a Modo Claro, Modo Oscuro y Portada.
 */
export function Logo({ size = "md", variant = "auto", className }: LogoProps) {
  const dimensions = {
    sm: "h-9 w-auto",
    md: "h-11 w-auto",
    lg: "h-16 w-auto",
  };

  const forceLight = variant === "cover" || variant === "light";

  return (
    <div
      className={cn(
        "inline-flex items-center select-none shrink-0",
        forceLight
          ? "text-[#f4f6f2] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
          : "text-[#1a2216] dark:text-[#f4f6f2]",
        className
      )}
    >
      <svg
        viewBox="0 0 350 118"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(" overflow-visible", dimensions[size])}
        role="img"
        aria-label="Jerovia Consultora"
      >
        {/* === GRUPO DE SILUETAS, LUPA Y CHECK (Arriba a la derecha de "Jerovia") === */}
        <g transform="translate(212, 4)">
          {/* Silueta Persona Superior */}
          <circle cx="46" cy="10" r="6.5" fill="currentColor" />
          <path
            d="M33 25C33 19.5 38.8 16.5 46 16.5C53.2 16.5 59 19.5 59 25"
            fill="currentColor"
          />

          {/* Silueta Persona Izquierda */}
          <circle cx="20" cy="24" r="7.5" fill="currentColor" />
          <path
            d="M5 44C5 36.5 11.5 32.5 20 32.5C26.5 32.5 31.5 35 33.5 39.5H5V44Z"
            fill="currentColor"
          />

          {/* Silueta Persona Derecha */}
          <circle cx="72" cy="24" r="7.5" fill="currentColor" />
          <path
            d="M58.5 39.5C60.5 35 65.5 32.5 72 32.5C80.5 32.5 87 36.5 87 44H58.5V39.5Z"
            fill="currentColor"
          />

          {/* Aro de la Lupa Central */}
          <circle
            cx="46"
            cy="35"
            r="16.5"
            stroke="currentColor"
            strokeWidth="5"
          />

          {/* Silueta Persona Central (Dentro de la Lupa) */}
          <circle cx="46" cy="30.5" r="5.5" fill="currentColor" />
          <path
            d="M35.5 44.5C36.8 39.2 40.8 37 46 37C51.2 37 55.2 39.2 56.5 44.5H35.5Z"
            fill="currentColor"
          />

          {/* Mango de la Lupa (Hacia abajo a la derecha) */}
          <path
            d="M59 47.5L75 63.5"
            stroke="currentColor"
            strokeWidth="6.5"
            strokeLinecap="round"
          />

          {/* Insignia Circular con Check (Abajo a la izquierda de la Lupa) */}
          <circle
            cx="26"
            cy="49"
            r="10.5"
            className={
              forceLight
                ? "fill-[#85987a] stroke-[#1a2216]"
                : "fill-[#536c45] dark:fill-[#85987a] stroke-white dark:stroke-[#121710]"
            }
            strokeWidth="2.2"
          />
          <path
            d="M21.2 49.2L24.6 52.5L31.2 45.5"
            stroke="#ffffff"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* === TIPOGRAFÍA SERIF OFICIAL "Jerovia" === */}
        <text
          x="4"
          y="56"
          fill="currentColor"
          fontFamily="Georgia, 'Times New Roman', Times, serif"
          fontWeight="700"
          fontSize="54"
          letterSpacing="-0.5"
        >
          Jerovia
        </text>

        {/* === TIPOGRAFÍA SERIF OFICIAL "Consultora" === */}
        <text
          x="4"
          y="105"
          fill="currentColor"
          fontFamily="Georgia, 'Times New Roman', Times, serif"
          fontWeight="700"
          fontSize="55"
          letterSpacing="-0.5"
        >
          Consultora
        </text>
      </svg>
    </div>
  );
}
