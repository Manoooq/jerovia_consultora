import Link from "next/link";
import { obtenerEntrevista, crearEntrevista } from "@/lib/store";
import { Wizard } from "@/components/Wizard";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Lock, Save, Smartphone, ArrowLeft, ShieldCheck, ShieldAlert } from "lucide-react";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function EntrevistaPage({ params }: PageProps) {
  const { token } = await params;

  let entrevista = obtenerEntrevista(token);

  if (!entrevista && token === "demo") {
    entrevista = crearEntrevista(
      "Banco Continental (Entorno Demo)",
      "demo",
      "Lic. Michelle Romero",
      "system"
    );
  }

  if (!entrevista) {
    return (
      <div className="min-h-screen bg-base text-text flex flex-col justify-between p-4 sm:p-6">
        <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-2">
          <Logo size="sm" />
          <ThemeToggle />
        </header>
        <main className="max-w-md w-full mx-auto my-auto rounded-3xl border border-red/30 bg-surface0 p-8 text-center space-y-4 shadow-2xl">
          <div className="h-12 w-12 rounded-2xl bg-red/10 text-red flex items-center justify-center mx-auto">
            <ShieldAlert className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-black text-text">Enlace de Visita No Válido</h1>
          <p className="text-xs text-subtext0 leading-relaxed">
            El código de expediente solicitado no existe, ha expirado o fue revocado por la dirección pericial de Jerovia Consultora.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link
              href="/"
              className="rounded-xl border border-overlay0/60 bg-surface1 px-5 py-2.5 text-xs font-semibold text-text hover:border-gold transition-colors"
            >
              Ir a Inicio
            </Link>
            <Link
              href="/entrevista/demo"
              className="rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-black hover:bg-gold-light transition-colors"
            >
              Ver Formulario Demo
            </Link>
          </div>
        </main>
        <footer className="text-center py-4 text-[11px] text-subtext0 font-mono">
          Jerovia Consultora • Protección de Datos Ley N° 6534/20
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base text-text">
      <header className="border-b border-overlay0/40 bg-mantle sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs text-subtext1 hover:text-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Volver al panel</span>
            </Link>
            <div className="h-4 w-px bg-overlay0/50 hidden sm:block" />
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-[10px] text-subtext0 font-semibold uppercase tracking-wider">
                Entidad Solicitante
              </p>
              <p className="text-xs font-bold text-text">{entrevista.entidadSolicitante}</p>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="max-w-3xl mx-auto px-4 sm:px-6 py-8 outline-none space-y-6">
        {entrevista.candidatoNombre && (
          <div className="rounded-2xl border border-overlay0/40 bg-surface1/60 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
              <span>
                Expediente: <strong className="text-text">{entrevista.candidatoNombre}</strong>
              </span>
            </div>
            {entrevista.evaluadorAsignado && (
              <span className="text-subtext0">
                Perito: <strong className="text-gold">{entrevista.evaluadorAsignado}</strong>
              </span>
            )}
          </div>
        )}

        <div className="rounded-3xl border border-overlay0/50 bg-surface0 shadow-2xl p-6 sm:p-10">
          <Wizard
            token={entrevista.token}
            initialData={entrevista.datos}
            initialPaso={entrevista.pasoActual}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-semibold text-subtext0 pt-2">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span>Resguardo Confidencial Ley N° 6534/20</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Save className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span>Guardado Automático Continuo</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            <span>Optimizado para Inspección Móvil</span>
          </div>
        </div>
      </main>
    </div>
  );
}
