"use client";

import { useState } from "react";
import { Clock, ShieldCheck, Users, Navigation } from "lucide-react";

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
    ciudades: ["Asunción", "Luque", "San Lorenzo", "Lambaré", "Capiatá"],
    rutas: "Avda. Mcal. López, Autopista Silvio Pettirossi, Rutas PY01, PY02",
    peritos: 4,
    status: "Inmediato",
    detalles: "Base de peritos con movilidad propia y cobertura en el mismo día hábil.",
    coords: { x: 195, y: 245 },
  },
  {
    id: "este",
    name: "Alto Paraná",
    departamento: "Alto Paraná",
    sla: "24 - 48 horas",
    ciudades: ["Ciudad del Este", "Hernandarias", "Minga Guazú", "Franco"],
    rutas: "Corredor Nacional Ruta PY02",
    peritos: 2,
    status: "Programado",
    detalles: "Peritos residentes con despliegue ágil en el área metropolitana este.",
    coords: { x: 310, y: 250 },
  },
  {
    id: "sur",
    name: "Itapúa",
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
    detalles: "Conexión vial central para verificaciones en ciudades intermedias.",
    coords: { x: 245, y: 235 },
  },
];

export function ParaguayOperationalMap() {
  const [selectedZone, setSelectedZone] = useState<OperationalZone>(ZONAS_OPERATIVAS[0]);

  return (
    <div className="rounded-2xl border border-overlay0 bg-surface0 p-6 sm:p-10 shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Mapa Vectorial */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-surface1 rounded-2xl p-6 border border-overlay0 relative">
            <svg viewBox="0 0 400 480" className="w-full max-w-[320px] h-auto drop-shadow-md">
              {/* Contorno Chaco */}
              <path
                d="M 120 40 L 210 50 L 230 140 L 195 240 L 120 220 L 70 160 Z"
                fill="currentColor"
                className="text-surface2"
                stroke="var(--border-overlay0)"
                strokeWidth="1.5"
              />
              <text x="110" y="140" fill="currentColor" className="text-xs text-subtext1 font-medium select-none">
                OCCIDENTAL
              </text>

              {/* Río Paraguay divisor */}
              <path
                d="M 210 50 Q 225 150 195 240 T 175 320 T 190 380"
                fill="none"
                stroke="var(--color-blue)"
                strokeWidth="2"
                opacity="0.5"
              />

              {/* Contorno Región Oriental */}
              <path
                d="M 210 50 L 290 80 L 330 160 L 350 240 L 310 320 L 240 370 L 190 380 L 175 320 L 195 240 Q 225 150 210 50 Z"
                fill="currentColor"
                className="text-surface0"
                stroke="var(--border-overlay0)"
                strokeWidth="2"
              />

              {/* Nodos */}
              {ZONAS_OPERATIVAS.map((zone) => {
                const isSelected = selectedZone.id === zone.id;
                return (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r={isSelected ? "12" : "8"}
                      fill={isSelected ? "var(--color-gold)" : "var(--color-surface2)"}
                      className="transition-all duration-200"
                    />
                    <circle
                      cx={zone.coords.x}
                      cy={zone.coords.y}
                      r="4"
                      fill={isSelected ? "var(--color-base)" : "var(--color-text)"}
                    />
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-subtext0 bg-surface0 px-3 py-1.5 rounded-lg border border-overlay0 shadow-sm">
               <Navigation className="h-3.5 w-3.5" />
               <span>Seleccione un nodo</span>
            </div>
        </div>

        {/* Detalles de la Zona */}
        <div className="lg:col-span-7 space-y-8">
          <header className="border-b border-overlay0 pb-6">
            <h3 className="text-2xl font-bold text-text">{selectedZone.name}</h3>
            <div className="flex items-center gap-3 mt-2">
               <p className="text-sm text-subtext0">{selectedZone.departamento}</p>
               <span className="h-1 w-1 rounded-full bg-overlay1" />
               <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                 selectedZone.status === "Inmediato" ? "bg-green/10 text-green" : "bg-surface2 text-subtext0"
               }`}>
                 {selectedZone.status}
               </span>
            </div>
          </header>

          <p className="text-base text-text leading-relaxed">
            {selectedZone.detalles}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface1 border border-overlay0 flex items-start gap-3">
              <Clock className="h-5 w-5 text-subtext0 shrink-0 mt-0.5" />
              <div>
                 <p className="text-sm font-medium text-subtext0">Tiempo de Respuesta</p>
                 <p className="text-base font-semibold text-text mt-1">{selectedZone.sla}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-surface1 border border-overlay0 flex items-start gap-3">
              <Users className="h-5 w-5 text-subtext0 shrink-0 mt-0.5" />
               <div>
                 <p className="text-sm font-medium text-subtext0">Peritos Asignados</p>
                 <p className="text-base font-semibold text-text mt-1">{selectedZone.peritos} evaluadores en zona</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 text-sm">
            <div className="flex gap-2">
              <strong className="text-text w-24 shrink-0">Cobertura:</strong>
              <span className="text-subtext0">{selectedZone.ciudades.join(", ")}.</span>
            </div>
            <div className="flex gap-2">
              <strong className="text-text w-24 shrink-0">Rutas:</strong>
              <span className="text-subtext0">{selectedZone.rutas}.</span>
            </div>
          </div>

          <div className="pt-6 border-t border-overlay0 flex items-center gap-2 text-sm text-green font-medium">
            <ShieldCheck className="h-5 w-5" />
            <span>Certificación in situ con GPS garantizada en esta zona.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
