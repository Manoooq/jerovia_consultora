import { obtenerEntrevista, crearEntrevista } from "@/lib/store";
import { Wizard } from "@/components/Wizard";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { notFound } from "next/navigation";
import { generateToken } from "@/lib/utils";
import { Lock, Save, Smartphone } from "lucide-react";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function EntrevistaPage({ params }: PageProps) {
  const { token } = await params;

  let entrevista = obtenerEntrevista(token);
  if (!entrevista && token === "demo") {
    entrevista = crearEntrevista("Demostración", generateToken());
  }
  if (!entrevista) notFound();

  return (
    <div className="min-h-screen bg-base">
      {/* Header corporativo */}
      <header className="border-b border-overlay0/40 bg-mantle sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-[11px] text-subtext0 font-semibold">Solicitado por</p>
              <p className="text-xs font-bold text-text">{entrevista.entidadSolicitante}</p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 sm:px-6 py-8 outline-none">
        {/* Card del formulario */}
        <div className="rounded-3xl border border-overlay0/50 bg-surface0 shadow-xl p-6 sm:p-10">
          <Wizard
            token={entrevista.token}
            initialData={entrevista.datos}
            initialPaso={entrevista.pasoActual}
          />
        </div>

        {/* Sellos de confianza */}
        <div className="mt-6 flex items-center justify-center gap-8 text-xs font-semibold text-subtext0">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-gold" />
            Datos Cifrados
          </div>
          <div className="flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5 text-gold" />
            Guardado Automático
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-gold" />
            Optimizado Móvil
          </div>
        </div>
      </main>
    </div>
  );
}
