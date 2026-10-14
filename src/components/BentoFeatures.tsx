"use client";

import { 
  Zap, MapPin, Scale, ShieldCheck, 
  CheckCircle2, AlertTriangle,
  Check, RefreshCw, Hash, Search
} from "lucide-react";

export function BentoFeatures() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
      
      {/* Feature 1: ANDE (7 Cols) */}
      <div className="lg:col-span-7 rounded-2xl glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-overlay1 transition-colors">
        <div className="space-y-6">
          <header className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-xl bg-surface2 flex items-center justify-center text-text shrink-0">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text">
                  Cotejo de Suministro ANDE
                </h3>
                <p className="text-sm text-subtext0 mt-1">
                  Verificación in situ de servicios básicos.
                </p>
              </div>
          </header>

          <p className="text-sm text-subtext0 leading-relaxed">
            Verificamos in situ el Número de Identificación de Suministro (NIS) físico en fachada. Ratificamos que el inmueble cuenta con medidor legal activo, descartando conexiones clandestinas o deudas que afecten la habitabilidad.
          </p>

          <div className="p-5 rounded-xl bg-surface1 border border-overlay0 space-y-4">
             <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-text">Ejemplo de Validación:</span>
                <span className="text-xs bg-surface2 px-2 py-1 rounded-md text-subtext0 font-mono">NIS: 2489102</span>
             </div>
              <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-2 text-sm text-green">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Medidor Activo y Homologado</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm text-text">
                    <Check className="h-4 w-4 shrink-0 text-subtext1" />
                    <span className="text-subtext0">Categoría: Residencial Monofásica B-01</span>
                 </div>
              </div>
          </div>
        </div>
      </div>

      {/* Feature 2: GPS (5 Cols) */}
      <div className="lg:col-span-5 rounded-2xl glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-overlay1 transition-colors">
        <div className="space-y-6">
           <header className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-xl bg-surface2 flex items-center justify-center text-text shrink-0">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text">
                  Georreferenciación
                </h3>
                <p className="text-sm text-subtext0 mt-1">
                  Fijación GPS precisa.
                </p>
              </div>
          </header>

          <p className="text-sm text-subtext0 leading-relaxed">
            Localización exacta para zonas en desarrollo, garantizando certeza registral para la garantía hipotecaria o prendaria.
          </p>

          <div className="p-5 rounded-xl bg-surface1 border border-overlay0 space-y-4 font-mono text-sm">
            <div className="flex justify-between items-center border-b border-overlay0 pb-2">
               <span className="text-subtext0">Coordenadas:</span>
               <span className="font-medium text-text">-25.2699, -57.4890</span>
            </div>
            <div className="flex justify-between items-center pb-2">
               <span className="text-subtext0">Precisión:</span>
               <span className="font-medium text-green">± 3.8m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature 3: Riesgo (6 Cols) */}
      <div className="lg:col-span-6 rounded-2xl glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-overlay1 transition-colors">
         <div className="space-y-6">
           <header className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-xl bg-surface2 flex items-center justify-center text-text shrink-0">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text">
                  Capacidad de Pago
                </h3>
                <p className="text-sm text-subtext0 mt-1">
                  Análisis de solvencia in situ.
                </p>
              </div>
          </header>

          <p className="text-sm text-subtext0 leading-relaxed">
            Evaluamos la relación entre compromisos fijos y los ingresos familiares netos demostrados en terreno para determinar la viabilidad del crédito.
          </p>

          <div className="p-5 rounded-xl bg-surface1 border border-overlay0 space-y-4">
             <div className="flex items-center gap-2 text-sm text-text font-medium mb-2">
                <span>Indicadores Evaluados:</span>
             </div>
             <ul className="space-y-3 text-sm text-subtext0">
                <li className="flex items-start gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                   Ingresos demostrables (recibos, constancias).
                </li>
                <li className="flex items-start gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                   Egresos fijos (alquiler, servicios, educación).
                </li>
                <li className="flex items-start gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
                   Ratio de endeudamiento general.
                </li>
             </ul>
          </div>
        </div>
      </div>

      {/* Feature 4: Seguridad (6 Cols) */}
      <div className="lg:col-span-6 rounded-2xl glass-panel p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-overlay1 transition-colors">
         <div className="space-y-6">
           <header className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-xl bg-surface2 flex items-center justify-center text-text shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text">
                  Seguridad Jurídica
                </h3>
                <p className="text-sm text-subtext0 mt-1">
                  Protección de datos garantizada.
                </p>
              </div>
          </header>

          <p className="text-sm text-subtext0 leading-relaxed">
            Cada evidencia fotográfica es sellada criptográficamente con fecha, hora satelital y hash inmutable. Operamos bajo estricto cumplimiento de la Ley N° 1682/01.
          </p>

          <div className="p-5 rounded-xl bg-surface1 border border-overlay0 flex flex-col gap-4">
             <div className="flex items-center gap-3 text-sm text-text">
                <Hash className="h-4 w-4 text-subtext1 shrink-0" />
                <span className="font-mono truncate">e3b0c44298fc1c149afbf4c8996fb9242...</span>
             </div>
             <div className="flex items-center gap-3 text-sm text-text">
                <ShieldCheck className="h-4 w-4 text-subtext1 shrink-0" />
                <span>Cumplimiento Ley N° 1682/01</span>
             </div>
              <div className="flex items-center gap-3 text-sm text-text">
                <CheckCircle2 className="h-4 w-4 text-green shrink-0" />
                <span>Matrícula Pericial Reg. Oficial N° 4.819</span>
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}
