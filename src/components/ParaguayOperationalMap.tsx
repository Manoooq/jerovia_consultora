"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShieldCheck, Users, Radio, Navigation } from "lucide-react";

interface OperationalZone {
  id: string;
  name: string;
  shortName: string;
  sla: string;
  ciudades: string[];
  peritos: number;
  status: "Despliegue Inmediato" | "Ruta Programada";
  coords: { x: number; y: number };
}

const ZONAS_OPERATIVAS: OperationalZone[] = [
  {
    id: "central",
    name: "Asunción & Área Metropolitana",
    shortName: "Asunción HQ",
    sla: "< 24 hs",
    ciudades: ["Asunción", "Luque", "San Lorenzo", "Lambaré", "Fdo. de la Mora", "Capiatá"],
    peritos: 4,
    status: "Despliegue Inmediato",
    coords: { x: 195, y: 245 },
  },
  {
    id: "centro",
    name: "Corredor Centro (Cordillera / Caaguazú)",
    shortName: "Cnel. Oviedo",
    sla: "24 - 36 hs",
    ciudades: ["Coronel Oviedo", "Caacupé", "Eusebio Ayala", "Itacurubí"],
    peritos: 2,
    status: "Despliegue Inmediato",
    coords: { x: 248, y: 232 },
  },
  {
    id: "este",
    name: "Hub Alto Paraná (Triple Frontera)",
    shortName: "Ciudad del Este",
    sla: "24 - 48 hs",
    ciudades: ["Ciudad del Este", "Hernandarias", "Minga Guazú", "Pdte. Franco"],
    peritos: 2,
    status: "Ruta Programada",
    coords: { x: 315, y: 248 },
  },
  {
    id: "sur",
    name: "Hub Sur (Itapúa)",
    shortName: "Encarnación",
    sla: "24 - 48 hs",
    ciudades: ["Encarnación", "Cambyretá", "Colonias Unidas", "Fram"],
    peritos: 2,
    status: "Ruta Programada",
    coords: { x: 238, y: 342 },
  },
];

export function ParaguayOperationalMap() {
  const [selectedZone, setSelectedZone] = useState<OperationalZone>(ZONAS_OPERATIVAS[0]);
  const hqCoords = ZONAS_OPERATIVAS[0].coords;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="rounded-3xl border border-overlay0/60 bg-surface0/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl"
    >
      {/* Cabecera compacta */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-overlay0/40 mb-6">
        <div className="flex items-center gap-2.5">
          <Radio className="h-4 w-4 text-gold animate-pulse" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold block">
              COBERTURA GEORREFERENCIADA
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-text tracking-tight">
              Red Operativa en Paraguay
            </h2>
          </div>
        </div>
        <span className="text-xs font-mono text-green bg-green/10 border border-green/30 px-3 py-1 rounded-full flex items-center gap-2 font-bold">
          <span className="h-2 w-2 rounded-full bg-green animate-ping" />
          10 PERITOS EN TERRITORIO
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Mapa SVG con enlaces animados desde Asunción HQ */}
        <div className="lg:col-span-6 flex items-center justify-center">
          <div className="relative w-full max-w-[380px] aspect-[4/4.6] bg-mantle/80 rounded-3xl p-4 border border-overlay0/50 flex items-center justify-center overflow-hidden shadow-inner">
            <svg viewBox="0 0 400 440" className="w-full h-full">
              {/* Región Occidental (Chaco) */}
              <path
                d="M 110 35 L 210 45 L 230 135 L 195 245 L 115 215 L 65 155 Z"
                fill="currentColor"
                className="text-surface2/40"
                stroke="rgba(148, 163, 184, 0.25)"
                strokeWidth="1.5"
              />
              <text
                x="115"
                y="135"
                fill="currentColor"
                className="text-[9px] text-subtext0/60 font-mono font-bold tracking-widest select-none"
              >
                REGIÓN OCCIDENTAL
              </text>

              {/* Río Paraguay */}
              <path
                d="M 210 45 Q 225 145 195 245 T 175 320 T 190 380"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 3"
                opacity="0.7"
              />

              {/* Región Oriental */}
              <path
                d="M 210 45 L 290 75 L 330 155 L 350 240 L 310 320 L 240 370 L 190 380 L 175 320 L 195 245 Q 225 145 210 45 Z"
                fill="currentColor"
                className="text-surface2/80"
                stroke="rgba(229, 192, 123, 0.45)"
                strokeWidth="2"
              />

              {/* Líneas de enlace de telemetría desde Asunción HQ hacia los nodos */}
              {ZONAS_OPERATIVAS.slice(1).map((zone) => (
                <g key={`link-${zone.id}`}>
                  <line
                    x1={hqCoords.x}
                    y1={hqCoords.y}
                    x2={zone.coords.x}
                    y2={zone.coords.y}
                    stroke="rgba(229, 192, 123, 0.28)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <motion.circle
                    r="3"
                    fill="#E5C07B"
                    animate={{
                      cx: [hqCoords.x, zone.coords.x],
                      cy: [hqCoords.y, zone.coords.y],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2.4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </g>
              ))}

              {/* Nodos Interactivos */}
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
                        r="20"
                        fill="none"
                        stroke="#E5C07B"
                        strokeWidth="1.5"
                        className="animate-ping opacity-40 origin-center"
                      />
                    )}
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r={isSelected ? "12" : "8"}
                      fill={isSelected ? "rgba(229, 192, 123, 0.35)" : "rgba(16, 185, 129, 0.25)"}
                      stroke={isSelected ? "#E5C07B" : "#10b981"}
                      strokeWidth="2"
                    />
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r="4.5"
                      fill={isSelected ? "#E5C07B" : "#10b981"}
                    />
                    <text
                      x={zone.coords.x + 14}
                      y={zone.coords.y + 4}
                      fill={isSelected ? "#E5C07B" : "#94a3b8"}
                      className="text-[10px] font-mono font-bold select-none"
                    >
                      {zone.shortName}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-subtext0 flex items-center gap-1.5">
              <Navigation className="h-3 w-3 text-gold" />
              <span>Pasa el cursor o haz clic sobre un nodo</span>
            </div>
          </div>
        </div>

        {/* Panel Derecho de Telemetría Regional */}
        <div className="lg:col-span-6 space-y-5">
          {/* Selector rápido por botones */}
          <div className="flex flex-wrap gap-2">
            {ZONAS_OPERATIVAS.map((z) => {
              const active = selectedZone.id === z.id;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedZone(z)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border ${
                    active
                      ? "bg-gold text-black border-gold shadow-md shadow-gold/20"
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
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.22 }}
              className="rounded-2xl border border-overlay0/60 bg-surface1/60 p-6 space-y-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                    NODO OPERATIVO SELECCIONADO
                  </span>
                  <h3 className="text-xl font-black text-text mt-0.5">{selectedZone.name}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-green/15 text-green border border-green/30 shrink-0">
                  {selectedZone.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-surface0 border border-overlay0/50">
                  <div className="flex items-center gap-1.5 text-gold text-xs font-bold mb-1">
                    <Clock className="h-4 w-4" />
                    <span>SLA de Entrega</span>
                  </div>
                  <p className="text-2xl font-black text-text font-mono">{selectedZone.sla}</p>
                </div>

                <div className="p-4 rounded-2xl bg-surface0 border border-overlay0/50">
                  <div className="flex items-center gap-1.5 text-blue text-xs font-bold mb-1">
                    <Users className="h-4 w-4" />
                    <span>Capacidad Local</span>
                  </div>
                  <p className="text-2xl font-black text-text font-mono">{selectedZone.peritos} Peritos</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-subtext0 font-bold mb-2">
                  MUNICIPIOS CUBIERTOS SIN COSTO EXTRA DE RUTA
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.ciudades.map((ciudad) => (
                    <span
                      key={ciudad}
                      className="px-2.5 py-1 rounded-lg bg-surface0 border border-overlay0/50 text-xs font-semibold text-text"
                    >
                      {ciudad}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-overlay0/40 flex items-center justify-between text-xs text-subtext0">
                <span className="flex items-center gap-1.5 text-green font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Georreferenciación GPS Obligatoria</span>
                </span>
                <span className="font-mono text-gold font-bold">Ley N° 6534/20</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
