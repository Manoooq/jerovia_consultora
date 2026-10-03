"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Calculator, CheckCircle2, Clock, ShieldCheck, 
  MapPin, FileText, ArrowRight, Copy, Check, Sparkles
} from "lucide-react";

interface TipoPeritaje {
  id: string;
  name: string;
  basePrice: number;
  desc: string;
}

interface ZonaRecargo {
  id: string;
  name: string;
  recargo: number;
  slaBase: number; // horas
}

interface Urgencia {
  id: string;
  name: string;
  factor: number;
  slaFactor: number;
}

const TIPOS_PERITAJE: TipoPeritaje[] = [
  {
    id: "consumo",
    name: "Crédito de Consumo / Personal",
    basePrice: 280000,
    desc: "Verificación de residencia, convivencia, ingresos declarados y referencias vecinales.",
  },
  {
    id: "hipotecario",
    name: "Crédito Hipotecario / Inmueble",
    basePrice: 420000,
    desc: "Inspección técnica habitacional exhaustiva, mampostería, linderos y comprobación de NIS de ANDE.",
  },
  {
    id: "comercial",
    name: "Comercial / PYMES y Comercios",
    basePrice: 550000,
    desc: "Relevamiento de local comercial, stock observable, flujo de clientes y actividad mercantil in situ.",
  },
  {
    id: "rrhh",
    name: "Auditoría de Confianza / RRHH",
    basePrice: 320000,
    desc: "Comprobación de domicilio para cargos sensibles, caja, tesorería y referencias de linderos.",
  },
];

const ZONAS: ZonaRecargo[] = [
  { id: "asuncion", name: "Gran Asunción (Capital, Luque, San Lorenzo, Lambaré)", recargo: 0, slaBase: 24 },
  { id: "central_ext", name: "Central Exterior (Itauguá, Capiatá, Ypacaraí, Villeta)", recargo: 45000, slaBase: 28 },
  { id: "alto_parana", name: "Alto Paraná (Ciudad del Este, Hernandarias, Minga)", recargo: 110000, slaBase: 48 },
  { id: "itapua", name: "Itapúa (Encarnación, Cambyretá, Colonias Unidas)", recargo: 135000, slaBase: 48 },
  { id: "caaguazu", name: "Caaguazú y Cordillera (Coronel Oviedo, Caacupé)", recargo: 80000, slaBase: 36 },
];

const URGENCIAS: Urgencia[] = [
  { id: "estandar", name: "Estándar (24 a 48 hs hábiles)", factor: 1.0, slaFactor: 1.0 },
  { id: "prioritario", name: "Prioritario (< 18 hs hábiles)", factor: 1.25, slaFactor: 0.65 },
  { id: "mismo_dia", name: "Express Mismo Día (< 10 hs)", factor: 1.5, slaFactor: 0.4 },
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

    return {
      tipoObj: t,
      zonaObj: z,
      urgenciaObj: u,
      subtotal,
      iva,
      total,
      tiempoHoras,
    };
  }, [tipo, zona, urgencia]);

  const handleCopyBudget = () => {
    const texto = `PRESUPUESTO ESTIMADO DE PERITAJE SOCIOAMBIENTAL
Jerovia Consultora · Asunción, Paraguay
--------------------------------------------------
Servicio: ${calculo.tipoObj.name}
Zona: ${calculo.zonaObj.name}
Modalidad: ${calculo.urgenciaObj.name}
Tiempo Estimado de Entrega: < ${calculo.tiempoHoras} horas hábiles
--------------------------------------------------
Subtotal: ${calculo.subtotal.toLocaleString("es-PY")} Gs.
IVA (10%): ${calculo.iva.toLocaleString("es-PY")} Gs.
TOTAL OFICIAL: ${calculo.total.toLocaleString("es-PY")} Gs.
--------------------------------------------------
Incluye: Legajo ejecutivo en 5 láminas (.pptx/PDF), GPS Plus Code y firma con matrícula profesional.`;

    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="simulador" className="rounded-3xl border border-overlay0/40 bg-surface0 p-6 sm:p-8 shadow-sm">
      <div className="max-w-2xl mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold mb-2">
          <Calculator className="h-3.5 w-3.5" />
          <span>Simulador Oficial de Aranceles y Plazos</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
          Calcula el costo y tiempo de respuesta para tu entidad
        </h2>
        <p className="text-xs sm:text-sm text-subtext0 mt-1 leading-relaxed">
          Aranceles transparentes y estandarizados para carpetas de créditos de bancos, financieras y cooperativas en todo el país.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Parámetros de Selección (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Tipo de Peritaje */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-subtext0 mb-2.5 block">
              1. Tipo de Evaluación Requerida
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TIPOS_PERITAJE.map((item) => {
                const isSelected = tipo === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTipo(item.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text font-bold shadow-sm"
                        : "border-overlay0/30 bg-surface1/60 hover:bg-surface1 text-subtext1 hover:text-text"
                    }`}
                  >
                    <div className="font-bold text-xs text-text mb-1">{item.name}</div>
                    <div className="text-[11px] text-subtext0 leading-snug">{item.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Zona Territorial */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-subtext0 mb-2.5 block">
              2. Zona Geográfica de Inspección
            </label>
            <div className="space-y-2">
              {ZONAS.map((item) => {
                const isSelected = zona === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setZona(item.id)}
                    className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text font-bold"
                        : "border-overlay0/30 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className={`h-3.5 w-3.5 ${isSelected ? "text-gold" : "text-subtext0"}`} />
                      <span className="font-semibold text-text">{item.name}</span>
                    </div>
                    <span className="font-mono text-[11px] text-subtext0">
                      {item.recargo === 0 ? "Sin recargo de viático" : `+${item.recargo.toLocaleString("es-PY")} Gs.`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Modalidad de Urgencia */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-subtext0 mb-2.5 block">
              3. Plazo de Resolución
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {URGENCIAS.map((item) => {
                const isSelected = urgencia === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgencia(item.id)}
                    className={`p-3 rounded-xl text-center border transition-all text-xs ${
                      isSelected
                        ? "border-gold bg-gold/10 text-text font-bold"
                        : "border-overlay0/30 bg-surface1/40 hover:bg-surface1 text-subtext0 hover:text-text"
                    }`}
                  >
                    <Clock className={`h-3.5 w-3.5 mx-auto mb-1 ${isSelected ? "text-gold" : "text-subtext0"}`} />
                    <div className="font-bold text-[11px] text-text">{item.name.split("(")[0]}</div>
                    <div className="text-[10px] text-subtext0 mt-0.5">{item.name.includes("(") ? `(${item.name.split("(")[1]}` : ""}</div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Tarjeta de Liquidación y Resumen (5 cols) */}
        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-overlay0/60 bg-surface1 p-6 space-y-5 shadow-lg sticky top-24">
            
            <div className="pb-4 border-b border-overlay0/30">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                Presupuesto Oficial Estimado
              </span>
              <div className="text-3xl sm:text-4xl font-black text-text font-mono tracking-tight mt-1">
                {calculo.total.toLocaleString("es-PY")}{" "}
                <span className="text-sm font-sans text-subtext0 font-semibold">Gs.</span>
              </div>
              <p className="text-[11px] text-subtext0 mt-0.5">IVA incluido (10%) · Factura legal con RUC</p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-subtext0">
                <span>Arancel Base:</span>
                <span className="text-text">{calculo.tipoObj.basePrice.toLocaleString("es-PY")} Gs.</span>
              </div>
              {calculo.zonaObj.recargo > 0 && (
                <div className="flex justify-between text-subtext0">
                  <span>Viático de Traslado:</span>
                  <span className="text-text">+{calculo.zonaObj.recargo.toLocaleString("es-PY")} Gs.</span>
                </div>
              )}
              {calculo.urgenciaObj.factor > 1 && (
                <div className="flex justify-between text-gold">
                  <span>Recargo por Urgencia:</span>
                  <span>+{Math.round((calculo.subtotal - (calculo.tipoObj.basePrice + calculo.zonaObj.recargo))).toLocaleString("es-PY")} Gs.</span>
                </div>
              )}
              <div className="flex justify-between text-subtext0 pt-2 border-t border-overlay0/20">
                <span>Tiempo de Entrega:</span>
                <span className="text-green font-bold">&lt; {calculo.tiempoHoras} horas hábiles</span>
              </div>
            </div>

            {/* Checklist de Entregables */}
            <div className="pt-3 border-t border-overlay0/30 space-y-2 text-[11px] text-subtext0">
              <span className="text-xs font-bold text-text block mb-1">Entregable Oficial Incluido:</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0" />
                <span>Legajo ejecutivo en 5 láminas (.pptx editable y PDF)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0" />
                <span>Georreferenciación satelital GPS y Plus Code certificado</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0" />
                <span>Cotejo de NIS y medidor ANDE en el domicilio</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green shrink-0" />
                <span>Dictamen firmado con matrícula profesional N° 4.819</span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="pt-3 space-y-2">
              <button
                type="button"
                onClick={handleCopyBudget}
                className="w-full py-2.5 rounded-xl border border-overlay0/60 bg-surface0 hover:border-gold text-xs font-bold text-text flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {copied ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4 text-gold" />}
                <span>{copied ? "¡Presupuesto Copiado!" : "Copiar Presupuesto Formal"}</span>
              </button>

              <Link
                href="/entrevista/demo"
                className="w-full py-3 rounded-xl bg-gold text-black font-bold text-xs hover:bg-gold-light flex items-center justify-center gap-1.5 transition-all shadow-md text-center"
              >
                <span>Probar Formulario con Estos Parámetros</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
