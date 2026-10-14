"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Navigation,
  Cpu,
  AlertTriangle,
  Download,
} from "lucide-react";

type TabKey = "gps" | "ia" | "pptx";

export function HeroProductShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>("gps");
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setTilt({
      rotateX: ((y - centerY) / centerY) * -3.5,
      rotateY: ((x - centerX) / centerX) * 3.5,
      glowX: (x / rect.width) * 100,
      glowY: (y / rect.height) * 100,
    });
  }

  function handleMouseLeave() {
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  }

  const tabs: { id: TabKey; label: string; metric: string; icon: React.ElementType }[] = [
    { id: "gps", label: "Telemetría GPS In Situ", metric: "±3m precisión", icon: MapPin },
    { id: "ia", label: "Auditoría Multimodal IA", metric: "Gemini 2.5", icon: Sparkles },
    { id: "pptx", label: "Dossier Comité 5 Láminas", metric: "Exportación 1-Click", icon: FileSpreadsheet },
  ];

  return (
    <div className="relative perspective-[1400px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.rotateX,
          rotateY: tilt.rotateY,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.6 }}
        style={{
          transformStyle: "preserve-3d",
          backgroundImage: `radial-gradient(650px circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(229,192,123,0.10), transparent 45%)`,
        }}
        className="rounded-3xl border border-overlay1/60 bg-surface0/85 backdrop-blur-2xl shadow-2xl overflow-hidden"
      >
        {/* Barra superior de ventana ejecutiva */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-overlay0/50 bg-mantle/70">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green/70" />
            <span className="ml-2 text-[11px] font-mono text-subtext0">
              JEROVIA-CORE // EXP-2026-8841
            </span>
          </div>

          {/* Selector interactivo de vista */}
          <div className="flex items-center gap-1.5 bg-surface1 p-1 rounded-xl border border-overlay0/50">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    active ? "text-black" : "text-subtext0 hover:text-text"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="showcase-active-pill"
                      className="absolute inset-0 rounded-lg bg-gold shadow-sm"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido dinámico con poco texto y alto impacto visual */}
        <div className="p-6 sm:p-8 min-h-[340px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeTab === "gps" && (
              <motion.div
                key="gps"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                {/* Visualizador de Radar Activo */}
                <div className="lg:col-span-7 relative h-64 rounded-2xl border border-overlay0/60 bg-crust/70 overflow-hidden flex items-center justify-center">
                  {/* Cuadrícula cartográfica */}
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(229,192,123,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(229,192,123,0.18) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                  {/* Ondas de radar animadas */}
                  {[1, 2, 3].map((ring) => (
                    <motion.div
                      key={ring}
                      initial={{ scale: 0.4, opacity: 0.7 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: ring * 0.9,
                        ease: "easeOut",
                      }}
                      className="absolute h-28 w-28 rounded-full border border-gold/50"
                    />
                  ))}

                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="h-12 w-12 rounded-2xl bg-gold text-black flex items-center justify-center shadow-xl shadow-gold/30">
                      <Navigation className="h-6 w-6" />
                    </div>
                    <div className="rounded-xl bg-mantle/90 border border-gold/40 px-3.5 py-1.5 text-center backdrop-blur-md">
                      <p className="text-xs font-black text-text">-25.2867° S, -57.6470° O</p>
                      <p className="text-[10px] font-mono text-green">
                        ✓ SEÑAL SATELITAL VERIFICADA • ASUNCIÓN
                      </p>
                    </div>
                  </div>
                </div>

                {/* KPIs directos sin relleno */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="rounded-2xl border border-overlay0/50 bg-surface1/60 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-mono uppercase text-subtext0">Estado de Ubicación</p>
                      <p className="text-base font-black text-text mt-0.5">Match Domiciliario 100%</p>
                    </div>
                    <CheckCircle2 className="h-6 w-6 text-green shrink-0" />
                  </div>

                  <div className="rounded-2xl border border-overlay0/50 bg-surface1/60 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-mono uppercase text-subtext0">Sello Temporal</p>
                      <p className="text-base font-black text-gold font-mono mt-0.5">Inmutable (EXIF + GPS)</p>
                    </div>
                    <ShieldCheck className="h-6 w-6 text-gold shrink-0" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-overlay0/40 bg-surface1/40 p-3.5">
                      <p className="text-[10px] font-mono text-subtext0 uppercase">Desviación</p>
                      <p className="text-xl font-black text-text mt-0.5">2.4 m</p>
                    </div>
                    <div className="rounded-2xl border border-overlay0/40 bg-surface1/40 p-3.5">
                      <p className="text-[10px] font-mono text-subtext0 uppercase">Tiempo en Sitio</p>
                      <p className="text-xl font-black text-green mt-0.5">24 min</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "ia" && (
              <motion.div
                key="ia"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-4"
              >
                <div className="rounded-2xl border border-gold/30 bg-surface1/60 p-5 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-gold font-bold">Visión Artificial</span>
                    <Cpu className="h-4 w-4 text-gold" />
                  </div>
                  <p className="text-lg font-black text-text">Peritaje de Fachada</p>
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-overlay0/30">
                      <span className="text-subtext0">Estructura</span>
                      <span className="font-bold text-text">Mampostería Óptima</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-overlay0/30">
                      <span className="text-subtext0">Nivel Socioeconómico</span>
                      <span className="font-bold text-gold">Medio-Alto (B1)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-subtext0">Riesgo Ambiental</span>
                      <span className="font-bold text-green">Bajo (96/100)</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-overlay0/50 bg-surface1/60 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-blue font-bold">Cruce Patrimonial</span>
                    <AlertTriangle className="h-4 w-4 text-green" />
                  </div>
                  <p className="text-lg font-black text-text">0 Inconsistencias</p>
                  <div className="space-y-2 pt-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-overlay0/30">
                      <span className="text-subtext0">Ingresos vs. Egresos</span>
                      <span className="font-bold text-green">Superávit +38%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-overlay0/30">
                      <span className="text-subtext0">Arraigo Laboral</span>
                      <span className="font-bold text-text">4.5 años verificados</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-subtext0">Referencias Vecinales</span>
                      <span className="font-bold text-green">3/3 Positivas</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-overlay0/50 bg-surface1/60 p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-green font-bold">Dictamen IA</span>
                    <p className="text-lg font-black text-text mt-1">Solvencia Confirmada</p>
                    <p className="text-xs text-subtext0 mt-2 leading-relaxed">
                      Síntesis forense generada automáticamente a partir de audio en campo, fotos y flujo financiero.
                    </p>
                  </div>
                  <div className="mt-4 rounded-xl bg-green/10 border border-green/30 px-3.5 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-green">Score Confiabilidad</span>
                    <span className="text-lg font-black font-mono text-green">94 / 100</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "pptx" && (
              <motion.div
                key="pptx"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { slide: "01", title: "Carátula & Score", desc: "Dictamen ejecutivo" },
                    { slide: "02", title: "Grupo Familiar", desc: "Arraigo y entorno" },
                    { slide: "03", title: "Balance Financiero", desc: "Liquidez y ratios" },
                    { slide: "04", title: "Inspección Visual", desc: "Fotos + Mapa GPS" },
                    { slide: "05", title: "Conclusión Pericial", desc: "Firma y matrícula" },
                  ].map((item, idx) => (
                    <motion.div
                      key={item.slide}
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.06 }}
                      className="rounded-2xl border border-overlay0/60 bg-surface1/70 p-4 flex flex-col justify-between h-36 hover:border-gold transition-colors"
                    >
                      <span className="text-xs font-mono font-bold text-gold">LÁMINA {item.slide}</span>
                      <div>
                        <p className="text-sm font-black text-text">{item.title}</p>
                        <p className="text-[11px] text-subtext0 mt-0.5">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-gold shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-text">
                      Exportación nativa lista para Comité de Crédito en formato .PPTX y PDF
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-gold uppercase">
                    Tiempo de emisión: 1.8s
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
