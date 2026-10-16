"use client";

import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MapPin, Mic, Camera, FileSpreadsheet } from "lucide-react";

const ITEMS = [
  {
    code: "01",
    title: "Geolocalización en Sitio",
    metric: "GPS + Plus Code",
    desc: "Captura satelital desde el domicilio visitado.",
    icon: MapPin,
    span: "md:col-span-7",
  },
  {
    code: "02",
    title: "Transcripción de Voz",
    metric: "Carga Asistida",
    desc: "Dictado rápido para completar campos en terreno.",
    icon: Mic,
    span: "md:col-span-5",
  },
  {
    code: "03",
    title: "Evidencia Fotográfica",
    metric: "Cámara / Galería",
    desc: "Registro comprimido de fachada y medidor.",
    icon: Camera,
    span: "md:col-span-5",
  },
  {
    code: "04",
    title: "Entregable Corporativo",
    metric: ".PPTX + PDF",
    desc: "5 láminas ejecutivas listas para comité.",
    icon: FileSpreadsheet,
    span: "md:col-span-7",
  },
];

export function BentoFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.code} className={item.span}>
            <SpotlightCard sinkIntensity={4.5} className="p-6 sm:p-7 flex flex-col justify-between min-h-[180px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gold">
                  {item.code} // {item.metric}
                </span>
                <div className="h-10 w-10 rounded-xl bg-surface1 border border-overlay0 flex items-center justify-center text-gold">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-lg sm:text-xl font-bold text-text tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-subtext1 mt-1">
                  {item.desc}
                </p>
              </div>
            </SpotlightCard>
          </div>
        );
      })}
    </div>
  );
}
