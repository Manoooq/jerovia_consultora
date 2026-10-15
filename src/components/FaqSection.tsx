"use client";

import { SpotlightCard } from "@/components/ui/SpotlightCard";

const SPECS = [
  {
    code: "PROCESO",
    title: "Enlace único por expediente",
    desc: "El administrador emite el token y el evaluador registra los 9 módulos desde terreno.",
  },
  {
    code: "FORMATO",
    title: "Presentación ejecutiva lista",
    desc: "Exportación directa en 5 láminas PowerPoint (.PPTX) y documento PDF A4.",
  },
  {
    code: "DISPOSITIVOS",
    title: "Operación móvil y escritorio",
    desc: "Cámara integrada, captura de coordenadas GPS y respaldo local ante cortes de señal.",
  },
  {
    code: "CONTROL",
    title: "Jerarquía de accesos y bitácora",
    desc: "Permisos diferenciados para Administradores y Evaluadores con registro de auditoría.",
  },
];

export function FaqSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {SPECS.map((s) => (
        <SpotlightCard key={s.code} sinkIntensity={5} className="p-5 flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
            {s.code}
          </span>
          <div className="pt-4">
            <h3 className="text-sm font-bold text-text">{s.title}</h3>
            <p className="text-xs text-subtext1 mt-1 leading-relaxed">{s.desc}</p>
          </div>
        </SpotlightCard>
      ))}
    </div>
  );
}
