"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { Badge, Input, Select } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { MetricCardSkeleton, InterviewRowSkeleton } from "@/components/ui/Skeleton";
import { MetricsCharts } from "@/components/ui/MetricsCharts";
import { formatDate } from "@/lib/utils";
import type { EntrevistaRecord } from "@/lib/store";
import {
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Users,
  X,
  ShieldAlert,
  UserCheck,
  Trash2,
  Edit3,
  Copy,
  Check,
  ArrowUpDown,
  Key,
  MapPin,
  Download,
  Share2,
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
  creadoEn?: string;
  datos?: Record<string, unknown>;
  alertas?: string[];
}

interface CurrentUser {
  userId: string;
  username: string;
  email: string;
  name: string;
  role: "admin" | "evaluador";
}

type SortField = "fecha" | "nombre" | "entidad" | "progreso";

function sanitizeCsvCell(val: string | number | undefined): string {
  const str = String(val ?? "").replace(/"/g, '""');
  if (/^[=+\-@\t\r]/.test(str)) {
    return `"'${str}"`;
  }
  return `"${str}"`;
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

function DashboardContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [entrevistas, setEntrevistas] = useState<EntrevistaItem[]>([]);
  const [search, setSearch] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "completado" | "en_progreso" | "pendiente">("todos");
  const [orden, setOrden] = useState<SortField>("fecha");
  const [copiadoToken, setCopiadoToken] = useState<string | null>(null);

  const [editModal, setEditModal] = useState<EntrevistaItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<EntrevistaItem | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ tipo: "success" | "error"; text: string } | null>(null);

  const [editNombre, setEditNombre] = useState("");
  const [editCedula, setEditCedula] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editCiudad, setEditCiudad] = useState("");
  const [editEntidad, setEditEntidad] = useState("");
  const [editEvaluador, setEditEvaluador] = useState("");
  const [editEstado, setEditEstado] = useState<"pendiente" | "en_progreso" | "completado">("pendiente");

  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirm, setPassConfirm] = useState("");

  function mergeDashboardLists(
    currentList: EntrevistaItem[],
    serverList: EntrevistaItem[]
  ): EntrevistaItem[] {
    let deletedLocal: string[] = [];
    try {
      deletedLocal = JSON.parse(
        localStorage.getItem("jerovia_deleted_tokens_v3") || "[]"
      );
    } catch {}
    const delSet = new Set(deletedLocal);

    const map = new Map<string, EntrevistaItem>();
    for (const item of currentList) {
      if (item && item.token && !delSet.has(item.token)) {
        map.set(item.token, item);
      }
    }

    const estadoRank: Record<string, number> = {
      pendiente: 0,
      en_progreso: 1,
      completado: 2,
    };

    for (const srv of serverList) {
      if (!srv || !srv.token || delSet.has(srv.token)) continue;
      const loc = map.get(srv.token);
      if (!loc) {
        map.set(srv.token, srv);
      } else {
        const bestEstado =
          (estadoRank[srv.estado] || 0) >= (estadoRank[loc.estado] || 0)
            ? srv.estado
            : loc.estado;
        const bestPaso = Math.max(loc.pasoActual || 1, srv.pasoActual || 1);
        const mergedDatos = { ...(loc.datos || {}), ...(srv.datos || {}) };
        for (const [k, v] of Object.entries(loc.datos || {})) {
          if (
            v !== undefined &&
            v !== null &&
            v !== "" &&
            ((srv.datos as Record<string, unknown>)?.[k] === undefined ||
              (srv.datos as Record<string, unknown>)?.[k] === "")
          ) {
            (mergedDatos as Record<string, unknown>)[k] = v;
          }
        }
        map.set(srv.token, {
          ...loc,
          ...srv,
          estado: bestEstado,
          pasoActual: bestPaso,
          datos: mergedDatos,
        });
      }
    }

    const mergedArr = Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.actualizadoEn).getTime() -
        new Date(a.actualizadoEn).getTime()
    );

    try {
      // Guardar versión liviana en localStorage sin cadenas Base64 pesadas para evitar QuotaExceededError
      const lightArr = mergedArr.map((item) => {
        const lightDatos: Record<string, unknown> = { ...(item.datos || {}) };
        delete lightDatos.fotosVivienda;
        delete lightDatos.fotoCandidato;
        delete lightDatos.firmaEvaluador;
        return { ...item, datos: lightDatos };
      });
      localStorage.setItem(
        "jerovia_dashboard_cache_v3",
        JSON.stringify(lightArr)
      );
    } catch {}

    // Si algún registro de nuestra caché no estaba en absoluto en el servidor, restaurarlo solo si falta (onlyIfMissing)
    const srvTokens = new Set(serverList.map((s) => s.token));
    for (const item of mergedArr) {
      if (!srvTokens.has(item.token) && !delSet.has(item.token)) {
        fetch(`/api/entrevista/${encodeURIComponent(item.token)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...item, onlyIfMissing: true }),
        }).catch(() => {});
      }
    }

    return mergedArr;
  }

  async function loadInitial() {
    setLoading(true);
    try {
      const cachedRaw = localStorage.getItem("jerovia_dashboard_cache_v3");
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw) as EntrevistaItem[];
        if (Array.isArray(cached) && cached.length > 0) {
          setEntrevistas(cached);
        }
      }
    } catch {}

    try {
      const [meRes, entRes] = await Promise.all([
        fetch("/api/auth/me", { cache: "no-store" }),
        fetch(`/api/entrevista?_t=${Date.now()}`, { cache: "no-store" }),
      ]);
      if (meRes.ok) {
        const meData = await meRes.json();
        setCurrentUser(meData.user || null);
      }
      if (entRes.ok) {
        const serverData = await entRes.json();
        if (Array.isArray(serverData)) {
          setEntrevistas((prev) => mergeDashboardLists(prev, serverData));
        }
      }
    } catch (e) {
      console.error("Error cargando datos:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitial();
    const refreshLive = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(`/api/entrevista?_t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setEntrevistas((prev) => mergeDashboardLists(prev, data));
          }
        }
      } catch {}
    };
    const intervalId = setInterval(refreshLive, 4500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setEditModal(null);
        setDeleteModal(null);
        setPasswordModalOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const esAdmin = currentUser?.role === "admin";

  function handleCopyLink(token: string) {
    const url = `${window.location.origin}/entrevista/${token}`;
    navigator.clipboard.writeText(url);
    setCopiadoToken(token);
    setTimeout(() => setCopiadoToken(null), 2500);
  }

  function buildWhatsAppUrl(item: EntrevistaItem): string {
    const url = typeof window !== "undefined" ? `${window.location.origin}/entrevista/${item.token}` : "";
    const msg = `Estimado/a ${item.candidatoNombre || "postulante"}, le saluda Jerovia Consultora. Para el estudio socioambiental solicitado por ${item.entidadSolicitante}, acceda a su enlace: ${url}`;
    const rawTel = (item.telefono || "").replace(/\D/g, "");
    const cleanTel = rawTel
      ? rawTel.startsWith("595")
        ? rawTel
        : `595${rawTel.replace(/^0/, "")}`
      : "";
    return cleanTel
      ? `https://wa.me/${cleanTel}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`;
  }

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

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editModal) return;
    setActionLoading(true);
    setFeedbackMsg(null);

    const nuevoPaso =
      editEstado === "completado"
        ? 9
        : editEstado === "pendiente"
        ? 1
        : Math.max(2, editModal.pasoActual);

    try {
      const res = await fetch(`/api/entrevista/${editModal.token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidatoNombre: editNombre.trim(),
          cedula: editCedula.trim(),
          telefono: editTelefono.trim(),
          ciudad: editCiudad.trim(),
          entidadSolicitante: editEntidad.trim(),
          evaluadorAsignado: editEvaluador.trim(),
          estado: editEstado,
          pasoActual: nuevoPaso,
          _forceEstado: true,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "No se pudo actualizar el registro.");
      }

      setFeedbackMsg({ tipo: "success", text: "Expediente actualizado correctamente." });
      setEditModal(null);
      await loadInitial();
    } catch (err: unknown) {
      setFeedbackMsg({
        tipo: "error",
        text: err instanceof Error ? err.message : "Error al actualizar.",
      });
    } finally {
      setActionLoading(false);
    }
  }

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
      try {
        const deletedLocal: string[] = JSON.parse(
          localStorage.getItem("jerovia_deleted_tokens_v3") || "[]"
        );
        if (!deletedLocal.includes(deleteModal.token)) {
          deletedLocal.push(deleteModal.token);
          localStorage.setItem(
            "jerovia_deleted_tokens_v3",
            JSON.stringify(deletedLocal)
          );
        }
      } catch {}
      setEntrevistas((prev) =>
        prev.filter((item) => item.token !== deleteModal.token)
      );
      setFeedbackMsg({ tipo: "success", text: "Expediente eliminado con éxito." });
      setDeleteModal(null);
      await loadInitial();
    } catch (err: unknown) {
      setFeedbackMsg({
        tipo: "error",
        text: err instanceof Error ? err.message : "Error al eliminar.",
      });
    } finally {
      setActionLoading(false);
    }
  }

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
      setFeedbackMsg({
        tipo: "error",
        text: err instanceof Error ? err.message : "Error al cambiar contraseña.",
      });
    } finally {
      setActionLoading(false);
    }
  }

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = entrevistas.filter((e) => {
      const matchSearch =
        !q ||
        (e.candidatoNombre || "").toLowerCase().includes(q) ||
        (e.cedula || "").toLowerCase().includes(q) ||
        e.entidadSolicitante.toLowerCase().includes(q) ||
        (e.evaluadorAsignado || "").toLowerCase().includes(q) ||
        (e.ciudad || "").toLowerCase().includes(q);
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

  function handleExportCarteraCsv() {
    const headers = [
      "Token",
      "Postulante",
      "Cedula",
      "Entidad_Solicitante",
      "Ciudad",
      "Perito_Asignado",
      "Estado",
      "Modulo_Actual",
      "Ultima_Actualizacion",
    ];
    const rows = filteredAndSorted.map((e) => [
      sanitizeCsvCell(e.token),
      sanitizeCsvCell(e.candidatoNombre || "Sin nombre"),
      sanitizeCsvCell(e.cedula || ""),
      sanitizeCsvCell(e.entidadSolicitante),
      sanitizeCsvCell(e.ciudad || "Gran Asunción"),
      sanitizeCsvCell(e.evaluadorAsignado || ""),
      sanitizeCsvCell(e.estado),
      sanitizeCsvCell(`${e.pasoActual}/9`),
      sanitizeCsvCell(e.actualizadoEn.slice(0, 10)),
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `cartera_jerovia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const stats = useMemo(() => {
    const total = entrevistas.length;
    const completadas = entrevistas.filter((e) => e.estado === "completado").length;
    const enProgreso = entrevistas.filter((e) => e.estado === "en_progreso").length;
    const pendientes = entrevistas.filter((e) => e.estado === "pendiente").length;
    const tasaEfectividad = total > 0 ? Math.round((completadas / total) * 100) : 0;
    return { total, completadas, enProgreso, pendientes, tasaEfectividad };
  }, [entrevistas]);

  return (
    <div className="min-h-screen bg-base text-text">
      {/* Barra Superior Responsiva (Acceso completo en Celular y PC) */}
      <nav aria-label="Navegación del panel pericial" className="border-b border-overlay0/50 bg-mantle sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/" aria-label="Volver a inicio">
              <Logo size="sm" />
            </Link>
            <div className="hidden md:block h-4 w-px bg-overlay0/60" />
            <span className="hidden md:block text-xs text-subtext0 font-semibold">
              Gestión de Expedientes
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setPasswordModalOpen(true)}
              className="min-h-[38px] flex items-center gap-1.5 rounded-xl border border-overlay0/60 bg-surface1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-text hover:border-gold transition-colors"
              title="Cambiar mi contraseña"
            >
              <Key className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span className="hidden lg:inline">Clave</span>
            </button>

            {esAdmin && (
              <Link
                href="/dashboard/usuarios"
                className="min-h-[38px] flex items-center gap-1.5 rounded-xl border border-overlay0/60 bg-surface1 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-text hover:border-gold transition-colors"
                title="Administrar personal y bitácora"
              >
                <Users className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                <span className="hidden sm:inline">Personal</span>
              </Link>
            )}

            <LogoutButton />

            {esAdmin && (
              <Link
                href="/dashboard/nueva"
                className="min-h-[38px] flex items-center gap-1.5 rounded-xl bg-gold px-3 sm:px-3.5 py-1.5 text-xs font-bold text-black hover:bg-gold-light transition-all shadow-xs"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Nueva</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 outline-none space-y-6 sm:space-y-8">
        {feedbackMsg && (
          <div
            role="status"
            aria-live="polite"
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
            <button onClick={() => setFeedbackMsg(null)} aria-label="Cerrar notificación">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {errorParam === "unauthorized_role" && (
          <div role="alert" className="p-4 rounded-2xl bg-red/10 border border-red/30 text-xs text-red font-semibold flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>Acceso restringido: solo los administradores pueden emitir enlaces o administrar personal.</span>
            </div>
            <Link href="/dashboard" className="underline font-bold text-red hover:opacity-80">
              Cerrar
            </Link>
          </div>
        )}

        {/* Cabecera de Sesión y Acciones Rápidas */}
        <div className="rounded-2xl sm:rounded-3xl border border-overlay0/60 bg-surface0 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0">
              {esAdmin ? <ShieldCheck className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-bold text-text">
                {currentUser?.name || "Cargando sesión..."}{" "}
                <span className="text-subtext0 font-medium text-xs">
                  • {esAdmin ? "Administrador General" : "Perito Evaluador"}
                </span>
              </p>
              <p className="text-xs text-subtext0 mt-0.5">
                {esAdmin
                  ? "Control de cartera, emisión de enlaces y auditoría de legajos"
                  : "Relevamiento en campo y actualización de expedientes asignados"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCarteraCsv}
              className="min-h-[38px] text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-overlay0/80 bg-surface1 hover:border-gold text-text transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span>Exportar Cartera CSV</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Indicadores con Números Tabulares */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" aria-busy={loading}>
            {loading ? (
              <>
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </>
            ) : (
              [
                { label: "Total Cartera", value: stats.total, sub: "Expedientes activos", icon: FileText, color: "text-text" },
                { label: "Dictámenes Emitidos", value: stats.completadas, sub: `${stats.tasaEfectividad}% completado`, icon: CheckCircle, color: "text-green" },
                { label: "En Relevamiento", value: stats.enProgreso, sub: "Inspección en curso", icon: Clock, color: "text-yellow" },
                { label: "Pendientes", value: stats.pendientes, sub: "Por iniciar", icon: AlertCircle, color: "text-subtext0" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-overlay0/60 p-4 sm:p-5 bg-surface0 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-subtext0">{stat.label}</p>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} aria-hidden="true" />
                  </div>
                  <p className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-subtext0 mt-1">{stat.sub}</p>
                </div>
              ))
            )}
          </div>

          {!loading && (
            <div className="pt-1">
              <MetricsCharts totalExpedientes={stats.total} completadas={stats.completadas} />
            </div>
          )}
        </div>

        {/* Listado de Expedientes */}
        <div className="rounded-2xl sm:rounded-3xl border border-overlay0/60 bg-surface0 overflow-hidden shadow-xs space-y-4 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-overlay0/40">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-text">Expedientes de Visita</h2>
              <p className="text-xs text-subtext0 mt-0.5 tabular-nums">
                Mostrando {filteredAndSorted.length} expediente{filteredAndSorted.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
              <div className="flex items-center gap-2 rounded-xl border border-overlay0/70 bg-surface1 px-3 min-h-[40px] focus-within:border-gold">
                <Search className="h-3.5 w-3.5 text-subtext0 shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Buscar nombre, CI o ciudad..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-xs text-text outline-none w-full font-medium"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-subtext0 hover:text-text" aria-label="Limpiar búsqueda">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as "todos" | "completado" | "en_progreso" | "pendiente")}
                aria-label="Filtrar por estado"
                className="min-h-[40px] text-xs font-semibold bg-surface1 border border-overlay0/70 rounded-xl px-3 text-text outline-none cursor-pointer"
              >
                <option value="todos">Todos los estados</option>
                <option value="completado">Completados</option>
                <option value="en_progreso">En progreso</option>
                <option value="pendiente">Pendientes</option>
              </select>

              <div className="min-h-[40px] flex items-center gap-1.5 bg-surface1 border border-overlay0/70 rounded-xl px-3 text-xs font-semibold text-text">
                <ArrowUpDown className="h-3.5 w-3.5 text-gold shrink-0" aria-hidden="true" />
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as SortField)}
                  aria-label="Ordenar expedientes"
                  className="bg-transparent outline-none cursor-pointer text-xs w-full"
                >
                  <option value="fecha">Más recientes</option>
                  <option value="nombre">Nombre (A-Z)</option>
                  <option value="entidad">Entidad</option>
                  <option value="progreso">Mayor avance</option>
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
            <div className="py-14 text-center space-y-3">
              <FileText className="h-9 w-9 text-subtext0 mx-auto" />
              <h3 className="font-bold text-text text-sm">Sin expedientes coincidentes</h3>
              <p className="text-xs text-subtext0 max-w-sm mx-auto">
                {search ? "Pruebe con otro término de búsqueda o cambie el filtro de estado." : "Aún no se han registrado visitas."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-overlay0/30" role="list">
              {filteredAndSorted.map((e) => (
                <div
                  key={e.token}
                  role="listitem"
                  className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 hover:bg-surface1/40 rounded-xl px-2 sm:px-3 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-surface1 border border-overlay0/50 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      {estadoIcon(e.estado)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-text text-sm truncate">
                          {e.candidatoNombre || "Postulante sin nombre"}
                        </h3>
                        {estadoBadge(e.estado)}
                        {e.cedula && (
                          <span className="text-[11px] font-mono text-subtext0 tabular-nums">
                            CI: {e.cedula}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-subtext0 tabular-nums">
                        <span className="font-semibold text-subtext1">{e.entidadSolicitante}</span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gold" aria-hidden="true" />
                          {e.ciudad || "Gran Asunción"}
                        </span>
                        <span>•</span>
                        <span>Módulo {e.pasoActual}/9</span>
                        {e.evaluadorAsignado && (
                          <>
                            <span>•</span>
                            <span className="text-gold font-medium">{e.evaluadorAsignado}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{formatDate(e.actualizadoEn.slice(0, 10))}</span>
                      </div>
                    </div>
                  </div>

                  {/* Barra de Acciones Táctil */}
                  <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-overlay0/20">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(e.token)}
                      className="min-h-[38px] px-2.5 rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold transition-colors text-subtext1 hover:text-text flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                      title="Copiar enlace de la entrevista"
                    >
                      {copiadoToken === e.token ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-green" />
                          <span className="sm:hidden">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span className="sm:hidden">Enlace</span>
                        </>
                      )}
                    </button>

                    <a
                      href={buildWhatsAppUrl(e)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[38px] px-2.5 rounded-xl border border-overlay0/60 bg-surface1 hover:border-green/50 transition-colors text-subtext1 hover:text-green flex items-center gap-1.5 text-xs font-medium"
                      title="Enviar enlace por WhatsApp"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span className="sm:hidden">WhatsApp</span>
                    </a>

                    {esAdmin && (
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(e)}
                        className="min-h-[38px] min-w-[38px] rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold transition-colors text-subtext1 hover:text-text flex items-center justify-center cursor-pointer"
                        title="Editar expediente"
                        aria-label="Editar expediente"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {esAdmin && (
                      <button
                        type="button"
                        onClick={() => setDeleteModal(e)}
                        className="min-h-[38px] min-w-[38px] rounded-xl border border-overlay0/60 hover:bg-red/10 hover:border-red/40 hover:text-red transition-colors text-subtext0 flex items-center justify-center cursor-pointer"
                        title="Eliminar expediente"
                        aria-label="Eliminar expediente"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <Link
                      href={`/entrevista/${e.token}`}
                      className="min-h-[38px] flex items-center gap-1.5 rounded-xl bg-gold text-black hover:bg-gold-light px-3.5 py-1.5 text-xs font-bold transition-all"
                    >
                      <span>{e.estado === "completado" ? "Ver informe" : "Abrir"}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Editar */}
        {editModal && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-overlay0/80 bg-surface0 p-5 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-overlay0/40">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-gold" />
                  <h3 className="font-bold text-base text-text">Editar Expediente</h3>
                </div>
                <button onClick={() => setEditModal(null)} className="text-subtext0 hover:text-text p-1" aria-label="Cerrar modal">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSaveEdit} className="space-y-4">
                <Input label="Nombre del Postulante" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Cédula de Identidad (CI)" value={editCedula} onChange={(e) => setEditCedula(e.target.value)} />
                  <Input label="Teléfono / WhatsApp" value={editTelefono} onChange={(e) => setEditTelefono(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Ciudad" value={editCiudad} onChange={(e) => setEditCiudad(e.target.value)} />
                  <Input label="Entidad Solicitante" value={editEntidad} onChange={(e) => setEditEntidad(e.target.value)} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Perito Asignado" value={editEvaluador} onChange={(e) => setEditEvaluador(e.target.value)} required />
                  <Select
                    label="Estado"
                    value={editEstado}
                    onChange={(e) => setEditEstado(e.target.value as "pendiente" | "en_progreso" | "completado")}
                    options={[
                      { value: "pendiente", label: "Pendiente" },
                      { value: "en_progreso", label: "En progreso" },
                      { value: "completado", label: "Completado" },
                    ]}
                  />
                </div>
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-overlay0/40">
                  <Button type="button" variant="secondary" onClick={() => setEditModal(null)}>Cancelar</Button>
                  <Button type="submit" loading={actionLoading}>Guardar Cambios</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Eliminar */}
        {deleteModal && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-red/40 bg-surface0 p-6 shadow-2xl text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-red/10 text-red flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text">¿Eliminar este Expediente?</h3>
              <p className="text-xs text-subtext0 leading-relaxed">
                Se eliminará permanentemente la visita de <strong>{deleteModal.candidatoNombre || "Postulante"}</strong> ({deleteModal.entidadSolicitante}).
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setDeleteModal(null)}>Cancelar</Button>
                <Button type="button" variant="danger" loading={actionLoading} onClick={handleConfirmDelete}>
                  Sí, Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Cambiar Contraseña */}
        {passwordModalOpen && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-overlay0/80 bg-surface0 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-overlay0/40">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-gold" />
                  <h3 className="font-bold text-base text-text">Cambiar Contraseña</h3>
                </div>
                <button onClick={() => setPasswordModalOpen(false)} className="text-subtext0 hover:text-text p-1" aria-label="Cerrar modal">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input label="Contraseña Actual" type="password" value={passActual} onChange={(e) => setPassActual(e.target.value)} required />
                <Input label="Nueva Contraseña" type="password" value={passNueva} onChange={(e) => setPassNueva(e.target.value)} placeholder="Mínimo 6 caracteres" required />
                <Input label="Confirmar Nueva Contraseña" type="password" value={passConfirm} onChange={(e) => setPassConfirm(e.target.value)} required />
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-overlay0/40">
                  <Button type="button" variant="secondary" onClick={() => setPasswordModalOpen(false)}>Cancelar</Button>
                  <Button type="submit" loading={actionLoading}>Actualizar</Button>
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
