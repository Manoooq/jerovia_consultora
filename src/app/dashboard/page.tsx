import { listarEntrevistas } from "@/lib/store";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { Plus, Search, FileText, Clock, CheckCircle, AlertCircle, ArrowRight, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/FormFields";
import { formatDate } from "@/lib/utils";

function estadoBadge(estado: string) {
  if (estado === "completado") return <Badge variant="success">Completado</Badge>;
  if (estado === "en_progreso") return <Badge variant="warning">En progreso</Badge>;
  return <Badge>Pendiente</Badge>;
}

function estadoIcon(estado: string) {
  if (estado === "completado") return <CheckCircle className="h-4 w-4 text-green" />;
  if (estado === "en_progreso") return <Clock className="h-4 w-4 text-yellow" />;
  return <AlertCircle className="h-4 w-4 text-overlay1" />;
}

export default function DashboardPage() {
  const entrevistas = listarEntrevistas();
  const completadas = entrevistas.filter((e) => e.estado === "completado").length;
  const enProgreso = entrevistas.filter((e) => e.estado === "en_progreso").length;
  const pendientes = entrevistas.filter((e) => e.estado === "pendiente").length;

  return (
    <div className="min-h-screen bg-base">
      {/* Navbar */}
      <nav className="border-b border-overlay0/40 bg-mantle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Logo size="sm" />
            <div className="hidden sm:block h-4 w-px bg-overlay0/50" />
            <span className="hidden sm:block text-xs text-subtext0 uppercase tracking-wider font-semibold">
              Panel de Gestión
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-px bg-overlay0/50 hidden sm:block" />
            <LogoutButton />
            <Link
              href="/dashboard/nueva"
              className="flex items-center gap-1.5 rounded-xl bg-gold px-3.5 py-2 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-md shadow-gold/20"
            >
              <Plus className="h-3.5 w-3.5" />
              Nueva entrevista
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 outline-none">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs text-subtext0 font-semibold uppercase tracking-wider mb-1">
              {new Date().toLocaleDateString("es-PY", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-text">Entrevistas</h1>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-overlay0/60 bg-surface0 px-3.5 py-2">
            <Search className="h-3.5 w-3.5 text-overlay1" />
            <input
              type="text"
              placeholder="Buscar por postulante o banco..."
              className="bg-transparent text-xs text-text placeholder:text-overlay1 outline-none w-52 font-medium"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Asignadas", value: entrevistas.length, icon: FileText, color: "text-gold", border: "border-gold/30", bg: "bg-surface0" },
            { label: "Completadas", value: completadas, icon: CheckCircle, color: "text-green", border: "border-green/30", bg: "bg-surface0" },
            { label: "En progreso", value: enProgreso, icon: Clock, color: "text-yellow", border: "border-yellow/30", bg: "bg-surface0" },
            { label: "Pendientes", value: pendientes, icon: AlertCircle, color: "text-subtext0", border: "border-overlay0/40", bg: "bg-surface0" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border p-5 ${stat.border} ${stat.bg} shadow-sm`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-subtext0 uppercase tracking-wider">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabla de entrevistas */}
        <div className="rounded-2xl border border-overlay0/40 bg-surface0 overflow-hidden mb-6 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-overlay0/30">
            <h2 className="font-bold text-text text-sm">Entrevistas Registradas</h2>
          </div>

          {entrevistas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-10 w-10 text-overlay1 mb-3" />
              <h3 className="font-bold text-text mb-1 text-sm">Sin entrevistas aún</h3>
              <p className="text-xs text-subtext0 mb-4">Crea una nueva entrevista para comenzar a auditar.</p>
              <Link
                href="/dashboard/nueva"
                className="flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-xs font-bold text-black"
              >
                <Plus className="h-3.5 w-3.5" /> Nueva entrevista
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-overlay0/20">
              {entrevistas.map((e) => (
                <div key={e.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface1 transition-colors group">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface1">
                    {estadoIcon(e.estado)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-text text-sm truncate">
                        {e.candidatoNombre || "Sin nombre aún"}
                      </p>
                      {estadoBadge(e.estado)}
                    </div>
                    <p className="text-xs text-subtext0 font-medium">
                      {e.entidadSolicitante} · Paso {e.pasoActual} de 9 · {formatDate(e.actualizadoEn.slice(0, 10))}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <span className="text-[11px] text-gold font-bold">{Math.round(((e.pasoActual - 1) / 8) * 100)}%</span>
                      <div className="h-1 w-20 rounded-full bg-surface2">
                        <div
                          className="h-1 rounded-full bg-gold transition-all"
                          style={{ width: `${((e.pasoActual - 1) / 8) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/entrevista/${e.token}`}
                      className="flex items-center gap-1 rounded-xl border border-overlay0/60 bg-surface1 px-3 py-1.5 text-xs font-semibold text-subtext1 hover:text-text hover:border-gold transition-all"
                    >
                      {e.estado === "completado" ? "Ver" : "Continuar"}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Gráfica de actividad */}
        <div className="rounded-2xl border border-overlay0/40 bg-surface0 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-gold" />
            <h3 className="font-bold text-text text-sm">Frecuencia de Visitas</h3>
            <span className="ml-auto text-[11px] font-semibold text-subtext0">Últimos 30 días</span>
          </div>
          <div className="flex items-end gap-1 h-16">
            {Array.from({ length: 30 }, (_, i) => {
              const height = (i % 5 === 0 ? 80 : (i % 3 === 0 ? 50 : 25));
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gold/20 hover:bg-gold/50 transition-colors cursor-default"
                  style={{ height: `${height}%` }}
                  title={`Día ${i + 1}`}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
