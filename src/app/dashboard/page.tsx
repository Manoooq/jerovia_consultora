"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { Badge } from "@/components/ui/FormFields";
import { 
  MetricCardSkeleton, 
  InterviewRowSkeleton, 
  Skeleton 
} from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import { 
  Plus, Search, FileText, Clock, CheckCircle, 
  AlertCircle, ArrowRight, BarChart3, ShieldCheck, 
  Sparkles, X 
} from "lucide-react";

interface EntrevistaItem {
  id: string;
  token: string;
  entidadSolicitante: string;
  candidatoNombre?: string;
  estado: "pendiente" | "en_progreso" | "completado";
  pasoActual: number;
  actualizadoEn: string;
}

function estadoBadge(estado: string) {
  if (estado === "completado") return <Badge variant="success">Completado</Badge>;
  if (estado === "en_progreso") return <Badge variant="warning">En progreso</Badge>;
  return <Badge>Pendiente</Badge>;
}

function estadoIcon(estado: string) {
  if (estado === "completado") return <CheckCircle className="h-4 w-4 text-green" aria-hidden="true" />;
  if (estado === "en_progreso") return <Clock className="h-4 w-4 text-yellow" aria-hidden="true" />;
  return <AlertCircle className="h-4 w-4 text-subtext0" aria-hidden="true" />;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [entrevistas, setEntrevistas] = useState<EntrevistaItem[]>([]);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "completado" | "en_progreso" | "pendiente">("todos");

  useEffect(() => {
    // Carga de entrevistas con simulación de skeleton elegante
    async function loadData() {
      try {
        const res = await fetch("/api/entrevista");
        if (res.ok) {
          const data = await res.json();
          setEntrevistas(data);
        }
      } catch (err) {
        console.error("Error al cargar entrevistas:", err);
      } finally {
        setTimeout(() => setLoading(false), 350);
      }
    }
    loadData();
  }, []);

  // Filtrado según Ley de Hick (reducción de carga cognitiva)
  const filtered = useMemo(() => {
    return entrevistas.filter((e) => {
      const matchSearch =
        !search ||
        (e.candidatoNombre || "").toLowerCase().includes(search.toLowerCase()) ||
        e.entidadSolicitante.toLowerCase().includes(search.toLowerCase());
      const matchEstado = filtroEstado === "todos" || e.estado === filtroEstado;
      return matchSearch && matchEstado;
    });
  }, [entrevistas, search, filtroEstado]);

  const stats = useMemo(() => {
    const total = entrevistas.length;
    const completadas = entrevistas.filter((e) => e.estado === "completado").length;
    const enProgreso = entrevistas.filter((e) => e.estado === "en_progreso").length;
    const pendientes = entrevistas.filter((e) => e.estado === "pendiente").length;
    return { total, completadas, enProgreso, pendientes };
  }, [entrevistas]);

  return (
    <div className="min-h-screen bg-base">
      {/* Navbar con Design Tokens */}
      <nav aria-label="Navegación del panel de gestión" className="border-b border-overlay0/40 bg-mantle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" aria-label="Volver a inicio">
              <Logo size="sm" />
            </Link>
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
              className="flex items-center gap-1.5 rounded-xl bg-gold px-3.5 py-2 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-md shadow-gold/20 focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Nueva visita
            </Link>
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 outline-none">
        {/* Banner de Administrador (Ley de Hick: información clara y tranquilizadora) */}
        <div className="mb-6 rounded-2xl border border-gold/30 bg-gold/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gold/15 flex items-center justify-center text-gold">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-text">
                Sesión de Administrador: <span className="text-gold">Lic. Michelle Romero</span>
              </p>
              <p className="text-[11px] text-subtext0">
                Permisos completos de peritaje, auditoría y emisión de informes
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold bg-surface0 border border-overlay0/50 px-2.5 py-1 rounded-full text-subtext1 self-start sm:self-auto">
            🟢 Modo Administrador Activo
          </span>
        </div>

        {/* Header con búsqueda accesible */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs text-subtext0 font-semibold uppercase tracking-wider mb-1">
              {new Date().toLocaleDateString("es-PY", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-text">Visitas Socioambientales</h1>
          </div>

          {/* Búsqueda minimalista */}
          <div className="flex items-center gap-2 rounded-xl border border-overlay0/60 bg-surface0 px-3.5 py-2 w-full sm:w-64 focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20">
            <Search className="h-3.5 w-3.5 text-subtext0" aria-hidden="true" />
            <input
              type="text"
              aria-label="Buscar visitas por postulante o institución"
              placeholder="Buscar postulante o banco..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs text-text placeholder:text-subtext0 outline-none w-full font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-subtext0 hover:text-text p-0.5"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Métricas con Skeleton de carga (Hick's Law: 4 datos esenciales) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" aria-busy={loading}>
          {loading ? (
            <>
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
              <MetricCardSkeleton />
            </>
          ) : (
            [
              {
                label: "Total Asignadas",
                value: stats.total,
                icon: FileText,
                color: "text-gold",
                border: "border-gold/30",
                bg: "bg-surface0",
                estado: "todos" as const,
              },
              {
                label: "Completadas",
                value: stats.completadas,
                icon: CheckCircle,
                color: "text-green",
                border: "border-green/30",
                bg: "bg-surface0",
                estado: "completado" as const,
              },
              {
                label: "En Progreso",
                value: stats.enProgreso,
                icon: Clock,
                color: "text-yellow",
                border: "border-yellow/30",
                bg: "bg-surface0",
                estado: "en_progreso" as const,
              },
              {
                label: "Pendientes",
                value: stats.pendientes,
                icon: AlertCircle,
                color: "text-subtext0",
                border: "border-overlay0/40",
                bg: "bg-surface0",
                estado: "pendiente" as const,
              },
            ].map((stat) => (
              <button
                key={stat.label}
                type="button"
                onClick={() => setFiltroEstado(stat.estado)}
                className={`text-left rounded-2xl border p-5 ${stat.border} ${stat.bg} shadow-sm transition-all hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-gold ${
                  filtroEstado === stat.estado ? "ring-2 ring-gold shadow-md" : ""
                }`}
                title={`Filtrar por ${stat.label}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-subtext0 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
                </div>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              </button>
            ))
          )}
        </div>

        {/* Tabla de entrevistas con Skeletons */}
        <div className="rounded-2xl border border-overlay0/40 bg-surface0 overflow-hidden mb-6 shadow-sm">
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-overlay0/30">
            <h2 className="font-bold text-text text-sm">
              Visitas {filtroEstado !== "todos" ? `(${filtroEstado})` : ""}
            </h2>
            <span className="text-xs text-subtext0 font-medium">
              {filtered.length} registro{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div aria-hidden="true">
              <InterviewRowSkeleton />
              <InterviewRowSkeleton />
              <InterviewRowSkeleton />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-10 w-10 text-subtext0 mb-3" aria-hidden="true" />
              <h3 className="font-bold text-text mb-1 text-sm">Sin visitas encontradas</h3>
              <p className="text-xs text-subtext0 mb-4">
                {search ? "No hay resultados para la búsqueda actual." : "Crea una nueva visita para comenzar."}
              </p>
              <Link
                href="/dashboard/nueva"
                className="flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-xs font-bold text-black"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Nueva entrevista
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-overlay0/20" role="list">
              {filtered.map((e) => (
                <div
                  key={e.id}
                  role="listitem"
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-surface1 transition-colors group"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface1">
                    {estadoIcon(e.estado)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-bold text-text text-sm truncate">
                        {e.candidatoNombre || "Postulante sin nombre registrado"}
                      </p>
                      {estadoBadge(e.estado)}
                    </div>
                    <p className="text-xs text-subtext0 font-medium">
                      {e.entidadSolicitante} · Módulo {e.pasoActual} de 9 · {formatDate(e.actualizadoEn.slice(0, 10))}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <span className="text-[11px] text-gold font-bold">
                        {Math.round(((e.pasoActual - 1) / 8) * 100)}%
                      </span>
                      <div className="h-1 w-20 rounded-full bg-surface2 overflow-hidden">
                        <div
                          className="h-1 rounded-full bg-gold transition-all duration-300"
                          style={{ width: `${((e.pasoActual - 1) / 8) * 100}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href={`/entrevista/${e.token}`}
                      className="flex items-center gap-1 rounded-xl border border-overlay0/60 bg-surface1 px-3 py-1.5 text-xs font-semibold text-subtext1 hover:text-text hover:border-gold transition-all focus-visible:ring-2 focus-visible:ring-gold"
                    >
                      <span>{e.estado === "completado" ? "Ver informe" : "Continuar"}</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Frecuencia de visitas con Skeleton */}
        <div className="rounded-2xl border border-overlay0/40 bg-surface0 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-gold" aria-hidden="true" />
            <h3 className="font-bold text-text text-sm">Frecuencia de Actividad</h3>
            <span className="ml-auto text-[11px] font-semibold text-subtext0">Últimos 30 días</span>
          </div>
          {loading ? (
            <div className="h-16 flex items-end gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <Skeleton key={i} className="flex-1 h-8 rounded-t-sm" />
              ))}
            </div>
          ) : (
            <div className="flex items-end gap-1 h-16">
              {Array.from({ length: 30 }, (_, i) => {
                const height = i % 5 === 0 ? 80 : i % 3 === 0 ? 50 : 25;
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
          )}
        </div>
      </main>
    </div>
  );
}
