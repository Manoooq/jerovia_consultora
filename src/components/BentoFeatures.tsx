"use client";

import { MapPin, FileText, Camera, ShieldCheck } from "lucide-react";

interface Pillar {
  category: string;
  title: string;
  stat: string;
  description: string;
  icon: React.ElementType;
}

const PILLARS: Pillar[] = [
  {
    category: "Constatación Presencial",
    title: "Georreferenciación en Fachada",
    stat: "Precisión GPS ±3m",
    description:
      "Cada visita registra coordenadas satelitales in situ, fotografía del inmueble y validación del medidor ANDE (NIS) para descartar domicilios ficticios.",
    icon: MapPin,
  },
  {
    category: "Estandarización Bancaria",
    title: "Dossier Ejecutivo en 5 Láminas",
    stat: "Formato .PPTX y PDF",
    description:
      "Estructurado específicamente para agilizar la lectura en comités de crédito de bancos, financieras y cooperativas sin páginas de relleno.",
    icon: FileText,
  },
  {
    category: "Asistencia en Campo",
    title: "Relevamiento Ágil en 9 Módulos",
    stat: "Autoguardado Continuo",
    description:
      "Interfaz adaptable a celulares y tablets para que el perito registre datos filiatorios, flujo financiero, salud, vivienda y fotografías en una sola sesión.",
    icon: Camera,
  },
  {
    category: "Marco Regulatorio",
    title: "Resguardo y Secreto Profesional",
    stat: "Leyes 6534/20 y 1682/01",
    description:
      "Control de acceso estricto por rol (Administrador / Perito Evaluador), trazabilidad de auditoría en bitácora y sesiones cifradas.",
    icon: ShieldCheck,
  },
];

export function BentoFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {PILLARS.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="group rounded-2xl sm:rounded-3xl border border-overlay0/60 bg-surface0/85 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 hover:border-gold/50 shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gold">
                  {item.category}
                </span>
                <div className="h-9 w-9 rounded-xl bg-surface1 border border-overlay0/60 flex items-center justify-center text-gold">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-bold text-text tracking-tight">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-subtext1 bg-surface1 px-2.5 py-1 rounded-md border border-overlay0/50 tabular-nums">
                    {item.stat}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-subtext0 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
