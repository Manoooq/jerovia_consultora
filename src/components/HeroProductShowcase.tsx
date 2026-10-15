"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MapPin,
  FileSpreadsheet,
  ClipboardCheck,
  Navigation,
  Camera,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

type TabKey = "modulos" | "campo" | "entregable";

const MODULOS_JEROVIA = [
  { num: "01", name: "Personal", desc: "Identidad y contacto" },
  { num: "02", name: "Académico", desc: "Estudios e idiomas" },
  { num: "03", name: "Laboral", desc: "Trayectoria e ingresos" },
  { num: "04", name: "Psicosocial", desc: "Perfil y proyección" },
  { num: "05", name: "Familiar", desc: "Grupo conviviente" },
  { num: "06", name: "Salud", desc: "Cobertura médica" },
  { num: "07", name: "Económico", desc: "Balance mensual" },
  { num: "08", name: "Vivienda", desc: "Fotos y punto GPS" },
  { num: "09", name: "Dictamen", desc: "Conclusión final" },
];

export function HeroProductShowcase() {
  const [activeTab, setActiveTab] = useState<TabKey>("modulos");
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // Inclinación 3D acelerada por GPU sin re-renderizar React
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el || window.innerWidth < 768) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const rx = ((y - rect.height / 2) / (rect.height / 2)) * -2.8;
      const ry = ((x - rect.width / 2) / (rect.width / 2)) * 2.8;

      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--gx", `${((x / rect.width) * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${((y / rect.height) * 100).toFixed(1)}%`);
    });
  }

  function handleMouseLeave() {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--gx", "50%");
    el.style.setProperty("--gy", "50%");
  }

  const tabs: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: "modulos", label: "9 Módulos de Relevamiento", icon: ClipboardCheck },
    { id: "campo", label: "Verificación en Domicilio", icon: MapPin },
    { id: "entregable", label: "Informe de 5 Láminas", icon: FileSpreadsheet },
  ];

  return (
    <div className="relative [perspective:1400px]">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform:
            "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateZ(0)",
          backgroundImage:
            "radial-gradient(600px circle at var(--gx, 50%) var(--gy, 50%), rgba(212, 175, 55, 0.11), transparent 45%)",
        }}
        className="rounded-3xl border border-overlay1/60 bg-surface0/85 backdrop-blur-2xl shadow-2xl overflow-hidden transition-transform duration-200 ease-out will-change-transform"
      >
        {/* Barra Superior de la Consola Jerovia */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-overlay0/50 bg-mantle/80">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
            <span className="text-xs font-bold tracking-wider uppercase text-text">
              Jerovia Consultora
            </span>
            <span className="text-xs text-subtext0 hidden md:inline">
              • Sistema de Visitas Socioambientales
            </span>
          </div>

          <div
            role="tablist"
            className="grid grid-cols-3 sm:flex items-center gap-1 bg-surface1 p-1 rounded-xl border border-overlay0/60"
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
                  className={`relative min-h-[36px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    active ? "text-black" : "text-subtext0 hover:text-text"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="jerovia-tab-pill"
                      className="absolute inset-0 rounded-lg bg-gold shadow-xs"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon className="h-3.5 w-3.5 relative z-10 shrink-0" />
                  <span className="relative z-10 truncate">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cuerpo Dinámico */}
        <div className="p-5 sm:p-8 min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeTab === "modulos" && (
              <motion.div
                key="modulos"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
                  {MODULOS_JEROVIA.map((m) => (
                    <div
                      key={m.num}
                      className="rounded-2xl border border-overlay0/60 bg-surface1/60 p-3.5 flex flex-col justify-between min-h-[108px] hover:border-gold/60 transition-colors"
                    >
                      <span className="text-xs font-mono font-bold text-gold">
                        {m.num}
                      </span>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-text">
                          {m.name}
                        </p>
                        <p className="text-[11px] text-subtext0 mt-0.5 leading-snug">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-overlay0/50 bg-surface1/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs sm:text-sm text-subtext1">
                    Formulario adaptable a celular y PC con guardado automático en cada paso.
                  </p>
                  <Link
                    href="/entrevista/demo"
                    className="min-h-[40px] px-4 py-2 rounded-xl bg-gold text-black font-bold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-gold-light transition-colors shrink-0"
                  >
                    <span>Abrir Cuestionario Demo</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}

            {activeTab === "campo" && (
              <motion.div
                key="campo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                {/* Radar visual interactivo */}
                <div className="lg:col-span-6 relative h-56 rounded-2xl border border-overlay0/60 bg-crust/80 overflow-hidden flex items-center justify-center">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(212,175,55,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.2) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  {[1, 2].map((ring) => (
                    <motion.div
                      key={ring}
                      initial={{ scale: 0.5, opacity: 0.6 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        delay: ring * 1.2,
                        ease: "easeOut",
                      }}
                      className="absolute h-24 w-24 rounded-full border border-gold/50"
                    />
                  ))}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="h-11 w-11 rounded-2xl bg-gold text-black flex items-center justify-center shadow-lg">
                      <Navigation className="h-5 w-5" />
                    </div>
                    <span className="rounded-lg bg-mantle/90 border border-gold/40 px-3 py-1 text-xs font-mono font-bold text-text">
                      Ubicación GPS + Plus Code
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-overlay0/60 bg-surface1/50 p-4 space-y-1.5">
                    <MapPin className="h-4 w-4 text-gold" />
                    <p className="text-sm font-bold text-text">Punto Exacto</p>
                    <p className="text-xs text-subtext0">
                      Captura de coordenadas desde el navegador móvil durante la visita.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-overlay0/60 bg-surface1/50 p-4 space-y-1.5">
                    <Camera className="h-4 w-4 text-gold" />
                    <p className="text-sm font-bold text-text">Registro Visual</p>
                    <p className="text-xs text-subtext0">
                      Fotografía de fachada y comprobante de servicio desde cámara o galería.
                    </p>
                  </div>
                  <div className="sm:col-span-2 rounded-2xl border border-overlay0/60 bg-surface1/50 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-text">
                        Constatación Presencial Directa
                      </p>
                      <p className="text-xs text-subtext0">
                        Relevamiento del estado real de la vivienda y del grupo familiar.
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-green shrink-0" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "entregable" && (
              <motion.div
                key="entregable"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {[
                    { slide: "01", title: "Datos Personales", desc: "Identificación y perfil" },
                    { slide: "02", title: "Entorno Familiar", desc: "Composición del hogar" },
                    { slide: "03", title: "Flujo Económico", desc: "Ingresos y egresos" },
                    { slide: "04", title: "Vivienda y GPS", desc: "Fotos y ubicación" },
                    { slide: "05", title: "Conclusión", desc: "Observaciones del perito" },
                  ].map((s) => (
                    <div
                      key={s.slide}
                      className="rounded-2xl border border-overlay0/60 bg-surface1/60 p-4 flex flex-col justify-between min-h-[120px] hover:border-gold transition-colors"
                    >
                      <span className="text-xs font-mono font-bold text-gold">
                        LÁMINA {s.slide}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-text">{s.title}</p>
                        <p className="text-xs text-subtext0 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-text">
                    Descarga directa desde el panel en formato PowerPoint (.PPTX) y versión imprimible PDF.
                  </span>
                  <span className="font-mono font-bold text-gold">
                    Jerovia Consultora
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
