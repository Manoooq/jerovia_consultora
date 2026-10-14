"use client";

import { useState } from "react";
import { Clock, ShieldCheck, Users, MapPin } from "lucide-react";

interface OperationalZone {
  id: string;
  name: string;
  shortName: string;
  sla: string;
  ciudades: string[];
  peritos: number;
  modalidad: string;
  coords: { x: number; y: number };
}

const ZONAS_OPERATIVAS: OperationalZone[] = [
  {
    id: "central",
    name: "Asunción y Departamento Central",
    shortName: "Gran Asunción",
    sla: "< 24 horas",
    ciudades: ["Asunción", "Luque", "San Lorenzo", "Lambaré", "Fernando de la Mora", "Capiatá", "Ñemby", "Mariano R. Alonso"],
    peritos: 4,
    modalidad: "Despliegue diario inmediato",
    coords: { x: 195, y: 245 },
  },
  {
    id: "centro",
    name: "Cordillera y Caaguazú",
    shortName: "Centro / Oviedo",
    sla: "24 a 36 horas",
    ciudades: ["Coronel Oviedo", "Caacupé", "Eusebio Ayala", "Itacurubí"],
    peritos: 2,
    modalidad: "Cobertura sobre corredor Ruta PY02",
    coords: { x: 248, y: 232 },
  },
  {
    id: "este",
    name: "Alto Paraná",
    shortName: "Ciudad del Este",
    sla: "24 a 48 horas",
    ciudades: ["Ciudad del Este", "Hernandarias", "Minga Guazú", "Presidente Franco"],
    peritos: 2,
    modalidad: "Peritos residentes en área metropolitana Este",
    coords: { x: 315, y: 248 },
  },
  {
    id: "sur",
    name: "Itapúa",
    shortName: "Encarnación",
    sla: "24 a 48 horas",
    ciudades: ["Encarnación", "Cambyretá", "Colonias Unidas", "Fram"],
    peritos: 2,
    modalidad: "Peritos residentes en eje Sur / Ruta PY01",
    coords: { x: 238, y: 342 },
  },
];

export function ParaguayOperationalMap() {
  const [selectedZone, setSelectedZone] = useState<OperationalZone>(ZONAS_OPERATIVAS[0]);
  const hqCoords = ZONAS_OPERATIVAS[0].coords;

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-overlay0/60 bg-surface0/90 backdrop-blur-xl p-5 sm:p-8 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-overlay0/50 mb-6">
        <div>
          <span className="text-xs font-semibold text-gold">
            Alcance Territorial
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text tracking-tight mt-0.5">
            Cobertura Operativa y Plazos de Respuesta
          </h2>
        </div>
        <span className="text-xs font-semibold text-subtext0">
          10 peritos acreditados en 4 cabeceras departamentales
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Mapa Vectorial Sobrio */}
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-[340px] aspect-[4/4.5] bg-surface1/60 rounded-2xl p-4 border border-overlay0/60 flex items-center justify-center">
            <svg viewBox="0 0 400 440" className="w-full h-full" aria-label="Mapa de cobertura en Paraguay">
              <path
                d="M 110 35 L 210 45 L 230 135 L 195 245 L 115 215 L 65 155 Z"
                fill="currentColor"
                className="text-surface2/50"
                stroke="currentColor"
                strokeWidth="1"
              />
              <path
                d="M 210 45 L 290 75 L 330 155 L 350 240 L 310 320 L 240 370 L 190 380 L 175 320 L 195 245 Q 225 145 210 45 Z"
                fill="currentColor"
                className="text-surface2"
                stroke="rgba(212, 175, 55, 0.45)"
                strokeWidth="1.5"
              />

              {ZONAS_OPERATIVAS.slice(1).map((zone) => (
                <line
                  key={`line-${zone.id}`}
                  x1={hqCoords.x}
                  y1={hqCoords.y}
                  x2={zone.coords.x}
                  y2={zone.coords.y}
                  stroke="rgba(212, 175, 55, 0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              ))}

              {ZONAS_OPERATIVAS.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r={isSelected ? "12" : "8"}
                      fill={isSelected ? "rgba(212, 175, 55, 0.3)" : "rgba(16, 185, 129, 0.2)"}
                      stroke={isSelected ? "#d4af37" : "#10b981"}
                      strokeWidth="2"
                    />
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r="4"
                      fill={isSelected ? "#d4af37" : "#10b981"}
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selector y Detalle de Zona */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ZONAS_OPERATIVAS.map((z) => {
              const active = selectedZone.id === z.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedZone(z)}
                  className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                    active
                      ? "bg-gold text-black border-gold font-bold"
                      : "bg-surface1 text-subtext0 border-overlay0/60 hover:text-text"
                  }`}
                >
                  {z.shortName}
                </button>
              );
            })}
          </div>

          <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-2 border-b border-overlay0/50 pb-3">
              <div>
                <h3 className="text-lg font-bold text-text">{selectedZone.name}</h3>
                <p className="text-xs text-subtext0 mt-0.5">{selectedZone.modalidad}</p>
              </div>
              <span className="text-xs font-semibold text-green bg-green/10 border border-green/30 px-2.5 py-1 rounded-md">
                Operativo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-surface0 border border-overlay0/50 flex items-center justify-between">
                <span className="text-xs text-subtext0 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gold" /> Tiempo de Entrega
                </span>
                <span className="text-sm font-bold text-text font-mono tabular-nums">{selectedZone.sla}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface0 border border-overlay0/50 flex items-center justify-between">
                <span className="text-xs text-subtext0 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-gold" /> Equipo Asignado
                </span>
                <span className="text-sm font-bold text-text font-mono tabular-nums">{selectedZone.peritos} peritos</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-semibold text-subtext1 block mb-2">
                Localidades con cobertura directa:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedZone.ciudades.map((ciudad) => (
                  <span
                    key={ciudad}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface0 border border-overlay0/50 text-xs text-text font-medium"
                  >
                    <MapPin className="h-3 w-3 text-gold" />
                    {ciudad}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-overlay0/40 flex items-center justify-between text-xs text-subtext0">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-gold" />
                Inspecciones con coordenadas GPS auditables
              </span>
              <span className="font-mono">Reg. N° 4.819</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
