"use client";

import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MapPin, Mic, Camera, FileSpreadsheet } from "lucide-react";

const ITEMS = [
  {
    code: "01",
    title: "Georreferenciación GPS",
    meta: "Coordenadas + Plus Code",
    icon: MapPin,
  },
  {
    code: "02",
    title: "Dictado por Voz",
    meta: "Transcripción a campos",
    icon: Mic,
  },
  {
    code: "03",
    title: "Evidencia Fotográfica",
    meta: "Fachada y servicios",
    icon: Camera,
  },
  {
    code: "04",
    title: "Exportación en 5 Láminas",
    meta: "PowerPoint (.PPTX) y PDF",
    icon: FileSpreadsheet,
  },
];

export function BentoFeatures() {
  return (
    <div className="recessed-well rounded-3xl p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <SpotlightCard
            key={item.code}
            sinkIntensity={7}
            pressable
            className="p-5 flex flex-col justify-between min-h-[148px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gold">
                {item.code}
              </span>
              <div className="h-9 w-9 rounded-xl bg-surface1 border border-overlay0 flex items-center justify-center text-gold">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-base font-bold text-text">{item.title}</h3>
              <p className="text-xs text-subtext1 mt-0.5 font-mono">
                {item.meta}
              </p>
            </div>
          </SpotlightCard>
        );
      })}
    </div>
  );
}
