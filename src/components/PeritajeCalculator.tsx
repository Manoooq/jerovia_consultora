"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ArrowRight,
  Zap,
  Building2,
  Home,
  Briefcase,
  UserCheck,
} from "lucide-react";

interface TipoPeritaje {
  id: string;
  name: string;
  tag: string;
  basePrice: number;
  icon: React.ElementType;
}

interface ZonaRecargo {
  id: string;
  name: string;
  sub: string;
  recargo: number;
  slaBase: number;
}

interface Urgencia {
  id: string;
  name: string;
  slaLabel: string;
  factor: number;
  slaFactor: number;
}

const TIPOS_PERITAJE: TipoPeritaje[] = [
  { id: "consumo", name: "Crédito Consumo", tag: "Banca Personas", basePrice: 280000, icon: UserCheck },
  { id: "hipotecario", name: "Hipotecario / Vivienda", tag: "Inmuebles", basePrice: 420000, icon: Home },
  { id: "comercial", name: "Comercial / PYMES", tag: "Corporativo", basePrice: 550000, icon: Building2 },
  { id: "rrhh", name: "Ingreso Crítico RRHH", tag: "Alta Dirección", basePrice: 320000, icon: Briefcase },
];

const ZONAS: ZonaRecargo[] = [
  { id: "asuncion", name: "Asunción & Gran Asunción", sub: "Luque, San Lorenzo, Lambaré", recargo: 0, slaBase: 24 },
  { id: "central_ext", name: "Central Exterior", sub: "Capiatá, Itauguá, Ñemby", recargo: 45000, slaBase: 28 },
  { id: "caaguazu", name: "Cordillera & Caaguazú", sub: "Caacupé, Cnel. Oviedo", recargo: 80000, slaBase: 36 },
  { id: "alto_parana", name: "Alto Paraná", sub: "CDE, Hernandarias, Franco", recargo: 110000, slaBase: 48 },
  { id: "itapua", name: "Itapúa", sub: "Encarnación, Colonias Unidas", recargo: 135000, slaBase: 48 },
];

const URGENCIAS: Urgencia[] = [
  { id: "estandar", name: "Estándar", slaLabel: "24 - 48 hs", factor: 1.0, slaFactor: 1.0 },
  { id: "prioritario", name: "Prioritario", slaLabel: "< 18 hs", factor: 1.25, slaFactor: 0.65 },
  { id: "mismo_dia", name: "Express Hoy", slaLabel: "< 10 hs", factor: 1.5, slaFactor: 0.4 },
];

export function PeritajeCalculator() {
  const [tipo, setTipo] = useState<string>("consumo");
  const [zona, setZona] = useState<string>("asuncion");
  const [urgencia, setUrgencia] = useState<string>("estandar");
  const [copied, setCopied] = useState(false);

  const calculo = useMemo(() => {
    const t = TIPOS_PERITAJE.find((item) => item.id === tipo) || TIPOS_PERITAJE[0];
    const z = ZONAS.find((item) => item.id === zona) || ZONAS[0];
    const u = URGENCIAS.find((item) => item.id === urgencia) || URGENCIAS[0];

    const subtotal = Math.round((t.basePrice + z.recargo) * u.factor);
    const iva = Math.round(subtotal * 0.1);
    const total = subtotal + iva;
    const tiempoHoras = Math.round(z.slaBase * u.slaFactor);

    return { tipoObj: t, zonaObj: z, urgenciaObj: u, subtotal, iva, total, tiempoHoras };
  }, [tipo, zona, urgencia]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }

  function handleCopyBudget() {
    const texto = `COTIZACIÓN PERICIAL • JEROVIA CONSULTORA
Servicio: ${calculo.tipoObj.name}
Zona: ${calculo.zonaObj.name}
SLA Garantizado: < ${calculo.tiempoHoras} hs (${calculo.urgenciaObj.name})
Total IVA incl.: ${calculo.total.toLocaleString("es-PY")} Gs.`;

    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      onMouseMove={handleMouseMove}
      className="group relative rounded-3xl border border-overlay0/60 bg-surface0/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl overflow-hidden"
    >
      {/* Spotlight que sigue al cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(550px circle at var(--x, 50%) var(--y, 50%), rgba(229, 192, 123, 0.10), transparent 45%)",
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-6 border-b border-overlay0/40 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
            TARIFARIO CORPORATIVO TRANSPARENTE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
            Cotizador Instantáneo de Peritajes
          </h2>
        </div>
        <span className="text-xs text-subtext0 font-mono">Valores expresados en Guaraníes (IVA 10% incl.)</span>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Selectores interactivos (7 cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          {/* 1. Categoría */}
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-subtext0 mb-2.5 block">
              01 // Modalidad de Riesgo
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TIPOS_PERITAJE.map((item) => {
                const Icon = item.icon;
                const isSelected = tipo === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTipo(item.id)}
                    className={`relative p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text shadow-sm"
                        : "border-overlay0/40 bg-surface1/50 hover:border-overlay1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected ? "bg-gold text-black" : "bg-surface2 text-subtext0"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-text">{item.name}</p>
                        <p className="text-[10px] font-mono text-subtext0">{item.tag}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-gold">
                      {(item.basePrice / 1000).toFixed(0)}k
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Cobertura */}
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-subtext0 mb-2.5 block">
              02 // Despliegue Territorial
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ZONAS.map((item) => {
                const isSelected = zona === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setZona(item.id)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text font-bold"
                        : "border-overlay0/40 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="text-xs font-bold text-text truncate">{item.name}</p>
                      <p className="text-[10px] text-subtext0 truncate">{item.sub}</p>
                    </div>
                    <span className="font-mono text-[10px] font-bold text-gold shrink-0">
                      {item.recargo === 0 ? "SIN VIÁTICO" : `+${(item.recargo / 1000).toFixed(0)}k`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. SLA */}
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-subtext0 mb-2.5 block">
              03 // Velocidad de Despacho (SLA)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              {URGENCIAS.map((item) => {
                const isSelected = urgencia === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgencia(item.id)}
                    className={`relative p-3 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? "border-gold bg-gold/15 text-text font-bold shadow-sm"
                        : "border-overlay0/40 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <div className="font-black text-xs text-text">{item.name}</div>
                    <div className="text-[10px] text-gold font-mono font-bold mt-0.5">{item.slaLabel}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tarjeta de Liquidación Reactiva (5 cols) */}
        <div className="lg:col-span-5 flex">
          <div className="w-full rounded-3xl border border-gold/40 bg-mantle/90 p-6 sm:p-7 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold px-2.5 py-1 rounded-full bg-gold/10 border border-gold/30">
                  ARANCEL FINAL
                </span>
                <span className="flex items-center gap-1 text-xs font-mono font-bold text-green">
                  <Zap className="h-3.5 w-3.5" /> &lt; {calculo.tiempoHoras}h hábiles
                </span>
              </div>

              {/* Precio con transición animada */}
              <div className="pt-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={calculo.total}
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="text-4xl sm:text-5xl font-black text-text font-mono tracking-tight"
                  >
                    {calculo.total.toLocaleString("es-PY")}
                    <span className="text-sm font-sans text-gold font-bold ml-1.5">Gs.</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="space-y-2 text-xs font-mono pt-3 border-t border-overlay0/40 text-subtext0">
                <div className="flex justify-between">
                  <span>Arancel Neto</span>
                  <span className="text-text font-bold">{calculo.subtotal.toLocaleString("es-PY")} Gs.</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA Crédito (10%)</span>
                  <span className="text-text font-bold">{calculo.iva.toLocaleString("es-PY")} Gs.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-overlay0/40 space-y-2 text-xs">
                {[
                  "Dossier Comité 5 Láminas (.PPTX + PDF)",
                  "Telemetría GPS + Verificación NIS ANDE",
                  "Firma Pericial Matrícula N° 4.819",
                ].map((inc) => (
                  <div key={inc} className="flex items-center gap-2 text-text font-medium">
                    <CheckCircle2 className="h-4 w-4 text-green shrink-0" />
                    <span>{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 space-y-2.5">
              <button
                type="button"
                onClick={handleCopyBudget}
                className="w-full py-2.5 rounded-xl border border-overlay0/70 bg-surface1 hover:border-gold text-xs font-bold text-text flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4 text-gold" />}
                <span>{copied ? "Presupuesto Copiado" : "Copiar Cotización para Comité"}</span>
              </button>

              <Link
                href="/entrevista/demo"
                className="w-full py-3 rounded-xl bg-gold text-black font-bold text-xs hover:bg-gold-light flex items-center justify-center gap-2 transition-all shadow-lg shadow-gold/20"
              >
                <span>Ejecutar Simulación Demo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
