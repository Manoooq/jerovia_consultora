"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  TrendingUp, 
  PieChart as PieIcon, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  Clock,
  Sparkles
} from "lucide-react";

interface MetricsChartsProps {
  totalExpedientes?: number;
  completadas?: number;
}

export function MetricsCharts({ totalExpedientes = 124, completadas = 108 }: MetricsChartsProps) {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  // Datos de dictámenes
  const dictamenes = [
    { id: "fav", label: "Favorable", pct: 78, count: 84, color: "#a6e3a1", icon: CheckCircle2 },
    { id: "obs", label: "Favorable c/ Obs.", pct: 16, count: 18, color: "#f9e2af", icon: AlertTriangle },
    { id: "desf", label: "Desfavorable", pct: 6, count: 6, color: "#f38ba8", icon: XCircle },
  ];

  // Cálculo SVG Donut
  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.3
  let cumulativePct = 0;

  // Datos mensuales
  const monthlyData = [
    { mes: "May", vol: 18, turnaround: "19h" },
    { mes: "Jun", vol: 24, turnaround: "17h" },
    { mes: "Jul", vol: 29, turnaround: "18h" },
    { mes: "Ago", vol: 32, turnaround: "16h" },
    { mes: "Set", vol: 38, turnaround: "15h" },
    { mes: "Oct", vol: 42, turnaround: "14h", current: true },
  ];
  const maxVol = Math.max(...monthlyData.map((d) => d.vol));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* ══ 1. MEDIDOR DE ÍNDICE DE CONFIABILIDAD (GAUGE RADIAL) ══ */}
      <div className="rounded-3xl border border-overlay0/40 bg-surface0 p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">Auditoría Cuantitativa</span>
            <h3 className="text-sm font-bold text-text">Índice de Confiabilidad</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green/15 text-green border border-green/30">
            Grado AAA
          </span>
        </div>

        {/* Gauge SVG Semi-circular */}
        <div className="relative flex flex-col items-center justify-center my-4">
          <svg className="w-48 h-28 overflow-visible" viewBox="0 0 100 55">
            {/* Arco de fondo */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="rgba(180, 190, 254, 0.12)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Arco de progreso animado (96.4%) */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="9"
              strokeDasharray="125.6"
              strokeDashoffset="8.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f9e2af" />
                <stop offset="100%" stopColor="#a6e3a1" />
              </linearGradient>
            </defs>
          </svg>

          <div className="text-center -mt-6">
            <div className="text-3xl font-black text-text font-mono tracking-tight">96.4%</div>
            <p className="text-[11px] font-semibold text-green flex items-center justify-center gap-1 mt-0.5">
              <ShieldCheck className="h-3 w-3" /> Máxima Coherencia Pericial
            </p>
          </div>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-overlay0/30 text-[11px] text-subtext0">
          <div className="flex justify-between">
            <span>Consistencia Ingresos vs Egresos:</span>
            <strong className="text-text font-mono">98.2%</strong>
          </div>
          <div className="flex justify-between">
            <span>Georreferenciación GPS Precisa:</span>
            <strong className="text-text font-mono">99.1%</strong>
          </div>
          <div className="flex justify-between">
            <span>Aportes y Referencias Confirmadas:</span>
            <strong className="text-text font-mono">94.8%</strong>
          </div>
        </div>
      </div>

      {/* ══ 2. DISTRIBUCIÓN DE DICTÁMENES (DONUT SVG INTERACTIVO) ══ */}
      <div className="rounded-3xl border border-overlay0/40 bg-surface0 p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">Comité Evaluador</span>
            <h3 className="text-sm font-bold text-text">Resolución de Dictámenes</h3>
          </div>
          <PieIcon className="h-4 w-4 text-gold" />
        </div>

        <div className="flex items-center justify-center gap-6 my-2">
          {/* Gráfico Donut SVG */}
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {dictamenes.map((item) => {
                const strokeDasharray = `${(item.pct / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((cumulativePct / 100) * circumference);
                cumulativePct += item.pct;

                return (
                  <circle
                    key={item.id}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                    onMouseEnter={() => setActiveSegment(item.id)}
                    onMouseLeave={() => setActiveSegment(null)}
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-text font-mono">{completadas}</span>
              <span className="text-[9px] uppercase tracking-wider text-subtext0">Emitidos</span>
            </div>
          </div>

          {/* Leyenda Interactiva */}
          <div className="space-y-2 flex-1">
            {dictamenes.map((item) => {
              const isHovered = activeSegment === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveSegment(item.id)}
                  onMouseLeave={() => setActiveSegment(null)}
                  className={`p-1.5 rounded-xl transition-colors cursor-pointer text-xs ${
                    isHovered ? "bg-surface1" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-text font-medium truncate text-[11px]">{item.label}</span>
                    </div>
                    <span className="font-mono font-bold text-text text-[11px]">{item.pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-subtext0 pt-3 border-t border-overlay0/30 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-gold" />
          <span>Fórmulas validadas conforme a directrices de riesgo crediticio.</span>
        </p>
      </div>

      {/* ══ 3. TIEMPO DE RESPUESTA Y VOLUMEN MENSUAL ══ */}
      <div className="rounded-3xl border border-overlay0/40 bg-surface0 p-6 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">Velocidad Operativa</span>
            <h3 className="text-sm font-bold text-text">Ciclo de Peritaje (SLA)</h3>
          </div>
          <span className="text-xs font-mono font-bold text-green flex items-center gap-1">
            <Clock className="h-3 w-3" /> Prom: 14.8h
          </span>
        </div>

        {/* Barras de volumen y tiempo */}
        <div className="my-3">
          <div className="flex items-end justify-between h-28 gap-2 pt-4 px-1">
            {monthlyData.map((d) => {
              const heightPct = Math.round((d.vol / maxVol) * 100);
              return (
                <div key={d.mes} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <span className="text-[9px] font-mono text-subtext0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.turnaround}
                  </span>
                  <div className="w-full bg-surface2/60 rounded-t-lg relative flex items-end h-20 overflow-hidden">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        d.current
                          ? "bg-gradient-to-t from-gold/70 to-gold"
                          : "bg-surface3 group-hover:bg-blue/50"
                      }`}
                    />
                  </div>
                  <span className={`text-[10px] font-mono ${d.current ? "text-gold font-bold" : "text-subtext0"}`}>
                    {d.mes}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-overlay0/30 text-[11px] text-subtext0">
          <span>Cumplimiento SLA &lt; 24hs:</span>
          <strong className="text-green font-mono font-bold">99.4% a tiempo</strong>
        </div>
      </div>
    </div>
  );
}
