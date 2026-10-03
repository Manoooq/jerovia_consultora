"use client";

import { useState } from "react";
import { DossierInteractiveViewer } from "@/components/DossierInteractiveViewer";
import { 
  Tablet, FileText, BarChart3, MapPin, Zap, 
  CheckCircle2, AlertTriangle, ShieldCheck, Check,
  Compass, ArrowRight
} from "lucide-react";

export function HeroProductShowcase() {
  const [activeTab, setActiveTab] = useState<"terminal" | "dossier" | "consola">("dossier");

  // Estados interactivos para el simulador de campo
  const [gpsSimulado, setGpsSimulado] = useState(false);
  const [inconsistenciaSimulada, setInconsistenciaSimulada] = useState(false);
  const [andeSimulado, setAndeSimulado] = useState(false);

  return (
    <div className="rounded-3xl border border-overlay0/60 bg-surface0 overflow-hidden shadow-2xl">
      {/* Barra de Selección de Perspectiva (Product-as-the-Hero) */}
      <div className="bg-mantle px-4 sm:px-6 py-3 border-b border-overlay0/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-gold animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-text">
            Simulador Operativo en Tiempo Real
          </span>
        </div>

        <div className="flex items-center gap-1 bg-surface1 p-1 rounded-2xl border border-overlay0/40">
          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "terminal"
                ? "bg-surface0 text-gold shadow-sm border border-gold/30 font-bold"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>1. Terminal en Campo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("dossier")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "dossier"
                ? "bg-surface0 text-gold shadow-sm border border-gold/30 font-bold"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>2. Legajo 5 Láminas</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("consola")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === "consola"
                ? "bg-surface0 text-gold shadow-sm border border-gold/30 font-bold"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>3. Consola Comité</span>
          </button>
        </div>
      </div>

      {/* Contenido según la pestaña seleccionada */}
      <div>
        {/* PESTAÑA 1: TERMINAL EN CAMPO */}
        {activeTab === "terminal" && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-overlay0/30">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                  Inspección Presencial · Dispositivo Móvil del Perito
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-text mt-0.5">
                  Relevamiento Domiciliario en Luque (Gran Asunción)
                </h3>
                <p className="text-xs text-subtext0">
                  Experimenta los controles técnicos en vivo que el evaluador ejecuta frente al inmueble.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green/15 text-green border border-green/30 font-mono">
                EN VIVO EN TERRENO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Botón interactivo 1: Captura GPS */}
              <div className="p-5 rounded-2xl bg-surface1 border border-overlay0/40 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-text">Fijación Satelital GPS</span>
                    <Compass className="h-4 w-4 text-gold" />
                  </div>
                  <p className="text-[11px] text-subtext0 leading-relaxed">
                    Bloquea las coordenadas de latitud/longitud en la fachada para garantizar la presencia física.
                  </p>
                  {gpsSimulado && (
                    <div className="mt-3 p-2.5 rounded-xl bg-surface0 border border-green/30 text-[11px] font-mono text-green space-y-0.5">
                      <div>GPS: -25.269932, -57.489012</div>
                      <div>Plus Code: 6867+XQ Luque</div>
                      <div className="text-[10px] text-subtext0">Precisión: ± 4 metros</div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setGpsSimulado((prev) => !prev)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                    gpsSimulado
                      ? "bg-green/10 text-green border-green/40"
                      : "bg-surface0 hover:border-gold text-text border-overlay0/60"
                  }`}
                >
                  {gpsSimulado ? "✓ Coordenadas Fijadas" : "Simular Fijación GPS"}
                </button>
              </div>

              {/* Botón interactivo 2: Verificación ANDE */}
              <div className="p-5 rounded-2xl bg-surface1 border border-overlay0/40 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-text">Medidor de Luz (ANDE)</span>
                    <Zap className="h-4 w-4 text-gold" />
                  </div>
                  <p className="text-[11px] text-subtext0 leading-relaxed">
                    Cotejo de NIS y lectura del medidor oficial para verificar si el titular reside en el domicilio.
                  </p>
                  {andeSimulado && (
                    <div className="mt-3 p-2.5 rounded-xl bg-surface0 border border-gold/30 text-[11px] font-mono text-text space-y-0.5">
                      <div>NIS: 2489102 (Verificado)</div>
                      <div>Titular: Coincidente c/ Contrato</div>
                      <div className="text-[10px] text-green font-bold">Estado: Al día / Sin cortes</div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setAndeSimulado((prev) => !prev)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                    andeSimulado
                      ? "bg-gold/10 text-gold border-gold/40"
                      : "bg-surface0 hover:border-gold text-text border-overlay0/60"
                  }`}
                >
                  {andeSimulado ? "✓ Suministro Cotejado" : "Simular Cotejo ANDE"}
                </button>
              </div>

              {/* Botón interactivo 3: Detección de Inconsistencia */}
              <div className="p-5 rounded-2xl bg-surface1 border border-overlay0/40 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-text">Control de Consistencia</span>
                    <AlertTriangle className="h-4 w-4 text-yellow" />
                  </div>
                  <p className="text-[11px] text-subtext0 leading-relaxed">
                    Comprueba en memoria si el costo del alquiler o los pasivos superan la capacidad declarada.
                  </p>
                  {inconsistenciaSimulada && (
                    <div className="mt-3 p-2.5 rounded-xl bg-red/10 border border-red/30 text-[11px] font-mono text-red space-y-0.5">
                      <div>⚠️ Alerta de Riesgo Detectada:</div>
                      <div>Alquiler (G. 2.500.000) representa el 52% del ingreso del postulante.</div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setInconsistenciaSimulada((prev) => !prev)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                    inconsistenciaSimulada
                      ? "bg-red/10 text-red border-red/40"
                      : "bg-surface0 hover:border-gold text-text border-overlay0/60"
                  }`}
                >
                  {inconsistenciaSimulada ? "Ocultar Alerta" : "Probar Alerta Financiera"}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface1/60 border border-overlay0/30 flex items-center justify-between text-xs text-subtext0">
              <span>Módulo compatible con smartphones y tablets de campo sin necesidad de instalar apps.</span>
              <button
                type="button"
                onClick={() => setActiveTab("dossier")}
                className="font-bold text-gold hover:underline flex items-center gap-1"
              >
                <span>Ver resultado en Láminas</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: LEGAJO OFICIAL EN 5 LÁMINAS */}
        {activeTab === "dossier" && (
          <div className="animate-in fade-in duration-200">
            <DossierInteractiveViewer />
          </div>
        )}

        {/* PESTAÑA 3: CONSOLA DE RIESGO PARA COMITÉ */}
        {activeTab === "consola" && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-overlay0/30">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold font-bold">
                  Panel de Supervisión · Entidad Bancaria
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-text mt-0.5">
                  Rendimiento Operativo y Tasa de Aprobación
                </h3>
                <p className="text-xs text-subtext0">
                  Vista consolidada para directores de riesgos y gerentes de créditos.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green/15 text-green border border-green/30 font-mono">
                SLA 99.4% A TIEMPO
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/30">
                <span className="text-[11px] text-subtext0 uppercase font-semibold">Expedientes Totales</span>
                <div className="text-2xl font-black font-mono text-text mt-1">124</div>
                <span className="text-[10px] text-green font-bold">100% Auditados</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/30">
                <span className="text-[11px] text-subtext0 uppercase font-semibold">Dictamen Favorable</span>
                <div className="text-2xl font-black font-mono text-green mt-1">78%</div>
                <span className="text-[10px] text-subtext0">Perfil Apto Directo</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/30">
                <span className="text-[11px] text-subtext0 uppercase font-semibold">Con Observaciones</span>
                <div className="text-2xl font-black font-mono text-yellow mt-1">16%</div>
                <span className="text-[10px] text-subtext0">Garantía adicional sugerida</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/30">
                <span className="text-[11px] text-subtext0 uppercase font-semibold">Tiempo Promedio</span>
                <div className="text-2xl font-black font-mono text-gold mt-1">14.8h</div>
                <span className="text-[10px] text-green font-bold">Meta &lt; 24h cumplida</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-surface1/60 border border-overlay0/30 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-text">
                <span>Certificación de Cumplimiento Regulatorio:</span>
                <span className="text-green font-mono">BCP & Ley 1682/01 Vigente</span>
              </div>
              <p className="text-subtext0 text-[11px] leading-relaxed">
                Todos los datos recabados en campo cuentan con cadena de custodia digital inalterable, almacenamiento en servidores locales con cifrado de grado bancario y protocolo de destrucción periódica de datos personales sensibles.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
