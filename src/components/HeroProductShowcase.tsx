"use client";

import { useState } from "react";
import { DossierInteractiveViewer } from "@/components/DossierInteractiveViewer";
import { 
  Tablet, FileText, BarChart3, 
  Zap, AlertTriangle, Compass, ArrowRight
} from "lucide-react";

export function HeroProductShowcase() {
  const [activeTab, setActiveTab] = useState<"dossier" | "terminal" | "consola">("dossier");

  // Estados interactivos para el simulador de campo
  const [gpsSimulado, setGpsSimulado] = useState(false);
  const [inconsistenciaSimulada, setInconsistenciaSimulada] = useState(false);
  const [andeSimulado, setAndeSimulado] = useState(false);

  return (
    <div className="rounded-3xl border border-overlay0/60 bg-surface0 overflow-hidden shadow-2xl">
      {/* Selector de Perspectiva (Product-as-the-Hero) */}
      <div className="bg-mantle px-4 sm:px-6 py-2.5 border-b border-overlay0/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-text">
            Plataforma Pericial en Vivo
          </span>
        </div>

        <div className="flex items-center gap-1 bg-surface1 p-1 rounded-2xl border border-overlay0/40">
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
            <span>1. Legajo 5 Láminas</span>
          </button>

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
            <span>2. Terminal en Campo</span>
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
        {/* PESTAÑA 1: LEGAJO OFICIAL EN 5 LÁMINAS */}
        {activeTab === "dossier" && (
          <div className="animate-in fade-in duration-150">
            <DossierInteractiveViewer />
          </div>
        )}

        {/* PESTAÑA 2: TERMINAL EN CAMPO (CONCISO, SIN RELLENO) */}
        {activeTab === "terminal" && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
              <div>
                <h3 className="text-lg font-bold text-text">
                  Relevamiento in situ · Luque, Central
                </h3>
                <p className="text-xs text-subtext0">
                  Controles técnicos ejecutados en la puerta del inmueble.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green/15 text-green border border-green/30 font-mono">
                EN TERRENO
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Botón interactivo 1: Captura GPS */}
              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">Georreferenciación GPS</span>
                    <Compass className="h-4 w-4 text-gold" />
                  </div>
                  <p className="text-[11px] text-subtext0 mt-1">
                    Fijación satelital en fachada (precisión ± 4m).
                  </p>
                  {gpsSimulado && (
                    <div className="mt-2.5 p-2 rounded-xl bg-surface0 border border-green/30 text-[11px] font-mono text-green space-y-0.5">
                      <div>-25.269932, -57.489012</div>
                      <div className="text-[10px] text-subtext0">Plus Code: 6867+XQ Luque</div>
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
                  {gpsSimulado ? "✓ GPS Fijado" : "Probar Fijación GPS"}
                </button>
              </div>

              {/* Botón interactivo 2: Verificación ANDE */}
              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">Medidor ANDE (NIS)</span>
                    <Zap className="h-4 w-4 text-gold" />
                  </div>
                  <p className="text-[11px] text-subtext0 mt-1">
                    Cotejo de NIS y suministro activo en el domicilio.
                  </p>
                  {andeSimulado && (
                    <div className="mt-2.5 p-2 rounded-xl bg-surface0 border border-gold/30 text-[11px] font-mono text-text space-y-0.5">
                      <div>NIS: 2489102 · Al día</div>
                      <div className="text-[10px] text-green font-bold">Titular coincidente</div>
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
                  {andeSimulado ? "✓ ANDE Verificado" : "Probar Cotejo ANDE"}
                </button>
              </div>

              {/* Botón interactivo 3: Control de Consistencia */}
              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/40 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text">Control de Solvencia</span>
                    <AlertTriangle className="h-4 w-4 text-yellow" />
                  </div>
                  <p className="text-[11px] text-subtext0 mt-1">
                    Cálculo automático de relación ingreso / pasivo.
                  </p>
                  {inconsistenciaSimulada && (
                    <div className="mt-2.5 p-2 rounded-xl bg-red/10 border border-red/30 text-[11px] font-mono text-red space-y-0.5">
                      <div>⚠️ Alerta detectada:</div>
                      <div className="text-[10px]">Alquiler representa el 52% del ingreso.</div>
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
                  {inconsistenciaSimulada ? "Ocultar Alerta" : "Probar Alerta de Riesgo"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: CONSOLA DE COMITÉ (PUNCHY, SIN RELLENO) */}
        {activeTab === "consola" && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
              <div>
                <h3 className="text-lg font-bold text-text">
                  Indicadores de Rendimiento
                </h3>
                <p className="text-xs text-subtext0">
                  Métricas de resolución para comités de crédito.
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green/15 text-green border border-green/30 font-mono">
                SLA 99.4% A TIEMPO
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/30">
                <span className="text-[10px] text-subtext0 uppercase font-semibold">Expedientes</span>
                <div className="text-2xl font-black font-mono text-text mt-0.5">124</div>
                <span className="text-[10px] text-green font-bold">100% Auditados</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/30">
                <span className="text-[10px] text-subtext0 uppercase font-semibold">Favorables</span>
                <div className="text-2xl font-black font-mono text-green mt-0.5">78%</div>
                <span className="text-[10px] text-subtext0">Apto Directo</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/30">
                <span className="text-[10px] text-subtext0 uppercase font-semibold">Con Observación</span>
                <div className="text-2xl font-black font-mono text-yellow mt-0.5">16%</div>
                <span className="text-[10px] text-subtext0">Garantía adicional</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface1 border border-overlay0/30">
                <span className="text-[10px] text-subtext0 uppercase font-semibold">SLA Promedio</span>
                <div className="text-2xl font-black font-mono text-gold mt-0.5">14.8h</div>
                <span className="text-[10px] text-green font-bold">Meta &lt; 24h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
