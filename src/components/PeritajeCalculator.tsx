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
  Building2,
  Home,
  Briefcase,
  UserCheck,
} from "lucide-react";

const TIPOS = [
  { id: "consumo", name: "Socioambiental Personal", basePrice: 280000, icon: UserCheck },
  { id: "hipotecario", name: "Verificación de Vivienda", basePrice: 420000, icon: Home },
  { id: "comercial", name: "Comercial / PYMES", basePrice: 550000, icon: Building2 },
  { id: "rrhh", name: "Pre-Empleo Laboral", basePrice: 320000, icon: Briefcase },
];

const ZONAS = [
  { id: "asuncion", name: "Asunción y Gran Asunción", recargo: 0, slaBase: 24 },
  { id: "central_ext", name: "Central Exterior", recargo: 45000, slaBase: 28 },
  { id: "caaguazu", name: "Cordillera y Caaguazú", recargo: 80000, slaBase: 36 },
  { id: "alto_parana", name: "Alto Paraná", recargo: 110000, slaBase: 48 },
  { id: "itapua", name: "Itapúa", recargo: 135000, slaBase: 48 },
];

const URGENCIAS = [
  { id: "estandar", name: "Estándar", slaLabel: "24 - 48 hs", factor: 1.0, slaFactor: 1.0 },
  { id: "prioritario", name: "Prioritario", slaLabel: "< 18 hs", factor: 1.25, slaFactor: 0.65 },
  { id: "mismo_dia", name: "Urgente", slaLabel: "< 10 hs", factor: 1.5, slaFactor: 0.4 },
];

export function PeritajeCalculator() {
  const [tipo, setTipo] = useState("consumo");
  const [zona, setZona] = useState("asuncion");
  const [urgencia, setUrgencia] = useState("estandar");
  const [copied, setCopied] = useState(false);

  const calculo = useMemo(() => {
    const t = TIPOS.find((item) => item.id === tipo) || TIPOS[0];
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

  function handleCopy() {
    const texto = `Jerovia Consultora - Estimación de Servicio
Evaluación: ${calculo.tipoObj.name}
Zona: ${calculo.zonaObj.name}
Plazo estimado: < ${calculo.tiempoHoras} hs
Total (IVA incl.): Gs. ${calculo.total.toLocaleString("es-PY")}`;
    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="group relative rounded-3xl border border-overlay0/60 bg-surface0/85 backdrop-blur-2xl p-6 sm:p-8 shadow-xl overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(500px circle at var(--x, 50%) var(--y, 50%), rgba(212, 175, 55, 0.09), transparent 45%)",
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-5 border-b border-overlay0/40 mb-6">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
            ARANCELES REFERENCIALES
          </span>
          <h2 className="text-2xl font-black text-text tracking-tight mt-0.5">
            Simulador de Costos
          </h2>
        </div>
        <span className="text-xs text-subtext0 font-mono">Guaraníes (IVA 10% incluido)</span>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        <div className="lg:col-span-7 space-y-5">
          <div>
            <span className="text-xs font-bold text-subtext1 mb-2 block">
              1. Tipo de Visita
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TIPOS.map((item) => {
                const Icon = item.icon;
                const active = tipo === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTipo(item.id)}
                    className={`min-h-[48px] p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                      active
                        ? "border-gold bg-gold/10 text-text font-bold"
                        : "border-overlay0/50 bg-surface1/50 hover:border-overlay1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 text-xs">
                      <Icon className={`h-4 w-4 ${active ? "text-gold" : "text-subtext0"}`} />
                      <span className="text-text">{item.name}</span>
                    </span>
                    <span className="text-xs font-mono text-gold tabular-nums">
                      {(item.basePrice / 1000).toFixed(0)}k
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-subtext1 mb-2 block">
              2. Zona
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ZONAS.map((item) => {
                const active = zona === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setZona(item.id)}
                    className={`min-h-[44px] p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      active
                        ? "border-gold bg-gold/10 text-text font-bold"
                        : "border-overlay0/50 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <span className="text-text truncate pr-2">{item.name}</span>
                    <span className="font-mono text-[11px] text-subtext0 shrink-0 tabular-nums">
                      {item.recargo === 0 ? "Base" : `+${(item.recargo / 1000).toFixed(0)}k`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-subtext1 mb-2 block">
              3. Plazo
            </span>
            <div className="grid grid-cols-3 gap-2">
              {URGENCIAS.map((item) => {
                const active = urgencia === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgencia(item.id)}
                    className={`min-h-[48px] p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                      active
                        ? "border-gold bg-gold/15 text-text font-bold"
                        : "border-overlay0/50 bg-surface1/40 hover:bg-surface1 text-subtext0"
                    }`}
                  >
                    <div className="text-xs font-bold text-text">{item.name}</div>
                    <div className="text-[11px] text-gold font-mono tabular-nums">{item.slaLabel}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex">
          <div className="w-full rounded-2xl border border-gold/40 bg-mantle/90 p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold font-bold">
                  ESTIMACIÓN POR VISITA
                </span>
                <span className="flex items-center gap-1 text-xs font-mono font-bold text-green tabular-nums">
                  <Clock className="h-3.5 w-3.5" /> &lt; {calculo.tiempoHoras}h
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={calculo.total}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="text-3xl sm:text-4xl font-black text-text font-mono tabular-nums"
                >
                  Gs. {calculo.total.toLocaleString("es-PY")}
                </motion.div>
              </AnimatePresence>

              <div className="space-y-1.5 text-xs font-mono pt-3 border-t border-overlay0/40 text-subtext0 tabular-nums">
                <div className="flex justify-between">
                  <span>Neto</span>
                  <span className="text-text">Gs. {calculo.subtotal.toLocaleString("es-PY")}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (10%)</span>
                  <span className="text-text">Gs. {calculo.iva.toLocaleString("es-PY")}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-overlay0/40 space-y-1.5 text-xs text-subtext1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0" />
                  <span>Visita presencial y fotografías</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0" />
                  <span>Informe en 5 láminas (.PPTX y PDF)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[42px] w-full rounded-xl border border-overlay0/70 bg-surface1 hover:border-gold text-xs font-bold text-text flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4 text-gold" />}
                <span>{copied ? "Copiado" : "Copiar Presupuesto"}</span>
              </button>
              <Link
                href="/entrevista/demo"
                className="min-h-[42px] w-full rounded-xl bg-gold text-black font-bold text-xs hover:bg-gold-light flex items-center justify-center gap-2 transition-colors"
              >
                <span>Ver Formulario</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
