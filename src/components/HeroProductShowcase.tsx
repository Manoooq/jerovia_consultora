"use client";

import { useState } from "react";
import { DossierInteractiveViewer } from "@/components/DossierInteractiveViewer";
import { 
  FileText, Tablet, ShieldAlert, BarChart3, 
  Zap, Compass, Mic, CheckCircle2, AlertTriangle, 
  ShieldCheck, ArrowRight, Sparkles, LayoutDashboard
} from "lucide-react";

export function HeroProductShowcase() {
  const [activeTab, setActiveTab] = useState<"dossier" | "terminal" | "inconsistencias" | "consola">("dossier");

  return (
    <div className="rounded-2xl border border-overlay0 bg-surface0 overflow-hidden shadow-lg">
      <div className="bg-surface1 px-4 sm:px-6 py-4 border-b border-overlay0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red border border-red/40" />
            <div className="h-3 w-3 rounded-full bg-yellow border border-yellow/40" />
            <div className="h-3 w-3 rounded-full bg-green border border-green/40" />
          </div>
          <div className="h-4 w-px bg-overlay1 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text">
              Consola Pericial
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-surface2/50 p-1 rounded-lg border border-overlay0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("dossier")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "dossier"
                ? "bg-surface0 text-text shadow-sm border border-overlay1"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Legajo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("terminal")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "terminal"
                ? "bg-surface0 text-text shadow-sm border border-overlay1"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <Tablet className="h-4 w-4" />
            <span>Telemetría</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inconsistencias")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "inconsistencias"
                ? "bg-surface0 text-text shadow-sm border border-overlay1"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <ShieldAlert className="h-4 w-4" />
            <span>Anti-Fraude</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("consola")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all shrink-0 ${
              activeTab === "consola"
                ? "bg-surface0 text-text shadow-sm border border-overlay1"
                : "text-subtext0 hover:text-text"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Métricas</span>
          </button>
        </div>
      </div>

      <div>
        {activeTab === "dossier" && (
          <div className="animate-in fade-in duration-200">
            <DossierInteractiveViewer />
          </div>
        )}

        {activeTab === "terminal" && (
          <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-overlay0">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-text">
                  Instrumental de Inspección In Situ
                </h3>
                <p className="text-sm text-subtext0 mt-1">Relevamiento presencial en terreno</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-surface1 border border-overlay0 flex flex-col gap-4">
                <div className="flex items-center gap-3 pb-4 border-b border-overlay1/50">
                  <div className="h-10 w-10 rounded-lg bg-surface2 flex items-center justify-center text-text">
                    <Zap className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-text">Cotejo de Suministro</h4>
                </div>
                <p className="text-sm text-subtext0 flex-1">
                  Verificación física del medidor ANDE (NIS) para descartar conexiones clandestinas y confirmar titularidad in situ.
                </p>
                <div className="p-3 bg-surface0 rounded-lg border border-overlay0 text-sm font-mono text-center">
                  NIS: 2489102 <span className="text-green text-xs ml-2">✓ Activo</span>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-surface1 border border-overlay0 flex flex-col gap-4">
                <div className="flex items-center gap-3 pb-4 border-b border-overlay1/50">
                  <div className="h-10 w-10 rounded-lg bg-surface2 flex items-center justify-center text-text">
                    <Compass className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-text">Geolocalización GPS</h4>
                </div>
                <p className="text-sm text-subtext0 flex-1">
                  Fijación satelital precisa para certificar la ubicación exacta de la fachada y registrar el entorno habitacional.
                </p>
                <div className="p-3 bg-surface0 rounded-lg border border-overlay0 text-sm font-mono text-center">
                  -25.269932, -57.489012
                </div>
              </div>

              <div className="p-6 rounded-xl bg-surface1 border border-overlay0 flex flex-col gap-4">
                <div className="flex items-center gap-3 pb-4 border-b border-overlay1/50">
                  <div className="h-10 w-10 rounded-lg bg-surface2 flex items-center justify-center text-text">
                    <Mic className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-text">Registro de Entrevista</h4>
                </div>
                <p className="text-sm text-subtext0 flex-1">
                  Recopilación de observaciones y entrevistas vecinales durante la visita domiciliaria para el informe social.
                </p>
                <div className="p-3 bg-surface0 rounded-lg border border-overlay0 text-sm font-mono text-center text-subtext0 italic">
                  "Residencia sólida de mampostería..."
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "inconsistencias" && (
          <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
             <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-overlay0">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-text flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" />
                  Auditoría de Riesgo Crediticio
                </h3>
                <p className="text-sm text-subtext0 mt-1">Detección de contradicciones y señales de alerta</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-text border-b border-overlay0 pb-2">Señales de Alerta (Ejemplo)</h4>

                <div className="p-4 rounded-xl bg-red/10 border border-red/20 space-y-2">
                  <div className="flex items-center gap-2 text-red font-semibold text-sm">
                    <AlertTriangle className="h-4 w-4" /> Ratio de Endeudamiento
                  </div>
                  <p className="text-sm text-text">
                    El alquiler declarado (4.2M Gs) insume el 56% del salario demostrado (7.5M Gs), superando el límite prudencial del 30%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-yellow/10 border border-yellow/20 space-y-2">
                  <div className="flex items-center gap-2 text-yellow font-semibold text-sm">
                    <AlertTriangle className="h-4 w-4" /> Titularidad de Servicios
                  </div>
                  <p className="text-sm text-text">
                    Medidor ANDE registrado a nombre de un tercero sin contrato de subalquiler presentado.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-text border-b border-overlay0 pb-2">Validaciones Exitosas (Ejemplo)</h4>

                <div className="p-4 rounded-xl bg-green/10 border border-green/20 space-y-2">
                  <div className="flex items-center gap-2 text-green font-semibold text-sm">
                    <CheckCircle2 className="h-4 w-4" /> Coherencia Económica
                  </div>
                  <p className="text-sm text-text">
                    Ingresos familiares (11M Gs) cubren compromisos con un nivel de endeudamiento del 21%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-green/10 border border-green/20 space-y-2">
                  <div className="flex items-center gap-2 text-green font-semibold text-sm">
                    <CheckCircle2 className="h-4 w-4" /> Arraigo Domiciliario
                  </div>
                  <p className="text-sm text-text">
                    Vivienda con más de 6 años de ocupación, entorno barrial consolidado y referencias positivas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "consola" && (
          <div className="p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-overlay0">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-text">
                  Métricas Operativas
                </h3>
                <p className="text-sm text-subtext0 mt-1">Rendimiento y cumplimiento de SLA</p>
              </div>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-surface1 border border-overlay0 flex flex-col gap-2">
                <span className="text-sm font-medium text-subtext0">Expedientes Mes</span>
                <span className="text-3xl font-bold text-text">124</span>
                <span className="text-xs text-green font-medium">100% Auditados</span>
              </div>

              <div className="p-6 rounded-xl bg-surface1 border border-overlay0 flex flex-col gap-2">
                <span className="text-sm font-medium text-subtext0">Dictámenes Favorables</span>
                <span className="text-3xl font-bold text-green">78%</span>
                <span className="text-xs text-subtext1">Apto Directo</span>
              </div>

              <div className="p-6 rounded-xl bg-surface1 border border-overlay0 flex flex-col gap-2">
                <span className="text-sm font-medium text-subtext0">Con Observación</span>
                <span className="text-3xl font-bold text-yellow">16%</span>
                <span className="text-xs text-subtext1">Requiere Aval</span>
              </div>

              <div className="p-6 rounded-xl bg-surface1 border border-overlay0 flex flex-col gap-2">
                <span className="text-sm font-medium text-subtext0">Tiempo Medio</span>
                <span className="text-3xl font-bold text-gold">14.8h</span>
                <span className="text-xs text-green font-medium">Cumple SLA &lt; 24h</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
