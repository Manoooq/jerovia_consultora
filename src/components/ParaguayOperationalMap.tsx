"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Navigation } from "lucide-react";

interface OperationalZone {
  id: string;
  name: string;
  shortName: string;
  sla: string;
  ciudades: string[];
  modalidad: string;
  coords: { x: number; y: number };
}

const ZONAS_OPERATIVAS: OperationalZone[] = [
  {
    id: "central",
    name: "Asunción y Gran Asunción",
    shortName: "Gran Asunción",
    sla: "< 24 hs",
    ciudades: ["Asunción", "Luque", "San Lorenzo", "Lambaré", "Fernando de la Mora", "Capiatá", "Ñemby"],
    modalidad: "Cobertura directa",
    coords: { x: 195, y: 245 },
  },
  {
    id: "centro",
    name: "Cordillera y Caaguazú",
    shortName: "Centro",
    sla: "24 - 36 hs",
    ciudades: ["Caacupé", "Coronel Oviedo", "Eusebio Ayala"],
    modalidad: "Corredor Ruta PY02",
    coords: { x: 248, y: 232 },
  },
  {
    id: "este",
    name: "Alto Paraná",
    shortName: "Ciudad del Este",
    sla: "24 - 48 hs",
    ciudades: ["Ciudad del Este", "Hernandarias", "Minga Guazú", "Presidente Franco"],
    modalidad: "Visitas programadas",
    coords: { x: 315, y: 248 },
  },
  {
    id: "sur",
    name: "Itapúa",
    shortName: "Encarnación",
    sla: "24 - 48 hs",
    ciudades: ["Encarnación", "Cambyretá", "Colonias Unidas"],
    modalidad: "Visitas programadas",
    coords: { x: 238, y: 342 },
  },
];

export function ParaguayOperationalMap() {
  const [selectedZone, setSelectedZone] = useState<OperationalZone>(ZONAS_OPERATIVAS[0]);
  const hqCoords = ZONAS_OPERATIVAS[0].coords;

  return (
    <div className="rounded-3xl border border-overlay0/60 bg-surface0/85 backdrop-blur-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-overlay0/40 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
            COBERTURA EN PARAGUAY
          </span>
          <h2 className="text-2xl font-black text-text tracking-tight mt-0.5">
            Zonas de Relevamiento
          </h2>
        </div>
        <span className="text-xs font-mono text-subtext0">
          Seleccione una región en el mapa
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 flex items-center justify-center">
          <div className="relative w-full max-w-[340px] aspect-[4/4.5] bg-mantle/80 rounded-3xl p-4 border border-overlay0/50 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 400 440" className="w-full h-full">
              <path
                d="M 110 35 L 210 45 L 230 135 L 195 245 L 115 215 L 65 155 Z"
                fill="currentColor"
                className="text-surface2/40"
                stroke="rgba(148, 163, 184, 0.25)"
                strokeWidth="1.5"
              />
              <path
                d="M 210 45 Q 225 145 195 245 T 175 320 T 190 380"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 3"
                opacity="0.6"
              />
              <path
                d="M 210 45 L 290 75 L 330 155 L 350 240 L 310 320 L 240 370 L 190 380 L 175 320 L 195 245 Q 225 145 210 45 Z"
                fill="currentColor"
                className="text-surface2/80"
                stroke="rgba(212, 175, 55, 0.45)"
                strokeWidth="2"
              />

              {ZONAS_OPERATIVAS.slice(1).map((zone) => (
                <line
                  key={`link-${zone.id}`}
                  x1={hqCoords.x}
                  y1={hqCoords.y}
                  x2={zone.coords.x}
                  y2={zone.coords.y}
                  stroke="rgba(212, 175, 55, 0.3)"
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
                    onMouseEnter={() => setSelectedZone(zone)}
                    className="cursor-pointer"
                  >
                    {isSelected && (
                      <circle
                        cx={zone.coords.x}
                        cy={zone.coords.y}
                        r="18"
                        fill="none"
                        stroke="#d4af37"
                        strokeWidth="1.5"
                        className="animate-ping opacity-40 origin-center"
                      />
                    )}
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r={isSelected ? "11" : "7"}
                      fill={isSelected ? "rgba(212, 175, 55, 0.35)" : "rgba(16, 185, 129, 0.25)"}
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

            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-subtext0 flex items-center gap-1.5">
              <Navigation className="h-3 w-3 text-gold" />
              <span>Toque un punto en el mapa</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ZONAS_OPERATIVAS.map((z) => {
              const active = selectedZone.id === z.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedZone(z)}
                  className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    active
                      ? "bg-gold text-black border-gold shadow-sm"
                      : "bg-surface1 text-subtext0 border-overlay0/50 hover:text-text"
                  }`}
                >
                  {z.shortName}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedZone.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="rounded-2xl border border-overlay0/60 bg-surface1/50 p-5 space-y-4"
            >
              <div className="flex items-center justify-between gap-2 border-b border-overlay0/40 pb-3">
                <div>
                  <h3 className="text-lg font-black text-text">{selectedZone.name}</h3>
                  <p className="text-xs text-subtext0">{selectedZone.modalidad}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-subtext0 uppercase block">Plazo estimado</span>
                  <span className="text-sm font-mono font-bold text-gold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {selectedZone.sla}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-subtext0 mb-2">
                  Ciudades principales:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.ciudades.map((ciudad) => (
                    <span
                      key={ciudad}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface0 border border-overlay0/50 text-xs font-semibold text-text"
                    >
                      <MapPin className="h-3 w-3 text-gold" />
                      {ciudad}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
