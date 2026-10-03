"use client";

import { useState } from "react";
import { MapPin, Clock, ShieldCheck, Car, Users, CheckCircle2 } from "lucide-react";

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
    departamento: "Capital y Depto. Central",
    sla: "< 24 horas",
    ciudades: ["Asunción", "Luque", "San Lorenzo", "Lambaré", "Fernando de la Mora", "Capiatá", "Mariano R. Alonso"],
    rutas: "Avda. Mcal. López, Autopista Silvio Pettirossi, Ruta PY01, PY02 y PY03",
    peritos: 4,
    status: "Inmediato",
    detalles: "Base operativa permanente. Relevamiento in situ diario con movilidad propia y verificación en el mismo día hábil.",
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
    detalles: "Cobertura regional para el polo comercial e industrial de la frontera. Peritos residentes en Ciudad del Este.",
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
    detalles: "Inspecciones domiciliarias y agroindustriales en Encarnación y colonias agrícolas circundantes.",
    coords: { x: 235, y: 340 },
  },
  {
    id: "centro",
    name: "Caaguazú y Cordillera",
    departamento: "Caaguazú / Cordillera",
    sla: "24 - 36 horas",
    ciudades: ["Coronel Oviedo", "Caacupé", "Eusebio Ayala"],
    rutas: "Ruta PY02 y enlace Ruta PY08",
    peritos: 2,
    status: "Inmediato",
    detalles: "Conexión vial central para verificaciones en ciudades intermedias del interior del país.",
    coords: { x: 245, y: 235 },
  },
];

export function ParaguayOperationalMap() {
  const [selectedZone, setSelectedZone] = useState<OperationalZone>(ZONAS_OPERATIVAS[0]);

  return (
    <div className="rounded-3xl border border-overlay0/40 bg-surface0 p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Columna Izquierda: Mapa Vectorial SVG de Paraguay */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[380px] aspect-[4/5] bg-surface1/40 rounded-3xl p-4 border border-overlay0/30 flex items-center justify-center">
            
            {/* SVG simplificado de la geografía del Paraguay */}
            <svg viewBox="0 0 400 480" className="w-full h-full drop-shadow-md">
              {/* Contorno simplificado Región Occidental (Chaco) */}
              <path
                d="M 120 40 L 210 50 L 230 140 L 195 240 L 120 220 L 70 160 Z"
                fill="currentColor"
                className="text-surface2/60 transition-colors"
                stroke="rgba(180, 190, 254, 0.2)"
                strokeWidth="1.5"
              />
              <text x="110" y="140" fill="currentColor" className="text-[10px] text-subtext0/60 font-mono font-bold tracking-widest">
                CHACO
              </text>

              {/* Río Paraguay divisor */}
              <path
                d="M 210 50 Q 225 150 195 240 T 175 320 T 190 380"
                fill="none"
                stroke="#89b4fa"
                strokeWidth="2.5"
                strokeDasharray="4 2"
                opacity="0.6"
              />

              {/* Contorno simplificado Región Oriental */}
              <path
                d="M 210 50 L 290 80 L 330 160 L 350 240 L 310 320 L 240 370 L 190 380 L 175 320 L 195 240 Q 225 150 210 50 Z"
                fill="currentColor"
                className="text-surface1 transition-colors hover:text-surface2"
                stroke="rgba(249, 226, 175, 0.3)"
                strokeWidth="2"
              />
              <text x="250" y="160" fill="currentColor" className="text-[10px] text-subtext0 font-mono font-bold tracking-widest">
                REGIÓN ORIENTAL
              </text>

              {/* Nodos de Cobertura */}
              {ZONAS_OPERATIVAS.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className="cursor-pointer group"
                  >
                    {/* Anillo de pulso */}
                    {isSelected && (
                      <circle
                        cx={zone.coords.x}
                        cy={zone.coords.y}
                        r="18"
                        fill="none"
                        stroke="#f9e2af"
                        strokeWidth="1.5"
                        className="animate-ping opacity-40 origin-center"
                      />
                    )}
                    {/* Halo de selección */}
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r={isSelected ? "12" : "8"}
                      fill={isSelected ? "rgba(249, 226, 175, 0.25)" : "rgba(166, 227, 161, 0.2)"}
                      stroke={isSelected ? "#f9e2af" : "#a6e3a1"}
                      strokeWidth="2"
                      className="transition-all duration-300"
                    />
                    {/* Punto central */}
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r="4"
                      fill={isSelected ? "#f9e2af" : "#a6e3a1"}
                    />
                    {/* Etiqueta del nodo */}
                    <text
                      x={zone.coords.x + 14}
                      y={zone.coords.y + 4}
                      fill={isSelected ? "#f9e2af" : "#cdd6f4"}
                      className={`text-[11px] font-mono font-bold select-none ${isSelected ? "text-gold" : ""}`}
                    >
                      {zone.name.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-3 left-4 text-[10px] font-mono text-subtext0">
              📍 Clic en un nodo del mapa para ver detalles
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta Ejecutiva de Zona Seleccionada */}
        <div className="lg:col-span-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                Cabecera Seleccionada
              </span>
              <h3 className="text-2xl font-black text-text mt-0.5">{selectedZone.name}</h3>
              <p className="text-xs text-subtext0">{selectedZone.departamento}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green/15 text-green border border-green/30">
              {selectedZone.status}
            </span>
          </div>

          <p className="text-xs text-subtext0 leading-relaxed font-normal">
            {selectedZone.detalles}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface1 border border-overlay0/30">
              <div className="flex items-center gap-1.5 text-gold font-semibold mb-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Tiempo de Respuesta</span>
              </div>
              <p className="text-sm font-black text-text font-mono">{selectedZone.sla}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface1 border border-overlay0/30">
              <div className="flex items-center gap-1.5 text-blue font-semibold mb-1">
                <Users className="h-3.5 w-3.5" />
                <span>Peritos en Zona</span>
              </div>
              <p className="text-sm font-black text-text font-mono">{selectedZone.peritos} evaluadores</p>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 text-subtext0">
              <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-text">Municipios cubiertos: </strong>
                <span>{selectedZone.ciudades.join(", ")}.</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-subtext0">
              <Car className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-text">Vías de acceso y corredores: </strong>
                <span>{selectedZone.rutas}.</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-overlay0/30 flex items-center justify-between text-xs text-subtext0">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green" />
              <span>Georreferenciación satelital en cada visita</span>
            </span>
            <span className="font-mono text-gold font-bold">100% Cobertura</span>
          </div>
        </div>

      </div>
    </div>
  );
}
