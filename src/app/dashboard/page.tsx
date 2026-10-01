"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { Badge, Input, Select } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { 
  MetricCardSkeleton, 
  InterviewRowSkeleton, 
  Skeleton 
} from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import { 
  Plus, Search, FileText, Clock, CheckCircle, 
  AlertCircle, ArrowRight, BarChart3, ShieldCheck, 
  Users, X, ShieldAlert, UserCheck, Trash2, Edit3,
  Copy, Check, ArrowUpDown, Key, MapPin, 
  ExternalLink
} from "lucide-react";

interface EntrevistaItem {
  id: string;
  token: string;
  entidadSolicitante: string;
  candidatoNombre?: string;
  cedula?: string;
  telefono?: string;
  ciudad?: string;
  evaluadorAsignado?: string;
  estado: "pendiente" | "en_progreso" | "completado";
  pasoActual: number;
  actualizadoEn: string;
}

interface CurrentUser {
  userId: string;
  username: string;
  email: string;
  name: string;
  role: "admin" | "evaluador";
}

type SortField = "fecha" | "nombre" | "entidad" | "progreso";

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

function DashboardContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [entrevistas, setEntrevistas] = useState<EntrevistaItem[]>([]);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "completado" | "en_progreso" | "pendiente">("todos");
  const [orden, setOrden] = useState<SortField>("fecha");

  // Estado para copiar enlace
  const [copiadoToken, setCopiadoToken] = useState<string | null>(null);

  // Modales
  const [editModal, setEditModal] = useState<EntrevistaItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<EntrevistaItem | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ tipo: "success" | "error"; text: string } | null>(null);

  // Formulario de edición de visita
  const [editNombre, setEditNombre] = useState("");
  const [editCedula, setEditCedula] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editCiudad, setEditCiudad] = useState("");
  const [editEntidad, setEditEntidad] = useState("");
  const [editEvaluador, setEditEvaluador] = useState("");
  const [editEstado, setEditEstado] = useState<"pendiente" | "en_progreso" | "completado">("pendiente");

  // Formulario de cambio de contraseña
  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirm, setPassConfirm] = useState("");

  async function loadInitial() {
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user);
      }

      const res = await fetch("/api/entrevista");
      if (res.ok) {
        const data = await res.json();
        setEntrevistas(data);
      }
    } catch (err) {
      console.error("Error al cargar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitial();
  }, []);

  const esAdmin = currentUser?.role === "admin";

  // Copiar link de visita al portapapeles
  function handleCopyLink(token: string) {
    const url = `${window.location.origin}/entrevista/${token}`;
    navigator.clipboard.writeText(url);
    setCopiadoToken(token);
    setTimeout(() => setCopiadoToken(null), 2500);
  }

  // Abrir modal de edición
  function handleOpenEdit(item: EntrevistaItem) {
    setEditModal(item);
    setEditNombre(item.candidatoNombre || "");
    setEditCedula(item.cedula || "");
    setEditTelefono(item.telefono || "");
    setEditCiudad(item.ciudad || "Luque");
    setEditEntidad(item.entidadSolicitante || "");
    setEditEvaluador(item.evaluadorAsignado || "Lic. Michelle Romero");
    setEditEstado(item.estado);
  }

  // Guardar edición de visita
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editModal) return;
    setActionLoading(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/entrevista/${editModal.token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidatoNombre: editNombre,
          cedula: editCedula,
          telefono: editTelefono,
          ciudad: editCiudad,
          entidadSolicitante: editEntidad,
          evaluadorAsignado: editEvaluador,
          estado: editEstado,
          pasoActual: editEstado === "completado" ? 9 : editEstado === "en_progreso" ? 5 : 1,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "No se pudo actualizar el registro.");
      }

      setFeedbackMsg({ tipo: "success", text: "Visita actualizada correctamente." });
      setEditModal(null);
      await loadInitial();
    } catch (err: unknown) {
      setFeedbackMsg({ tipo: "error", text: err instanceof Error ? err.message : "Error al actualizar." });
    } finally {
      setActionLoading(false);
    }
  }

  // Eliminar visita
  async function handleConfirmDelete() {
    if (!deleteModal) return;
    setActionLoading(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch(`/api/entrevista/${deleteModal.token}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "No se pudo eliminar el registro.");
      }

      setFeedbackMsg({ tipo: "success", text: "Expediente de visita eliminado con éxito." });
      setDeleteModal(null);
      await loadInitial();
    } catch (err: unknown) {
      setFeedbackMsg({ tipo: "error", text: err instanceof Error ? err.message : "Error al eliminar." });
    } finally {
      setActionLoading(false);
    }
  }

  // Cambiar contraseña propia
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passNueva !== passConfirm) {
      setFeedbackMsg({ tipo: "error", text: "La nueva contraseña y su confirmación no coinciden." });
      return;
    }
    setActionLoading(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passwordActual: passActual, nuevaPassword: passNueva }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo cambiar la contraseña.");

      setFeedbackMsg({ tipo: "success", text: "Contraseña actualizada exitosamente." });
      setPasswordModalOpen(false);
      setPassActual("");
      setPassNueva("");
      setPassConfirm("");
    } catch (err: unknown) {
      setFeedbackMsg({ tipo: "error", text: err instanceof Error ? err.message : "Error al cambiar contraseña." });
    } finally {
      setActionLoading(false);
    }
  }

  // Filtrado y Ordenamiento
  const filteredAndSorted = useMemo(() => {
    const list = entrevistas.filter((e) => {
      const matchSearch =
        !search ||
        (e.candidatoNombre || "").toLowerCase().includes(search.toLowerCase()) ||
        e.entidadSolicitante.toLowerCase().includes(search.toLowerCase()) ||
        (e.evaluadorAsignado || "").toLowerCase().includes(search.toLowerCase()) ||
        (e.ciudad || "").toLowerCase().includes(search.toLowerCase());
      const matchEstado = filtroEstado === "todos" || e.estado === filtroEstado;
      return matchSearch && matchEstado;
    });

    return list.sort((a, b) => {
      if (orden === "fecha") {
        return new Date(b.actualizadoEn).getTime() - new Date(a.actualizadoEn).getTime();
      }
      if (orden === "nombre") {
        return (a.candidatoNombre || "").localeCompare(b.candidatoNombre || "");
      }
      if (orden === "entidad") {
        return a.entidadSolicitante.localeCompare(b.entidadSolicitante);
      }
      if (orden === "progreso") {
        return b.pasoActual - a.pasoActual;
      }
      return 0;
    });
  }, [entrevistas, search, filtroEstado, orden]);

  // Métricas avanzadas
  const stats = useMemo(() => {
    const total = entrevistas.length;
    const completadas = entrevistas.filter((e) => e.estado === "completado").length;
    const enProgreso = entrevistas.filter((e) => e.estado === "en_progreso").length;
    const pendientes = entrevistas.filter((e) => e.estado === "pendiente").length;
    const tasaEfectividad = total > 0 ? Math.round((completadas / total) * 100) : 0;

    // Desglose de ciudades
    const ciudadesCount: Record<string, number> = {};
    entrevistas.forEach((e) => {
      const c = e.ciudad || "Gran Asunción";
      ciudadesCount[c] = (ciudadesCount[c] || 0) + 1;
    });

    return { total, completadas, enProgreso, pendientes, tasaEfectividad, ciudadesCount };
  }, [entrevistas]);

  return (
    <div className="min-h-screen bg-base text-text">
      {/* Navbar con Design Tokens */}
      <nav aria-label="Navegación del panel pericial" className="border-b border-overlay0/40 bg-mantle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link href="/" aria-label="Volver a inicio">
              <Logo size="sm" />
            </Link>
            <div className="hidden sm:block h-4 w-px bg-overlay0/50" />
            <span className="hidden sm:block text-xs text-subtext0 uppercase tracking-wider font-semibold">
              Panel Pericial y de Auditoría
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-px bg-overlay0/50 hidden sm:block" />

            {/* Botón de Cambiar Contraseña / Perfil */}
            <button
              type="button"
              onClick={() => setPasswordModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-overlay0/60 bg-surface1 px-3 py-2 text-xs font-semibold text-text hover:border-gold transition-colors"
              title="Cambiar mi contraseña"
            >
              <Key className="h-3.5 w-3.5 text-gold" />
              <span className="hidden sm:inline">Seguridad</span>
            </button>
            
            {/* Si es Admin, enlace a administración de usuarios */}
            {esAdmin && (
              <Link
                href="/dashboard/usuarios"
                className="hidden sm:flex items-center gap-1.5 rounded-xl border border-overlay0/60 bg-surface1 px-3 py-2 text-xs font-semibold text-text hover:border-gold transition-colors"
                title="Administrar usuarios y accesos"
              >
                <Users className="h-3.5 w-3.5 text-gold" />
                <span>Usuarios</span>
              </Link>
            )}

            <LogoutButton />

            {/* Solo Administradores pueden generar nueva visita */}
            {esAdmin ? (
              <Link
                href="/dashboard/nueva"
                className="flex items-center gap-1.5 rounded-xl bg-gold px-3.5 py-2 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-md shadow-gold/20 focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Nueva visita</span>
              </Link>
            ) : (
              <span className="text-[11px] font-semibold text-subtext0 bg-surface1 px-3 py-1.5 rounded-xl border border-overlay0/40 hidden sm:inline-flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-blue" />
                Evaluador de Campo
              </span>
            )}
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 outline-none space-y-8">
        {/* Notificaciones globales */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
              feedbackMsg.tipo === "success"
                ? "bg-green/10 border-green/30 text-green"
                : "bg-red/10 border-red/30 text-red"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMsg.tipo === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <span>{feedbackMsg.text}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="hover:opacity-75">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Alerta de restricción si un evaluador intentó acceder a rutas protegidas */}
        {errorParam === "unauthorized_role" && (
          <div className="p-4 rounded-2xl bg-red/10 border border-red/30 text-xs text-red font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>Acceso Restringido: Únicamente los usuarios administradores tienen permisos para emitir nuevos enlaces de evaluación o gestionar personal.</span>
            </div>
            <Link href="/dashboard" className="underline font-bold text-red hover:opacity-80">
              Cerrar aviso
            </Link>
          </div>
        )}

        {/* Banner de Rol e Identidad (Ley de Hick: información clara y tranquilizadora) */}
        <div className="rounded-3xl border border-gold/30 bg-gold/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gold/15 flex items-center justify-center text-gold shadow-sm">
              {esAdmin ? (
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              ) : (
                <UserCheck className="h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-text">
                Sesión Activa:{" "}
                <span className="text-gold font-black">
                  {currentUser?.name || "Cargando..."}
                </span>{" "}
                <span className="text-subtext0 font-medium text-xs">
                  ({esAdmin ? "Administrador General" : "Perito de Campo"})
                </span>
              </p>
              <p className="text-xs text-subtext0 mt-0.5">
                {esAdmin
                  ? "Permisos totales: emisión, edición, auditoría de legajos y asignación de peritos"
                  : "Permisos de campo: recolección en campo, geolocalización y carga pericial"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setPasswordModalOpen(true)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-overlay0/60 bg-surface0 hover:border-gold transition-colors flex items-center gap-1.5"
            >
              <Key className="h-3 w-3 text-gold" />
              <span>Cambiar Contraseña</span>
            </button>
            <span className="text-xs font-semibold bg-surface0 border border-overlay0/50 px-3 py-1.5 rounded-xl text-subtext1">
              {esAdmin ? "🟢 Modo Directivo" : "🔵 Visitas Asignadas"}
            </span>
          </div>
        </div>

        {/* ══ MÉTRICAS PERICIALES Y DE RENDIMIENTO ══ */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gold" />
              <h2 className="text-base font-bold text-text">Rendimiento Operativo y Cobertura</h2>
            </div>
            <span className="text-xs text-subtext0 font-medium">Indicadores en vivo</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-busy={loading}>
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
                  label: "Total Expedientes",
                  value: stats.total,
                  sub: "Visitas registradas",
                  icon: FileText,
                  color: "text-gold",
                  border: "border-gold/30",
                },
                {
                  label: "Dictámenes Emitidos",
                  value: stats.completadas,
                  sub: `${stats.tasaEfectividad}% efectividad`,
                  icon: CheckCircle,
                  color: "text-green",
                  border: "border-green/30",
                },
                {
                  label: "En Relevamiento",
                  value: stats.enProgreso,
                  sub: "Visitas en campo",
                  icon: Clock,
                  color: "text-yellow",
                  border: "border-yellow/30",
                },
                {
                  label: "Pendientes",
                  value: stats.pendientes,
                  sub: "Por coordinar",
                  icon: AlertCircle,
                  color: "text-subtext0",
                  border: "border-overlay0/40",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl border p-5 bg-surface0 ${stat.border} shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-subtext0 uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
                  </div>
                  <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-[11px] text-subtext0 mt-1">{stat.sub}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ══ TABLA DE VISITAS CON FILTROS, ORDENAMIENTO Y ACCIONES ══ */}
        <div className="rounded-3xl border border-overlay0/40 bg-surface0 overflow-hidden shadow-sm space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-overlay0/30">
            <div>
              <h2 className="text-lg font-black text-text">Registro de Visitas y Expedientes</h2>
              <p className="text-xs text-subtext0 mt-0.5">
                {filteredAndSorted.length} expediente{filteredAndSorted.length !== 1 ? "s" : ""} disponible{filteredAndSorted.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Controles: Búsqueda, Filtro Estado y Orden */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Búsqueda */}
              <div className="flex items-center gap-2 rounded-xl border border-overlay0/60 bg-surface1 px-3 py-1.5 w-full sm:w-56 focus-within:border-gold">
                <Search className="h-3.5 w-3.5 text-subtext0" />
                <input
                  type="text"
                  placeholder="Buscar postulante o zona..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-xs text-text outline-none w-full font-medium"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-subtext0 hover:text-text">
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              {/* Filtro Estado */}
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as "todos" | "completado" | "en_progreso" | "pendiente")}
                className="text-xs font-semibold bg-surface1 border border-overlay0/60 rounded-xl px-3 py-1.5 text-text outline-none cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="completado">Completados</option>
                <option value="en_progreso">En progreso</option>
                <option value="pendiente">Pendientes</option>
              </select>

              {/* Ordenamiento */}
              <div className="flex items-center gap-1 bg-surface1 border border-overlay0/60 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-text">
                <ArrowUpDown className="h-3.5 w-3.5 text-gold" />
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as SortField)}
                  className="bg-transparent outline-none cursor-pointer text-xs"
                >
                  <option value="fecha">Recientes primero</option>
                  <option value="nombre">Por Nombre (A-Z)</option>
                  <option value="entidad">Por Entidad</option>
                  <option value="progreso">Mayor Progreso</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 pt-2">
              <InterviewRowSkeleton />
              <InterviewRowSkeleton />
              <InterviewRowSkeleton />
            </div>
          ) : filteredAndSorted.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FileText className="h-10 w-10 text-subtext0 mx-auto" />
              <h3 className="font-bold text-text text-sm">Sin visitas encontradas</h3>
              <p className="text-xs text-subtext0 max-w-sm mx-auto">
                {search ? "No hay registros coincidentes con los filtros aplicados." : "Comienza emitiendo una nueva asignación de peritaje."}
              </p>
              {esAdmin && (
                <Link
                  href="/dashboard/nueva"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-xs font-bold text-black"
                >
                  <Plus className="h-3.5 w-3.5" /> Nueva visita
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-overlay0/20" role="list">
              {filteredAndSorted.map((e) => (
                <div
                  key={e.token}
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-surface1/40 rounded-2xl px-3 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="h-10 w-10 rounded-2xl bg-surface1 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      {estadoIcon(e.estado)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-black text-text text-sm truncate">
                          {e.candidatoNombre || "Postulante sin nombre registrado"}
                        </h3>
                        {estadoBadge(e.estado)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtext0">
                        <span className="font-medium text-subtext1">{e.entidadSolicitante}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gold" />
                          {e.ciudad || "Gran Asunción"}
                        </span>
                        <span>·</span>
                        <span>Módulo {e.pasoActual} de 9</span>
                        {e.evaluadorAsignado && (
                          <>
                            <span>·</span>
                            <span className="text-gold font-semibold">{e.evaluadorAsignado}</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{formatDate(e.actualizadoEn.slice(0, 10))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones de la Visita */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                    {/* Botón Copiar Link */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(e.token)}
                      className="p-2 rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold transition-colors text-subtext0 hover:text-text"
                      title="Copiar enlace directo de la entrevista"
                    >
                      {copiadoToken === e.token ? (
                        <Check className="h-3.5 w-3.5 text-green" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>

                    {/* Botón Editar Visita */}
                    {esAdmin && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(e)}
                        className="p-2 rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold transition-colors text-subtext0 hover:text-text"
                        title="Editar datos de la visita"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Botón Eliminar Visita */}
                    {esAdmin && (
                      <button
                        type="button"
                        onClick={() => setDeleteModal(e)}
                        className="p-2 rounded-xl border border-overlay0/60 hover:bg-red/10 hover:border-red/40 hover:text-red transition-colors text-subtext0"
                        title="Eliminar visita"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Botón Continuar o Ver Informe (100% libre de 404) */}
                    <Link
                      href={`/entrevista/${e.token}`}
                      className="flex items-center gap-1.5 rounded-xl bg-gold text-black hover:bg-gold-light px-3.5 py-2 text-xs font-bold shadow-md shadow-gold/15 transition-all"
                    >
                      <span>{e.estado === "completado" ? "Ver informe" : "Continuar"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ MODAL DE EDICIÓN DE VISITA ══ */}
        {editModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl border border-overlay0/60 bg-surface0 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-gold" />
                  <h3 className="font-bold text-base text-text">Editar Expediente de Visita</h3>
                </div>
                <button onClick={() => setEditModal(null)} className="text-subtext0 hover:text-text">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <Input
                  label="Nombre del Postulante"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Cédula de Identidad (CI)"
                    value={editCedula}
                    onChange={(e) => setEditCedula(e.target.value)}
                  />
                  <Input
                    label="Teléfono / WhatsApp"
                    value={editTelefono}
                    onChange={(e) => setEditTelefono(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Ciudad"
                    value={editCiudad}
                    onChange={(e) => setEditCiudad(e.target.value)}
                  />
                  <Input
                    label="Entidad Solicitante"
                    value={editEntidad}
                    onChange={(e) => setEditEntidad(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Perito Asignado"
                    value={editEvaluador}
                    onChange={(e) => setEditEvaluador(e.target.value)}
                    required
                  />
                  <Select
                    label="Estado de la Visita"
                    value={editEstado}
                    onChange={(e) => setEditEstado(e.target.value as "pendiente" | "en_progreso" | "completado")}
                    options={[
                      { value: "pendiente", label: "Pendiente" },
                      { value: "en_progreso", label: "En progreso" },
                      { value: "completado", label: "Completado" },
                    ]}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-overlay0/30">
                  <Button type="button" variant="secondary" onClick={() => setEditModal(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" loading={actionLoading} className="bg-gold text-black font-bold">
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══ MODAL DE CONFIRMACIÓN DE ELIMINACIÓN ══ */}
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-red/40 bg-surface0 p-6 sm:p-8 shadow-2xl text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-red/10 text-red flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text">¿Eliminar este Expediente?</h3>
              <p className="text-xs text-subtext0 leading-relaxed">
                Se eliminará permanentemente la visita de <strong>{deleteModal.candidatoNombre || "Postulante"}</strong> ({deleteModal.entidadSolicitante}). Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setDeleteModal(null)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  loading={actionLoading}
                  onClick={handleConfirmDelete}
                  className="bg-red hover:bg-red/90 text-white font-bold"
                >
                  Sí, Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ══ MODAL DE CAMBIO DE CONTRASEÑA PROPIA ══ */}
        {passwordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-overlay0/60 bg-surface0 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-gold" />
                  <h3 className="font-bold text-base text-text">Cambiar mi Contraseña</h3>
                </div>
                <button onClick={() => setPasswordModalOpen(false)} className="text-subtext0 hover:text-text">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input
                  label="Contraseña Actual"
                  type="password"
                  value={passActual}
                  onChange={(e) => setPassActual(e.target.value)}
                  placeholder="••••••••••••"
                  required
                />
                <Input
                  label="Nueva Contraseña"
                  type="password"
                  value={passNueva}
                  onChange={(e) => setPassNueva(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <Input
                  label="Confirmar Nueva Contraseña"
                  type="password"
                  value={passConfirm}
                  onChange={(e) => setPassConfirm(e.target.value)}
                  placeholder="Repetir nueva contraseña"
                  required
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-overlay0/30">
                  <Button type="button" variant="secondary" onClick={() => setPasswordModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" loading={actionLoading} className="bg-gold text-black font-bold">
                    Actualizar Contraseña
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base p-8 animate-pulse" />}>
      <DashboardContent />
    </Suspense>
  );
}
