"use client";

import { useState } from "react";
import { MapPin, Clock, ShieldCheck, Car, Users, Radio, Navigation } from "lucide-react";

interface OperationalZone {
  id: string;
  name: string;
  departamento: string;
  sla: string;
  ciudades: string[];
  rutas: string;
  peritos: number;
  status: "Inmediato" | "Programado";
  detalles: string;
  coords: { x: number; y: number };
}

const ZONAS_OPERATIVAS: OperationalZone[] = [
  {
    id: "central",
    name: "Gran Asunción y Central",
    departamento: "Distrito Capital y Central",
    sla: "< 24 horas",
    ciudades: ["Asunción", "Luque", "San Lorenzo", "Lambaré", "Fernando de la Mora", "Capiatá"],
    rutas: "Avda. Mcal. López, Autopista Silvio Pettirossi, Rutas PY01, PY02 y PY03",
    peritos: 4,
    status: "Inmediato",
    detalles: "Base de peritos con movilidad propia y cobertura en el mismo día hábil.",
    coords: { x: 195, y: 245 },
  },
  {
    id: "este",
    name: "Alto Paraná (Zona Este)",
    departamento: "Alto Paraná",
    sla: "24 - 48 horas",
    ciudades: ["Ciudad del Este", "Hernandarias", "Minga Guazú", "Presidente Franco"],
    rutas: "Corredor Nacional Ruta PY02",
    peritos: 2,
    status: "Programado",
    detalles: "Peritos residentes en Ciudad del Este con despliegue ágil en el área metropolitana este.",
    coords: { x: 310, y: 250 },
  },
  {
    id: "sur",
    name: "Itapúa (Zona Sur)",
    departamento: "Itapúa",
    sla: "48 horas",
    ciudades: ["Encarnación", "Cambyretá", "Fram", "Colonias Unidas"],
    rutas: "Corredor Nacional Ruta PY01",
    peritos: 1,
    status: "Programado",
    detalles: "Inspecciones en Encarnación y colonias agroindustriales aledañas.",
    coords: { x: 235, y: 340 },
  },
  {
    id: "centro",
    name: "Caaguazú y Cordillera",
    departamento: "Caaguazú / Cordillera",
    sla: "24 - 36 horas",
    ciudades: ["Coronel Oviedo", "Caacupé", "Eusebio Ayala"],
    rutas: "Ruta PY02 y enlace PY08",
    peritos: 2,
    status: "Inmediato",
    detalles: "Conexión vial central para verificaciones en ciudades intermedias del interior.",
    coords: { x: 245, y: 235 },
  },
];

export function ParaguayOperationalMap() {
  const [selectedZone, setSelectedZone] = useState<OperationalZone>(ZONAS_OPERATIVAS[0]);

  return (
    <div className="rounded-3xl glass-panel p-6 sm:p-8 shadow-2xl">
      {/* HUD Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-gold animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
            RED NACIONAL DE PERITAJE · PARAGUAY
          </span>
        </div>
        <span className="text-xs font-mono text-green bg-green/10 border border-green/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green animate-ping" />
          4 NODOS ACTIVOS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Columna Izquierda: Mapa Vectorial Geográfico */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[360px] aspect-[4/5] bg-surface1/60 rounded-3xl p-4 border border-white/[0.08] flex items-center justify-center overflow-hidden">
            
            <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-2xl">
              {/* Contorno Chaco (Occidental) */}
              <path
                d="M 120 40 L 210 50 L 230 140 L 195 240 L 120 220 L 70 160 Z"
                fill="currentColor"
                className="text-surface2/50"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.5"
              />
              <text x="110" y="140" fill="currentColor" className="text-[9px] text-subtext0/50 font-mono font-bold tracking-widest">
                CHACO
              </text>

              {/* Río Paraguay divisor con brillo */}
              <path
                d="M 210 50 Q 225 150 195 240 T 175 320 T 190 380"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                opacity="0.8"
              />

              {/* Contorno Región Oriental */}
              <path
                d="M 210 50 L 290 80 L 330 160 L 350 240 L 310 320 L 240 370 L 190 380 L 175 320 L 195 240 Q 225 150 210 50 Z"
                fill="currentColor"
                className="text-surface2/80 hover:text-surface2 transition-colors"
                stroke="rgba(201, 168, 76, 0.35)"
                strokeWidth="2"
              />
              <text x="250" y="160" fill="currentColor" className="text-[9px] text-gold/40 font-mono font-bold tracking-widest">
                REGIÓN ORIENTAL
              </text>

              {/* Nodos Interactivos */}
              {ZONAS_OPERATIVAS.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className="cursor-pointer group"
                  >
                    {isSelected && (
                      <circle
                        cx={zone.coords.x}
                        cy={zone.coords.y}
                        r="18"
                        fill="none"
                        stroke="#c9a84c"
                        strokeWidth="1.5"
                        className="animate-ping opacity-40 origin-center"
                      />
                    )}
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r={isSelected ? "11" : "7"}
                      fill={isSelected ? "rgba(201, 168, 76, 0.3)" : "rgba(166, 227, 161, 0.25)"}
                      stroke={isSelected ? "#c9a84c" : "#a6e3a1"}
                      strokeWidth="2"
                      className="transition-all duration-200"
                    />
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r="4"
                      fill={isSelected ? "#c9a84c" : "#a6e3a1"}
                    />
                    <text
                      x={zone.coords.x + 14}
                      y={zone.coords.y + 4}
                      fill={isSelected ? "#c9a84c" : "#cbd5e1"}
                      className={`text-[11px] font-mono font-bold select-none ${isSelected ? "text-gold font-black" : ""}`}
                    >
                      {zone.name.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-3 left-4 text-[9px] font-mono text-subtext0 flex items-center gap-1">
              <Navigation className="h-3 w-3 text-gold" />
              <span>Clic para consultar tiempos de respuesta</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta de Zona Seleccionada */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                Cabecera Seleccionada
              </span>
              <h3 className="text-xl font-black text-text mt-0.5">{selectedZone.name}</h3>
              <p className="text-xs text-subtext0">{selectedZone.departamento}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green/15 text-green border border-green/30">
              {selectedZone.status}
            </span>
          </div>

          <p className="text-xs text-subtext0 leading-relaxed font-normal">
            {selectedZone.detalles}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface1 border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-gold font-semibold mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Tiempo de Respuesta</span>
              </div>
              <p className="text-sm font-black text-text font-mono">{selectedZone.sla}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface1 border border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-blue font-semibold mb-1">
                <Users className="h-3.5 w-3.5" />
                <span>Peritos en Zona</span>
              </div>
              <p className="text-sm font-black text-text font-mono">{selectedZone.peritos} evaluadores</p>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-subtext0 font-mono text-[11px]">
            <div>
              <strong className="text-text">Cobertura: </strong>
              <span>{selectedZone.ciudades.join(", ")}.</span>
            </div>
            <div>
              <strong className="text-text">Rutas: </strong>
              <span>{selectedZone.rutas}.</span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-subtext0">
            <span className="flex items-center gap-1.5 text-green font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Certificación in situ GPS</span>
            </span>
            <span className="font-mono text-gold font-bold">100% Cobertura</span>
          </div>
        </div>

      </div>
    </div>
  );
}
