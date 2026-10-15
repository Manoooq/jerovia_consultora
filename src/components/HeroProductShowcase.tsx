"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  MapPin,
  FileSpreadsheet,
  Layers,
  Navigation,
  Camera,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

type TabKey = "inspeccion" | "estructura" | "laminas";

const MODULOS = [
  { id: "01", title: "Identidad", meta: "CI y filiación" },
  { id: "02", title: "Académico", meta: "Estudios" },
  { id: "03", title: "Laboral", meta: "Trayectoria" },
  { id: "04", title: "Psicosocial", meta: "Perfil" },
  { id: "05", title: "Familiar", meta: "Convivientes" },
  { id: "06", title: "Salud", meta: "Cobertura" },
  { id: "07", title: "Económico", meta: "Flujo mensual" },
  { id: "08", title: "Vivienda", meta: "GPS y fotos" },
  { id: "09", title: "Dictamen", meta: "Conclusión" },
];

export function HeroProductShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>("inspeccion");

  const tabs: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: "inspeccion", label: "Verificación en Sitio", icon: MapPin },
    { id: "estructura", label: "9 Módulos", icon: Layers },
    { id: "laminas", label: "5 Láminas (.PPTX / PDF)", icon: FileSpreadsheet },
  ];

  return (
    <div className="rounded-3xl border border-overlay1/60 bg-mantle/85 backdrop-blur-2xl p-3 sm:p-5 shadow-2xl">
      {/* Barra superior sobria de instrumento */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 px-2 border-b border-overlay0/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gold" />
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-text">
              JEROVIA // SISTEMA PERICIAL
            </span>
          </div>
        </div>

        <div
          role="tablist"
          className="grid grid-cols-3 sm:flex items-center gap-1 recessed-well p-1 rounded-xl"
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => setActiveTab(t.id)}
                className={`relative min-h-[36px] flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  active ? "text-black" : "text-subtext1 hover:text-text"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="console-tab"
                    className="absolute inset-0 rounded-lg bg-gold shadow-sm"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon className="h-3.5 w-3.5 relative z-10 shrink-0" />
                <span className="relative z-10 truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cavidad Hundida Principal */}
      <div className="mt-4 recessed-well rounded-2xl p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {activeTab === "inspeccion" && (
            <motion.div
              key="inspeccion"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch"
            >
              {/* Visor Satelital Hundido */}
              <div className="lg:col-span-7">
                <SpotlightCard sinkIntensity={3.5} className="p-6 flex flex-col justify-between min-h-[250px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-gold">
                      GEORREFERENCIACIÓN IN SITU
                    </span>
                    <span className="text-[11px] font-mono text-green bg-green/10 border border-green/30 px-2.5 py-0.5 rounded-md tabular-nums">
                      GPS ACTIVO
                    </span>
                  </div>

                  <div className="my-auto py-6 flex flex-col items-center justify-center relative">
                    {[1, 2].map((r) => (
                      <motion.div
                        key={r}
                        initial={{ scale: 0.6, opacity: 0.5 }}
                        animate={{ scale: 2.1, opacity: 0 }}
                        transition={{
                          duration: 2.6,
                          repeat: Infinity,
                          delay: r * 1.1,
                          ease: "easeOut",
                        }}
                        className="absolute h-20 w-20 rounded-full border border-gold/40"
                      />
                    ))}
                    <div className="h-12 w-12 rounded-2xl bg-gold/15 border border-gold/40 text-gold flex items-center justify-center shadow-inner">
                      <Navigation className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-mono font-bold text-text tabular-nums">
                      -25.2867° S, -57.6470° O
                    </p>
                    <p className="text-xs text-subtext1">
                      Asunción &amp; Gran Asunción
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-overlay0/60 pt-3 text-subtext1">
                    <span>Plus Code automático</span>
                    <Link
                      href="/entrevista/demo"
                      className="inline-flex items-center gap-1 font-bold text-gold hover:underline"
                    >
                      <span>Abrir Relevamiento</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </SpotlightCard>
              </div>

              {/* 3 Paneles Táctiles que se hunden al pasar el mouse */}
              <div className="lg:col-span-5 grid grid-cols-1 gap-3">
                <SpotlightCard sinkIntensity={5} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-subtext0">
                      UBICACIÓN
                    </span>
                    <p className="text-sm font-bold text-text mt-0.5">
                      Coordenada Satelital Directa
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-surface1 border border-overlay0 flex items-center justify-center text-gold shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                </SpotlightCard>

                <SpotlightCard sinkIntensity={5} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-subtext0">
                      EVIDENCIA
                    </span>
                    <p className="text-sm font-bold text-text mt-0.5">
                      Fachada y Comprobante ANDE
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-surface1 border border-overlay0 flex items-center justify-center text-gold shrink-0">
                    <Camera className="h-4 w-4" />
                  </div>
                </SpotlightCard>

                <SpotlightCard sinkIntensity={5} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-subtext0">
                      RESGUARDO
                    </span>
                    <p className="text-sm font-bold text-text mt-0.5">
                      Control por Rol y Auditoría
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-surface1 border border-overlay0 flex items-center justify-center text-gold shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </SpotlightCard>
              </div>
            </motion.div>
          )}

          {activeTab === "estructura" && (
            <motion.div
              key="estructura"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5"
            >
              {MODULOS.map((m) => (
                <SpotlightCard
                  key={m.id}
                  sinkIntensity={6}
                  pressable
                  className="p-3.5 flex flex-col justify-between min-h-[116px]"
                >
                  <span className="text-xs font-mono font-bold text-gold tabular-nums">
                    {m.id}
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-text">
                      {m.title}
                    </p>
                    <p className="text-[11px] text-subtext1 mt-0.5">
                      {m.meta}
                    </p>
                  </div>
                </SpotlightCard>
              ))}
            </motion.div>
          )}

          {activeTab === "laminas" && (
            <motion.div
              key="laminas"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 sm:grid-cols-5 gap-3"
            >
              {[
                { num: "01", title: "Filiación y Empleo", meta: "Módulos 1 al 3" },
                { num: "02", title: "Perfil Psicosocial", meta: "Módulo 4" },
                { num: "03", title: "Familia y Salud", meta: "Módulos 5 y 6" },
                { num: "04", title: "Economía y Vivienda", meta: "Módulos 7 y 8" },
                { num: "05", title: "Dictamen Final", meta: "Módulo 9" },
              ].map((s) => (
                <SpotlightCard
                  key={s.num}
                  sinkIntensity={5.5}
                  className="p-4 flex flex-col justify-between min-h-[130px]"
                >
                  <span className="text-[11px] font-mono font-bold text-gold">
                    LÁMINA {s.num}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text">{s.title}</p>
                    <p className="text-xs text-subtext1 mt-0.5 font-mono">
                      {s.meta}
                    </p>
                  </div>
                </SpotlightCard>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
