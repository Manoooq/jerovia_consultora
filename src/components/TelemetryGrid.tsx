"use client";

import { useState } from "react";
import { 
  Zap, MapPin, Scale, Layers, CheckCircle2, 
  AlertTriangle, Compass, ShieldCheck, Download,
  Check, RefreshCw, BarChart2
} from "lucide-react";

export function TelemetryGrid() {
  // Estados interactivos para los 4 widgets
  const [meterScanActive, setMeterScanActive] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(true);
  const [ingreso, setIngreso] = useState(7500000);
  const [alquiler, setAlquiler] = useState(1800000);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const ratio = Math.round((alquiler / (ingreso || 1)) * 100);
  const riesgo = ratio <= 30 ? "bajo" : ratio <= 45 ? "medio" : "alto";

  const slidesData = [
    { num: "01", title: "Carátula y Filiación", sub: "EXP-2026-0841", color: "border-gold/40" },
    { num: "02", title: "Laboral e IPS", sub: "3a 8m de antigüedad", color: "border-blue/40" },
    { num: "03", title: "Solvencia y Egresos", sub: "Endeudamiento 24%", color: "border-green/40" },
    { num: "04", title: "Habitacional y ANDE", sub: "Mampostería / Tejas", color: "border-gold/40" },
    { num: "05", title: "Dictamen Conclusivo", sub: "Apto / Favorable", color: "border-green/40" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* ══ WIDGET 1: ANDE METER TELEMETRY ══ */}
      <div className="p-5 rounded-3xl glass-panel flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
                <Zap className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-text">Medidor ANDE</span>
            </div>
            <span className="font-mono text-[10px] text-green bg-green/10 px-2 py-0.5 rounded-full border border-green/30">
              ACTIVO
            </span>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-surface1 border border-white/[0.06] font-mono space-y-1.5 text-xs">
            <div className="text-[10px] text-subtext0 uppercase">Lectura Digital In Situ</div>
            <div className="text-xl font-black text-text tracking-widest text-center py-1 bg-surface2/60 rounded-lg border border-white/[0.04]">
              0 4 8 9 1 2 <span className="text-[10px] font-sans text-gold">kWh</span>
            </div>
            <div className="flex justify-between text-[11px] pt-1 text-subtext0">
              <span>NIS:</span>
              <strong className="text-text">2489102</strong>
            </div>
            <div className="flex justify-between text-[11px] text-subtext0">
              <span>Titularidad:</span>
              <span className="text-green font-bold">Coincidente</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setMeterScanActive(true);
            setTimeout(() => setMeterScanActive(false), 1800);
          }}
          className="w-full py-2 rounded-xl border border-white/[0.1] bg-surface1 hover:border-gold text-xs font-bold text-text flex items-center justify-center gap-1.5 transition-all"
        >
          {meterScanActive ? (
            <span className="text-gold flex items-center gap-1">
              <RefreshCw className="h-3 w-3 animate-spin" /> Verificando NIS...
            </span>
          ) : (
            <span>Probar Lectura OCR</span>
          )}
        </button>
      </div>

      {/* ══ WIDGET 2: GPS SATELITAL & PLUS CODE ══ */}
      <div className="p-5 rounded-3xl glass-panel flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-blue/15 text-blue flex items-center justify-center">
                <MapPin className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-text">GPS Satelital</span>
            </div>
            <span className="font-mono text-[10px] text-blue bg-blue/10 px-2 py-0.5 rounded-full border border-blue/30">
              ± 3.8m
            </span>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-surface1 border border-white/[0.06] font-mono space-y-1.5 text-xs">
            <div className="text-[10px] text-subtext0 uppercase">Coordenadas en Fachada</div>
            <div className="text-xs font-bold text-text bg-surface2/60 p-2 rounded-lg border border-white/[0.04]">
              -25.269932, -57.489012
            </div>
            <div className="flex justify-between text-[11px] text-subtext0 pt-1">
              <span>Plus Code:</span>
              <strong className="text-gold font-bold">6867+XQ Luque</strong>
            </div>
            <div className="flex justify-between text-[11px] text-subtext0">
              <span>Vía de Acceso:</span>
              <span className="text-text">Empedrado</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setGpsLocked((prev) => !prev)}
          className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
            gpsLocked
              ? "bg-green/10 text-green border-green/30"
              : "border-white/[0.1] bg-surface1 hover:border-gold text-text"
          }`}
        >
          {gpsLocked ? "✓ Coordenada Certificada" : "Fijar Coordenada"}
        </button>
      </div>

      {/* ══ WIDGET 3: RISK GAUGE SLIDER ══ */}
      <div className="p-5 rounded-3xl glass-panel flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-green/15 text-green flex items-center justify-center">
                <Scale className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-text">Semáforo de Riesgo</span>
            </div>
            <span
              className={`font-mono text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                riesgo === "bajo"
                  ? "bg-green/15 text-green border-green/30"
                  : riesgo === "medio"
                  ? "bg-yellow/15 text-yellow border-yellow/30"
                  : "bg-red/15 text-red border-red/30"
              }`}
            >
              {ratio}% ENDEUDA
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="flex justify-between text-[11px] text-subtext0 mb-1 font-mono">
                <span>Alquiler / Hipoteca:</span>
                <strong className="text-text">{(alquiler / 1000000).toFixed(1)}M Gs.</strong>
              </div>
              <input
                type="range"
                min="800000"
                max="4500000"
                step="100000"
                value={alquiler}
                onChange={(e) => setAlquiler(Number(e.target.value))}
                className="w-full accent-gold cursor-pointer h-1.5 bg-surface2 rounded-lg"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-surface1 border border-white/[0.06] text-center font-mono">
              <span className="text-[10px] text-subtext0 block uppercase">Diagnóstico Financiero</span>
              <span
                className={`text-xs font-black ${
                  riesgo === "bajo" ? "text-green" : riesgo === "medio" ? "text-yellow" : "text-red"
                }`}
              >
                {riesgo === "bajo"
                  ? "Capacidad de Pago Óptima"
                  : riesgo === "medio"
                  ? "Requiere Aval / Garante"
                  : "Riesgo Elevado de Mora"}
              </span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-subtext0 text-center font-mono">
          Regla: Máx 30% ingreso p/ crédito
        </div>
      </div>

      {/* ══ WIDGET 4: 5-SLIDE DECK STACK ══ */}
      <div className="p-5 rounded-3xl glass-panel flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
                <Layers className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-text">Legajo 5 Láminas</span>
            </div>
            <span className="font-mono text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
              PPTX + PDF
            </span>
          </div>

          <div className="mt-3 space-y-1.5">
            {slidesData.map((s, idx) => {
              const isSelected = activeSlideIndex === idx;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`w-full p-1.5 px-2.5 rounded-xl text-left text-xs font-mono flex items-center justify-between transition-all border ${
                    isSelected
                      ? "border-gold bg-gold/10 text-text font-bold"
                      : "border-transparent hover:bg-surface1 text-subtext0"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] text-gold">{s.num}</span>
                    <span className="truncate text-[11px]">{s.title}</span>
                  </div>
                  <span className="text-[9px] text-subtext0">{s.sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[11px] text-subtext0 font-mono">
          <span>Sello N° 4.819</span>
          <span className="text-green font-bold flex items-center gap-1">
            <Check className="h-3 w-3" /> Homologado
          </span>
        </div>
      </div>

    </div>
  );
}
