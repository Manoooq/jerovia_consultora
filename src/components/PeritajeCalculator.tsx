"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

interface TipoPeritaje {
  id: string;
  name: string;
  detail: string;
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
  { id: "consumo", name: "Crédito de Consumo", detail: "Banca Personas / Cooperativas", basePrice: 280000, icon: UserCheck },
  { id: "hipotecario", name: "Crédito Hipotecario", detail: "Vivienda y Garantía Real", basePrice: 420000, icon: Home },
  { id: "comercial", name: "Comercial y PYMES", detail: "Inspección de Negocio + Domicilio", basePrice: 550000, icon: Building2 },
  { id: "rrhh", name: "Pre-Empleo Crítico", detail: "Cargos Financieros y Tesorería", basePrice: 320000, icon: Briefcase },
];

const ZONAS: ZonaRecargo[] = [
  { id: "asuncion", name: "Asunción y Gran Asunción", sub: "Luque, San Lorenzo, Lambaré, Fdo. de la Mora", recargo: 0, slaBase: 24 },
  { id: "central_ext", name: "Central Exterior", sub: "Capiatá, Itauguá, Ñemby, Villa Elisa", recargo: 45000, slaBase: 28 },
  { id: "caaguazu", name: "Cordillera y Caaguazú", sub: "Caacupé, Coronel Oviedo", recargo: 80000, slaBase: 36 },
  { id: "alto_parana", name: "Alto Paraná", sub: "Ciudad del Este, Hernandarias, Franco", recargo: 110000, slaBase: 48 },
  { id: "itapua", name: "Itapúa", sub: "Encarnación, Cambyretá, Colonias Unidas", recargo: 135000, slaBase: 48 },
];

const URGENCIAS: Urgencia[] = [
  { id: "estandar", name: "Estándar", slaLabel: "24 a 48 hs", factor: 1.0, slaFactor: 1.0 },
  { id: "prioritario", name: "Prioritario", slaLabel: "< 18 hs", factor: 1.25, slaFactor: 0.65 },
  { id: "mismo_dia", name: "Express en el Día", slaLabel: "< 10 hs", factor: 1.5, slaFactor: 0.4 },
];

export function PeritajeCalculator() {
  const [tipo, setTipo] = useState<string>("consumo");
  const [zona, setZona] = useState<string>("asuncion");
  const [urgencia, setUrgencia] = useState<string>("estandar");
  const [convenioVolumen, setConvenioVolumen] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const calculo = useMemo(() => {
    const t = TIPOS_PERITAJE.find((item) => item.id === tipo) || TIPOS_PERITAJE[0];
    const z = ZONAS.find((item) => item.id === zona) || ZONAS[0];
    const u = URGENCIAS.find((item) => item.id === urgencia) || URGENCIAS[0];

    const descuentoFactor = convenioVolumen ? 0.85 : 1.0; // 15% descuento por convenio corporativo
    const subtotal = Math.round((t.basePrice + z.recargo) * u.factor * descuentoFactor);
    const iva = Math.round(subtotal * 0.1);
    const total = subtotal + iva;
    const tiempoHoras = Math.round(z.slaBase * u.slaFactor);

    return { tipoObj: t, zonaObj: z, urgenciaObj: u, subtotal, iva, total, tiempoHoras };
  }, [tipo, zona, urgencia, convenioVolumen]);

  function handleCopyBudget() {
    const texto = `COTIZACIÓN PERICIAL - JEROVIA CONSULTORA
Servicio: ${calculo.tipoObj.name} (${calculo.tipoObj.detail})
Cobertura: ${calculo.zonaObj.name}
Plazo SLA: < ${calculo.tiempoHoras} horas hábiles (${calculo.urgenciaObj.name})
Modalidad: ${convenioVolumen ? "Convenio Corporativo (>20 casos/mes)" : "Arancel Unitario"}
Total con IVA (10%): Gs. ${calculo.total.toLocaleString("es-PY")}`;

    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-overlay0/60 bg-surface0/90 backdrop-blur-xl p-5 sm:p-8 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-overlay0/50 mb-6">
        <div>
          <span className="text-xs font-semibold text-gold">
            Simulador de Aranceles
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text tracking-tight mt-0.5">
            Cotización por Expediente y Zona
          </h2>
        </div>

        {/* Switch de Convenio Bancario */}
        <label className="inline-flex items-center gap-2.5 cursor-pointer select-none rounded-xl border border-overlay0/60 bg-surface1 px-3.5 py-2 text-xs">
          <input
            type="checkbox"
            checked={convenioVolumen}
            onChange={(e) => setConvenioVolumen(e.target.checked)}
            className="rounded border-overlay1 text-gold focus:ring-gold h-4 w-4"
          />
          <span className="font-semibold text-text">Tarifa Convenio (&gt;20 visitas/mes: -15%)</span>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Tipo */}
          <div>
            <label className="text-xs font-semibold text-subtext1 mb-2 block">
              1. Tipo de Evaluación Requerida
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TIPOS_PERITAJE.map((item) => {
                const Icon = item.icon;
                const isSelected = tipo === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTipo(item.id)}
                    className={`min-h-[54px] p-3.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text"
                        : "border-overlay0/50 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-gold" : "text-subtext0"}`} />
                      <div className="truncate">
                        <p className="text-xs font-bold text-text truncate">{item.name}</p>
                        <p className="text-[11px] text-subtext0 truncate">{item.detail}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold text-text tabular-nums shrink-0">
                      {(item.basePrice / 1000).toFixed(0)}k
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Zona */}
          <div>
            <label className="text-xs font-semibold text-subtext1 mb-2 block">
              2. Jurisdicción Geográfica
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ZONAS.map((item) => {
                const isSelected = zona === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setZona(item.id)}
                    className={`min-h-[48px] p-3 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text"
                        : "border-overlay0/50 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <div className="truncate">
                      <p className="text-xs font-bold text-text truncate">{item.name}</p>
                      <p className="text-[10px] text-subtext0 truncate">{item.sub}</p>
                    </div>
                    <span className="font-mono text-[11px] font-semibold text-subtext1 shrink-0 tabular-nums">
                      {item.recargo === 0 ? "Sin viático" : `+${(item.recargo / 1000).toFixed(0)}k`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Plazo */}
          <div>
            <label className="text-xs font-semibold text-subtext1 mb-2 block">
              3. Nivel de Urgencia (SLA)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {URGENCIAS.map((item) => {
                const isSelected = urgencia === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgencia(item.id)}
                    className={`min-h-[48px] p-3 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text font-bold"
                        : "border-overlay0/50 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <div className="font-bold text-xs text-text">{item.name}</div>
                    <div className="text-[11px] text-subtext0 font-mono tabular-nums">{item.slaLabel}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Liquidación Derecha */}
        <div className="lg:col-span-5 flex">
          <div className="w-full rounded-2xl border border-overlay1/70 bg-mantle p-5 sm:p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-subtext0">
                  Arancel Total por Expediente
                </span>
                {convenioVolumen && (
                  <span className="text-[11px] font-semibold text-green bg-green/10 border border-green/30 px-2 py-0.5 rounded">
                    Convenio -15%
                  </span>
                )}
              </div>

              <div className="text-3xl sm:text-4xl font-black text-text font-mono tabular-nums tracking-tight">
                Gs. {calculo.total.toLocaleString("es-PY")}
              </div>

              <div className="flex items-center gap-1.5 text-green text-xs font-semibold">
                <Clock className="h-4 w-4 shrink-0" />
                <span>Entrega comprometida en menos de {calculo.tiempoHoras} horas hábiles</span>
              </div>

              <div className="space-y-1.5 text-xs pt-3 border-t border-overlay0/50 tabular-nums">
                <div className="flex justify-between text-subtext0">
                  <span>Honorario base + movilidad</span>
                  <span className="text-text font-mono">Gs. {calculo.subtotal.toLocaleString("es-PY")}</span>
                </div>
                <div className="flex justify-between text-subtext0">
                  <span>IVA (10%)</span>
                  <span className="text-text font-mono">Gs. {calculo.iva.toLocaleString("es-PY")}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-overlay0/50 space-y-2 text-xs text-subtext1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                  <span>Informe de 5 láminas (.PPTX) y documento PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                  <span>Georreferenciación GPS y verificación ANDE</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold shrink-0" />
                  <span>Firma de perito matriculado (Reg. N° 4.819)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleCopyBudget}
                className="min-h-[44px] w-full rounded-xl border border-overlay0/80 bg-surface1 hover:border-gold text-xs font-semibold text-text flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4 text-gold" />}
                <span>{copied ? "Presupuesto copiado al portapapeles" : "Copiar Resumen de Cotización"}</span>
              </button>

              <Link
                href="/entrevista/demo"
                className="min-h-[44px] w-full rounded-xl bg-gold text-black font-bold text-xs hover:bg-gold-light flex items-center justify-center gap-2 transition-colors"
              >
                <span>Ver Formulario de Relevamiento</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
