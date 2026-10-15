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
  { id: "01", title: "Identidad", meta: "CI y contacto" },
  { id: "02", title: "Académico", meta: "Formación" },
  { id: "03", title: "Laboral", meta: "Ocupación" },
  { id: "04", title: "Psicosocial", meta: "Proyección" },
  { id: "05", title: "Familiar", meta: "Entorno" },
  { id: "06", title: "Salud", meta: "Cobertura" },
  { id: "07", title: "Económico", meta: "Ingresos" },
  { id: "08", title: "Vivienda", meta: "GPS y fotos" },
  { id: "09", title: "Dictamen", meta: "Conclusión" },
];

export function HeroProductShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>("inspeccion");

  const tabs: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: "inspeccion", label: "Terreno", icon: MapPin },
    { id: "estructura", label: "9 Módulos", icon: Layers },
    { id: "laminas", label: "5 Láminas", icon: FileSpreadsheet },
  ];

  return (
    <div className="rounded-3xl border border-overlay1/80 bg-mantle/90 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl">
      {/* Cabecera de consola */}
      <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-overlay0/70">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gold" />
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-text">
            CONSOLA JEROVIA
          </span>
        </div>

        <div
          role="tablist"
          className="flex items-center gap-1 recessed-well p-1 rounded-xl"
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
                className={`relative min-h-[32px] flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  active ? "text-black" : "text-subtext1 hover:text-text"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="hero-console-pill"
                    className="absolute inset-0 rounded-lg bg-gold"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <Icon className="h-3.5 w-3.5 relative z-10 shrink-0" />
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chasis hundido con paneles que brillan y se hunden */}
      <div className="mt-3.5 recessed-well rounded-2xl p-3.5 sm:p-4">
        <AnimatePresence mode="wait">
          {activeTab === "inspeccion" && (
            <motion.div
              key="inspeccion"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3"
            >
              <div className="sm:col-span-7">
                <SpotlightCard sinkIntensity={6} className="p-5 flex flex-col justify-between min-h-[260px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
                      PUNTO GPS
                    </span>
                    <span className="text-[10px] font-mono font-bold text-green bg-green/10 border border-green/30 px-2 py-0.5 rounded">
                      VERIFICADO
                    </span>
                  </div>

                  <div className="my-auto py-4 flex flex-col items-center justify-center relative">
                    {[1, 2].map((r) => (
                      <motion.div
                        key={r}
                        initial={{ scale: 0.6, opacity: 0.5 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          delay: r * 1.1,
                          ease: "easeOut",
                        }}
                        className="absolute h-20 w-20 rounded-full border border-gold/45"
                      />
                    ))}
                    <div className="h-11 w-11 rounded-2xl bg-gold/15 border border-gold/40 text-gold flex items-center justify-center">
                      <Navigation className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-mono font-bold text-text tabular-nums">
                      -25.2867° S, -57.6470° O
                    </p>
                    <p className="text-[11px] text-subtext1">
                      Asunción, Paraguay
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-overlay0/60 pt-2.5">
                    <span className="text-subtext1 font-mono text-[11px]">Plus Code activo</span>
                    <Link
                      href="/entrevista/demo"
                      className="inline-flex items-center gap-1 font-bold text-gold hover:underline"
                    >
                      <span>Probar</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </SpotlightCard>
              </div>

              <div className="sm:col-span-5 grid grid-cols-1 gap-3">
                <SpotlightCard sinkIntensity={8} pressable className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold">
                      01 // CAMPO
                    </span>
                    <p className="text-sm font-bold text-text mt-0.5">
                      Coordenadas In Situ
                    </p>
                  </div>
                  <MapPin className="h-4 w-4 text-gold shrink-0" />
                </SpotlightCard>

                <SpotlightCard sinkIntensity={8} pressable className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold">
                      02 // EVIDENCIA
                    </span>
                    <p className="text-sm font-bold text-text mt-0.5">
                      Fachada y Suministro
                    </p>
                  </div>
                  <Camera className="h-4 w-4 text-gold shrink-0" />
                </SpotlightCard>

                <SpotlightCard sinkIntensity={8} pressable className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold">
                      03 // ACCESO
                    </span>
                    <p className="text-sm font-bold text-text mt-0.5">
                      Roles y Auditoría
                    </p>
                  </div>
                  <ShieldCheck className="h-4 w-4 text-gold shrink-0" />
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
              transition={{ duration: 0.16 }}
              className="grid grid-cols-3 gap-2.5"
            >
              {MODULOS.map((m) => (
                <SpotlightCard
                  key={m.id}
                  sinkIntensity={8}
                  pressable
                  className="p-3.5 flex flex-col justify-between min-h-[78px]"
                >
                  <span className="text-[10px] font-mono font-bold text-gold tabular-nums">
                    {m.id}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-text truncate">{m.title}</p>
                    <p className="text-[10px] text-subtext1 truncate">{m.meta}</p>
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
              transition={{ duration: 0.16 }}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2.5"
            >
              {[
                { num: "01", title: "Filiación", meta: "Personal y laboral" },
                { num: "02", title: "Psicosocial", meta: "Perfil y metas" },
                { num: "03", title: "Familia", meta: "Hogar y salud" },
                { num: "04", title: "Vivienda", meta: "Economía y GPS" },
                { num: "05", title: "Dictamen", meta: "Firma del perito" },
              ].map((s) => (
                <SpotlightCard
                  key={s.num}
                  sinkIntensity={8}
                  pressable
                  className="p-4 flex flex-col justify-between min-h-[260px]"
                >
                  <span className="text-xs font-mono font-bold text-gold">
                    LÁMINA {s.num}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text">{s.title}</p>
                    <p className="text-[11px] text-subtext1 mt-1">{s.meta}</p>
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
