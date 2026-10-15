"use client";

import { useState } from "react";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Clock, MapPin } from "lucide-react";

interface Zone {
  id: string;
  name: string;
  sla: string;
  ciudades: string[];
  coords: { x: number; y: number };
}

const ZONAS: Zone[] = [
  {
    id: "central",
    name: "Asunción y Gran Asunción",
    sla: "< 24h",
    ciudades: ["Asunción", "Luque", "San Lorenzo", "Lambaré", "Fdo. de la Mora", "Capiatá"],
    coords: { x: 195, y: 245 },
  },
  {
    id: "centro",
    name: "Cordillera y Caaguazú",
    sla: "24 - 36h",
    ciudades: ["Caacupé", "Coronel Oviedo", "Eusebio Ayala"],
    coords: { x: 248, y: 232 },
  },
  {
    id: "este",
    name: "Alto Paraná",
    sla: "24 - 48h",
    ciudades: ["Ciudad del Este", "Hernandarias", "Minga Guazú", "Pdte. Franco"],
    coords: { x: 315, y: 248 },
  },
  {
    id: "sur",
    name: "Itapúa",
    sla: "24 - 48h",
    ciudades: ["Encarnación", "Cambyretá", "Colonias Unidas"],
    coords: { x: 238, y: 342 },
  },
];

export function ParaguayOperationalMap() {
  const [selectedId, setSelectedId] = useState("central");
  const hq = ZONAS[0].coords;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* Mapa Vectorial en Cavidad Hundida */}
      <div className="lg:col-span-5 recessed-well rounded-3xl p-6 flex items-center justify-center">
        <svg viewBox="0 0 400 420" className="w-full max-w-[300px] h-auto">
          <path
            d="M 110 35 L 210 45 L 230 135 L 195 245 L 115 215 L 65 155 Z"
            fill="currentColor"
            className="text-surface1"
            stroke="rgba(148, 163, 184, 0.22)"
            strokeWidth="1.5"
          />
          <path
            d="M 210 45 L 290 75 L 330 155 L 350 240 L 310 320 L 240 370 L 190 380 L 175 320 L 195 245 Q 225 145 210 45 Z"
            fill="currentColor"
            className="text-surface2"
            stroke="rgba(212, 175, 55, 0.45)"
            strokeWidth="1.8"
          />

          {ZONAS.slice(1).map((z) => (
            <line
              key={`line-${z.id}`}
              x1={hq.x}
              y1={hq.y}
              x2={z.coords.x}
              y2={z.coords.y}
              stroke="rgba(212, 175, 55, 0.3)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
          ))}

          {ZONAS.map((z) => {
            const active = selectedId === z.id;
            return (
              <g
                key={z.id}
                onClick={() => setSelectedId(z.id)}
                onMouseEnter={() => setSelectedId(z.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={z.coords.x}
                  cy={z.coords.y}
                  r={active ? "13" : "8"}
                  fill={active ? "rgba(212, 175, 55, 0.3)" : "rgba(16, 185, 129, 0.2)"}
                  stroke={active ? "#d4af37" : "#10b981"}
                  strokeWidth="2"
                />
                <circle
                  cx={z.coords.x}
                  cy={z.coords.y}
                  r="4"
                  fill={active ? "#d4af37" : "#10b981"}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* 4 Tarjetas Regionales que brillan y se hunden */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {ZONAS.map((z) => {
          const active = selectedId === z.id;
          return (
            <SpotlightCard
              key={z.id}
              sinkIntensity={5}
              pressable
              onClick={() => setSelectedId(z.id)}
              onMouseEnter={() => setSelectedId(z.id)}
              className={`p-5 flex flex-col justify-between ${
                active ? "border-gold/80 bg-surface1/80" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-text">{z.name}</h3>
                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-gold shrink-0 tabular-nums">
                  <Clock className="h-3.5 w-3.5" /> {z.sla}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4">
                {z.ciudades.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-crust/70 border border-overlay0 text-[11px] font-medium text-subtext1"
                  >
                    <MapPin className="h-2.5 w-2.5 text-gold" />
                    {c}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
}
