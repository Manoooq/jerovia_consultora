"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Scale,
  FileCheck,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

type ViewTab = "terreno" | "patrimonio" | "laminas";

export function HeroProductShowcase() {
  const [activeTab, setActiveTab] = useState<ViewTab>("terreno");

  const tabs: { id: ViewTab; label: string; shortLabel: string; icon: React.ElementType }[] = [
    { id: "terreno", label: "1. Verificación In Situ & ANDE", shortLabel: "In Situ", icon: MapPin },
    { id: "patrimonio", label: "2. Cruce Socioeconómico", shortLabel: "Solvencia", icon: Scale },
    { id: "laminas", label: "3. Entregable Comité (5 Láminas)", shortLabel: "5 Láminas", icon: FileSpreadsheet },
  ];

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-overlay1/60 bg-surface0/90 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Cabecera Institucional del Expediente */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-overlay0/60 bg-mantle/80">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green/10 border border-green/30 text-green text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" /> Dictamen Favorable
          </span>
          <div className="text-xs text-subtext0">
            <span className="font-semibold text-text">Expediente #2026-0419</span>
            <span className="mx-2 text-overlay2">|</span>
            <span>Solicitante: <strong className="text-text">Banca Corporativa &amp; Riesgos</strong></span>
          </div>
        </div>

        {/* Selector de vistas adaptable a celular y PC */}
        <div
          role="tablist"
          aria-label="Vistas del expediente pericial"
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
                className={`relative min-h-[38px] flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  active ? "text-black font-bold" : "text-subtext0 hover:text-text"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="active-dossier-tab"
                    className="absolute inset-0 rounded-lg bg-gold shadow-xs"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon className="h-3.5 w-3.5 relative z-10 shrink-0" />
                <span className="relative z-10 sm:hidden">{t.shortLabel}</span>
                <span className="relative z-10 hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cuerpo del Expediente */}
      <div className="p-4 sm:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "terreno" && (
            <motion.div
              key="terreno"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* Ficha Técnica de Constatación */}
              <div className="lg:col-span-7 rounded-2xl border border-overlay0/60 bg-surface1/40 p-5 flex flex-col justify-between space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-overlay0/50 pb-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-subtext0">
                      Constatación Domiciliaria Presencial
                    </p>
                    <h3 className="text-lg font-bold text-text mt-0.5">
                      Barrio Villa Morra, Asunción
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-semibold text-gold bg-gold/10 border border-gold/30 px-2.5 py-1 rounded-md tabular-nums">
                    -25.2914° S, -57.5804° O
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-surface0 border border-overlay0/50">
                    <span className="text-subtext0 block mb-1">Titularidad de Suministro (ANDE)</span>
                    <span className="font-bold text-text font-mono tabular-nums">NIS #3849102 • Activo</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface0 border border-overlay0/50">
                    <span className="text-subtext0 block mb-1">Arraigo Vecinal Confirmado</span>
                    <span className="font-bold text-text">6 años en el domicilio actual</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface0 border border-overlay0/50">
                    <span className="text-subtext0 block mb-1">Tipología Constructiva</span>
                    <span className="font-bold text-text">Residencial consolidado (Propio)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-surface0 border border-overlay0/50">
                    <span className="text-subtext0 block mb-1">Precisión GPS Registrada</span>
                    <span className="font-bold text-green tabular-nums">Desviación ±2.1 metros</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-subtext0">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-gold" />
                    Perito actuante: <strong className="text-text">Lic. Michelle Romero (Mat. 4.819)</strong>
                  </span>
                  <span className="font-mono text-[11px] tabular-nums">14/10/2026 • 10:42 hs</span>
                </div>
              </div>

              {/* Resumen de Validación de Campo */}
              <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-overlay0/60 bg-surface1/40 p-5 space-y-4">
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-subtext0">
                    Controles de Integridad Superados
                  </p>
                  {[
                    { label: "Fotografía de fachada y acceso principal", state: "Verificado" },
                    { label: "Contraste de medidor ANDE con factura", state: "Coincidente" },
                    { label: "Entrevista presencial con el titular", state: "Completada" },
                    { label: "Referencias vecinales en cuadra (2)", state: "Favorables" },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-2 py-2 border-b border-overlay0/40 text-xs"
                    >
                      <span className="text-text font-medium">{row.label}</span>
                      <span className="text-green font-semibold shrink-0 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {row.state}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/entrevista/demo"
                  className="min-h-[44px] w-full rounded-xl bg-gold text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-gold-light transition-colors shadow-sm"
                >
                  <span>Abrir Formulario de Campo (Demo)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.div>
          )}

          {activeTab === "patrimonio" && (
            <motion.div
              key="patrimonio"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-5 space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-subtext0">
                  Flujo de Caja Mensual
                </span>
                <p className="text-2xl font-bold text-text tabular-nums">
                  Gs. 14.500.000
                </p>
                <div className="space-y-2 pt-2 border-t border-overlay0/40 text-xs">
                  <div className="flex justify-between">
                    <span className="text-subtext0">Ingresos Verificados</span>
                    <span className="font-semibold text-text tabular-nums">Gs. 14.500.000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-subtext0">Egresos Operativos/Hogar</span>
                    <span className="font-semibold text-text tabular-nums">Gs. 8.200.000</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-overlay0/30">
                    <span className="text-subtext0 font-medium">Capacidad Neta</span>
                    <span className="font-bold text-green tabular-nums">Gs. 6.300.000 (43%)</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-5 space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-subtext0">
                  Estabilidad Laboral y Comercial
                </span>
                <p className="text-2xl font-bold text-text">
                  4 años, 8 meses
                </p>
                <div className="space-y-2 pt-2 border-t border-overlay0/40 text-xs">
                  <div className="flex justify-between">
                    <span className="text-subtext0">Aporte IPS / RUC</span>
                    <span className="font-semibold text-green">Activo al día</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-subtext0">Coherencia Nivel de Vida</span>
                    <span className="font-semibold text-text">Consistente</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-overlay0/30">
                    <span className="text-subtext0 font-medium">Alertas Detectadas</span>
                    <span className="font-bold text-green">0 discrepancias</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-overlay0/60 bg-surface1/40 p-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-subtext0">
                    Conclusión Técnica para Comité
                  </span>
                  <p className="text-lg font-bold text-text">
                    Riesgo Domiciliario Bajo
                  </p>
                  <p className="text-xs text-subtext0 leading-relaxed">
                    El postulante habita efectivamente la propiedad declarada. Los ingresos guardan relación directa con el equipamiento y mantenimiento del inmueble.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-overlay0/40 flex items-center justify-between text-xs">
                  <span className="font-semibold text-subtext1">Índice de Confiabilidad</span>
                  <span className="font-mono font-bold text-base text-gold tabular-nums">94 / 100</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "laminas" && (
            <motion.div
              key="laminas"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { num: "Lámina 1", title: "Carátula Ejecutiva", detail: "Datos filiatorios, score global y dictamen resumido." },
                  { num: "Lámina 2", title: "Composición Familiar", detail: "Dependientes, entorno psicosocial y referencias." },
                  { num: "Lámina 3", title: "Situación Patrimonial", detail: "Balance de ingresos, egresos y endeudamiento." },
                  { num: "Lámina 4", title: "Inspección de Vivienda", detail: "Registro fotográfico in situ, croquis y NIS ANDE." },
                  { num: "Lámina 5", title: "Dictamen Pericial", detail: "Conclusión fundada y firma con matrícula oficial." },
                ].map((slide) => (
                  <div
                    key={slide.num}
                    className="rounded-2xl border border-overlay0/60 bg-surface1/50 p-4 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-gold">{slide.num}</span>
                      <FileCheck className="h-4 w-4 text-subtext0" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">{slide.title}</p>
                      <p className="text-xs text-subtext0 mt-1 leading-relaxed">{slide.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-overlay0/60 bg-surface1/30 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-subtext1">
                  El comité recibe el archivo editable <strong>.PPTX</strong> junto al informe <strong>PDF</strong> listo para archivar en el legajo crediticio.
                </span>
                <span className="font-mono font-semibold text-gold shrink-0">
                  Generación automática desde el panel
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
