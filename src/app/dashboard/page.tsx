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
import {
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
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
  RotateCcw,
  Radio,
  ClipboardCheck,
  Send,
} from "lucide-react";

type EstadoVisita = "pendiente" | "en_progreso" | "revision" | "completado";

type ApartadoTab =
  | "activas"
  | "emitidas"
  | "en_proceso"
  | "para_evaluador"
  | "finalizadas"
  | "papelera";

interface EntrevistaItem {
  id: string;
  token: string;
  entidadSolicitante: string;
  candidatoNombre?: string;
  cedula?: string;
  telefono?: string;
  ciudad?: string;
  evaluadorAsignado?: string;
  estado: EstadoVisita;
  pasoActual: number;
  actualizadoEn: string;
  ultimaActividadCandidato?: string;
  enPapelera?: boolean;
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

const LIVE_THRESHOLD_MS = 2 * 60 * 1000; // 2 minutos para considerar "Rellenando en vivo"

function isActivelyFilling(item: EntrevistaItem): boolean {
  if (item.enPapelera) return false;
  if (item.estado === "completado" || item.estado === "revision") return false;
  if (!item.ultimaActividadCandidato) return false;
  const elapsed =
    Date.now() - new Date(item.ultimaActividadCandidato).getTime();
  return elapsed >= 0 && elapsed <= LIVE_THRESHOLD_MS;
}

function getApartado(
  item: EntrevistaItem
): "emitidas" | "en_proceso" | "para_evaluador" | "finalizadas" | "papelera" {
  if (item.enPapelera) return "papelera";
  if (item.estado === "completado") return "finalizadas";
  if (item.estado === "revision") return "para_evaluador";
  if (
    item.estado === "en_progreso" ||
    item.pasoActual > 1 ||
    Boolean(item.ultimaActividadCandidato)
  ) {
    return "en_proceso";
  }
  return "emitidas";
}

function sanitizeCsvCell(val: string | number | undefined): string {
  const str = String(val ?? "").replace(/"/g, '""');
  if (/^[=+\-@\t\r]/.test(str)) {
    return `"'${str}"`;
  }
  return `"${str}"`;
}

function estadoBadge(item: EntrevistaItem) {
  if (item.enPapelera) {
    return <Badge variant="danger">En Papelera</Badge>;
  }
  if (isActivelyFilling(item)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-extrabold border bg-green/20 text-green border-green/50 animate-pulse">
        <span className="h-2 w-2 rounded-full bg-green" />
        Rellenando ahora (Paso {item.pasoActual}/8)
      </span>
    );
  }
  const ap = getApartado(item);
  if (ap === "finalizadas") {
    return <Badge variant="success">Finalizada</Badge>;
  }
  if (ap === "para_evaluador") {
    return (
      <Badge variant="warning">
        Listo para Evaluador (Falta Paso 9)
      </Badge>
    );
  }
  if (ap === "en_proceso") {
    return <Badge variant="warning">En Proceso (Paso {item.pasoActual}/8)</Badge>;
  }
  return <Badge>Emitida (Sin ingresar)</Badge>;
}

function estadoIcon(item: EntrevistaItem) {
  if (item.enPapelera) {
    return <Trash2 className="h-5 w-5 text-red" aria-hidden="true" />;
  }
  if (isActivelyFilling(item)) {
    return <Radio className="h-5 w-5 text-green animate-pulse" aria-hidden="true" />;
  }
  const ap = getApartado(item);
  if (ap === "finalizadas") {
    return <CheckCircle className="h-5 w-5 text-green" aria-hidden="true" />;
  }
  if (ap === "para_evaluador") {
    return <ClipboardCheck className="h-5 w-5 text-gold" aria-hidden="true" />;
  }
  if (ap === "en_proceso") {
    return <Clock className="h-5 w-5 text-yellow" aria-hidden="true" />;
  }
  return <Send className="h-5 w-5 text-subtext0" aria-hidden="true" />;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [entrevistas, setEntrevistas] = useState<EntrevistaItem[]>([]);
  const [search, setSearch] = useState("");
  const [apartadoActivo, setApartadoActivo] = useState<ApartadoTab>("activas");
  const [orden, setOrden] = useState<SortField>("fecha");
  const [copiadoToken, setCopiadoToken] = useState<string | null>(null);

  const [editModal, setEditModal] = useState<EntrevistaItem | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    tipo: "success" | "error";
    text: string;
    undoToken?: string;
  } | null>(null);

  const [editNombre, setEditNombre] = useState("");
  const [editCedula, setEditCedula] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editCiudad, setEditCiudad] = useState("");
  const [editEntidad, setEditEntidad] = useState("");
  const [editEvaluador, setEditEvaluador] = useState("");
  const [editEstado, setEditEstado] = useState<EstadoVisita>("pendiente");

  const [passActual, setPassActual] = useState("");
  const [passNueva, setPassNueva] = useState("");
  const [passConfirm, setPassConfirm] = useState("");

  function mergeDashboardLists(
    currentList: EntrevistaItem[],
    serverList: EntrevistaItem[]
  ): EntrevistaItem[] {
    let deletedLocal: string[] = [];
    try {
      localStorage.removeItem("jerovia_deleted_tokens_v3");
      localStorage.removeItem("jerovia_deleted_tokens_v4");
      deletedLocal = JSON.parse(
        localStorage.getItem("jerovia_deleted_tokens_v5") || "[]"
      );
    } catch {}
    const delSet = new Set(deletedLocal);

    let trashLocal: Record<string, boolean> = {};
    try {
      trashLocal = JSON.parse(
        localStorage.getItem("jerovia_trash_state_v5") || "{}"
      );
    } catch {}

    const map = new Map<string, EntrevistaItem>();
    for (const item of currentList) {
      if (item && item.token && !delSet.has(item.token)) {
        map.set(item.token, item);
      }
    }

    const estadoRank: Record<string, number> = {
      pendiente: 0,
      en_progreso: 1,
      revision: 2,
      completado: 3,
    };

    for (const srv of serverList) {
      if (!srv || !srv.token || delSet.has(srv.token)) continue;
      const loc = map.get(srv.token);
      const localTrashOverride = trashLocal[srv.token];

      if (!loc) {
        map.set(srv.token, {
          ...srv,
          enPapelera:
            localTrashOverride !== undefined
              ? localTrashOverride
              : Boolean(srv.enPapelera),
        });
      } else {
        const bestEstado =
          (estadoRank[srv.estado] ?? 0) >= (estadoRank[loc.estado] ?? 0)
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
          enPapelera:
            localTrashOverride !== undefined
              ? localTrashOverride
              : srv.enPapelera !== undefined
              ? srv.enPapelera
              : loc.enPapelera,
        });
      }
    }

    const mergedArr = Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.actualizadoEn).getTime() -
        new Date(a.actualizadoEn).getTime()
    );

    try {
      const lightArr = mergedArr.map((item) => {
        const lightDatos: Record<string, unknown> = { ...(item.datos || {}) };
        delete lightDatos.fotosVivienda;
        delete lightDatos.fotoCandidato;
        delete lightDatos.firmaEvaluador;
        return { ...item, datos: lightDatos };
      });
      localStorage.setItem(
        "jerovia_dashboard_cache_v5",
        JSON.stringify(lightArr)
      );
    } catch {}

    return mergedArr;
  }

  async function loadInitial() {
    setLoading(true);
    try {
      localStorage.removeItem("jerovia_dashboard_cache_v3");
      const cachedRaw = localStorage.getItem("jerovia_dashboard_cache_v5");
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
    void loadInitial();
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
    const intervalId = setInterval(refreshLive, 4000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setEditModal(null);
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
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/entrevista/${item.token}`
        : "";
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

  // Mover a Papelera o Restaurar en 0ms (Optimistic UI Instantánea)
  function handleTogglePapeleraInstant(item: EntrevistaItem, moveToTrash: boolean) {
    try {
      const trashLocal: Record<string, boolean> = JSON.parse(
        localStorage.getItem("jerovia_trash_state_v5") || "{}"
      );
      trashLocal[item.token] = moveToTrash;
      localStorage.setItem("jerovia_trash_state_v5", JSON.stringify(trashLocal));
    } catch {}

    setEntrevistas((prev) =>
      prev.map((e) =>
        e.token === item.token ? { ...e, enPapelera: moveToTrash } : e
      )
    );

    if (moveToTrash) {
      setFeedbackMsg({
        tipo: "success",
        text: `"${item.candidatoNombre || "Expediente"}" movido a la Papelera.`,
        undoToken: item.token,
      });
    } else {
      setFeedbackMsg({
        tipo: "success",
        text: `"${item.candidatoNombre || "Expediente"}" restaurado a su apartado.`,
      });
    }

    // Sincronizar en segundo plano sin bloquear la interfaz
    void fetch(`/api/entrevista/${encodeURIComponent(item.token)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enPapelera: moveToTrash,
        _forceEstado: true,
      }),
    }).catch(() => {});
  }

  // Eliminación definitiva desde la Papelera (0ms optimista)
  function handlePermanentDeleteInstant(item: EntrevistaItem) {
    try {
      const deletedLocal: string[] = JSON.parse(
        localStorage.getItem("jerovia_deleted_tokens_v5") || "[]"
      );
      if (!deletedLocal.includes(item.token)) {
        deletedLocal.push(item.token);
        localStorage.setItem(
          "jerovia_deleted_tokens_v5",
          JSON.stringify(deletedLocal)
        );
      }
    } catch {}

    setEntrevistas((prev) => prev.filter((e) => e.token !== item.token));
    setFeedbackMsg({
      tipo: "success",
      text: `Expediente de "${item.candidatoNombre || "Postulante"}" eliminado definitivamente.`,
    });

    void fetch(`/api/entrevista/${encodeURIComponent(item.token)}`, {
      method: "DELETE",
    }).catch(() => {});
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
        : editEstado === "revision"
        ? 8
        : editEstado === "pendiente"
        ? 1
        : Math.max(2, editModal.pasoActual);

    // Actualizar optimísticamente en 0ms
    setEntrevistas((prev) =>
      prev.map((item) =>
        item.token === editModal.token
          ? {
              ...item,
              candidatoNombre: editNombre.trim(),
              cedula: editCedula.trim(),
              telefono: editTelefono.trim(),
              ciudad: editCiudad.trim(),
              entidadSolicitante: editEntidad.trim(),
              evaluadorAsignado: editEvaluador.trim(),
              estado: editEstado,
              pasoActual: nuevoPaso,
            }
          : item
      )
    );
    setEditModal(null);
    setActionLoading(false);
    setFeedbackMsg({
      tipo: "success",
      text: "Expediente actualizado correctamente.",
    });

    void fetch(`/api/entrevista/${encodeURIComponent(editModal.token)}`, {
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
    }).catch(() => {});
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passNueva !== passConfirm) {
      setFeedbackMsg({
        tipo: "error",
        text: "La nueva contraseña y su confirmación no coinciden.",
      });
      return;
    }
    setActionLoading(true);
    setFeedbackMsg(null);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passwordActual: passActual,
          nuevaPassword: passNueva,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "No se pudo cambiar la contraseña.");
      setFeedbackMsg({
        tipo: "success",
        text: "Contraseña actualizada exitosamente.",
      });
      setPasswordModalOpen(false);
      setPassActual("");
      setPassNueva("");
      setPassConfirm("");
    } catch (err: unknown) {
      setFeedbackMsg({
        tipo: "error",
        text:
          err instanceof Error ? err.message : "Error al cambiar contraseña.",
      });
    } finally {
      setActionLoading(false);
    }
  }

  // Contadores por cada apartado
  const counts = useMemo(() => {
    let activas = 0;
    let emitidas = 0;
    let enProceso = 0;
    let rellenandoVivo = 0;
    let paraEvaluador = 0;
    let finalizadas = 0;
    let papelera = 0;

    for (const e of entrevistas) {
      const ap = getApartado(e);
      if (ap === "papelera") {
        papelera++;
        continue;
      }
      activas++;
      if (isActivelyFilling(e)) rellenandoVivo++;
      if (ap === "emitidas") emitidas++;
      else if (ap === "en_proceso") enProceso++;
      else if (ap === "para_evaluador") paraEvaluador++;
      else if (ap === "finalizadas") finalizadas++;
    }

    const tasaEfectividad =
      activas > 0 ? Math.round((finalizadas / activas) * 100) : 0;

    return {
      activas,
      emitidas,
      enProceso,
      rellenandoVivo,
      paraEvaluador,
      finalizadas,
      papelera,
      tasaEfectividad,
    };
  }, [entrevistas]);

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = entrevistas.filter((e) => {
      const ap = getApartado(e);
      if (apartadoActivo === "papelera") {
        if (ap !== "papelera") return false;
      } else {
        if (ap === "papelera") return false;
        if (apartadoActivo !== "activas" && ap !== apartadoActivo) return false;
      }

      const matchSearch =
        !q ||
        (e.candidatoNombre || "").toLowerCase().includes(q) ||
        (e.cedula || "").toLowerCase().includes(q) ||
        e.entidadSolicitante.toLowerCase().includes(q) ||
        (e.evaluadorAsignado || "").toLowerCase().includes(q) ||
        (e.ciudad || "").toLowerCase().includes(q);

      return matchSearch;
    });

    return list.sort((a, b) => {
      // Priorizar siempre primero a quienes están rellenando en vivo ahora mismo
      const liveA = isActivelyFilling(a) ? 1 : 0;
      const liveB = isActivelyFilling(b) ? 1 : 0;
      if (liveA !== liveB) return liveB - liveA;

      if (orden === "fecha") {
        return (
          new Date(b.actualizadoEn).getTime() -
          new Date(a.actualizadoEn).getTime()
        );
      }
      if (orden === "nombre") {
        return (a.candidatoNombre || "").localeCompare(
          b.candidatoNombre || ""
        );
      }
      if (orden === "entidad") {
        return a.entidadSolicitante.localeCompare(b.entidadSolicitante);
      }
      if (orden === "progreso") {
        return b.pasoActual - a.pasoActual;
      }
      return 0;
    });
  }, [entrevistas, search, apartadoActivo, orden]);

  function handleExportCarteraCsv() {
    const headers = [
      "Token",
      "Postulante",
      "Cedula",
      "Entidad_Solicitante",
      "Ciudad",
      "Perito_Asignado",
      "Apartado",
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
      sanitizeCsvCell(getApartado(e)),
      sanitizeCsvCell(`${e.pasoActual}/9`),
      sanitizeCsvCell(e.actualizadoEn.slice(0, 10)),
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `cartera_jerovia_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const TABS: {
    id: ApartadoTab;
    label: string;
    count: number;
    badgeColor?: string;
    liveDot?: boolean;
  }[] = [
    { id: "activas", label: "Todas Activas", count: counts.activas },
    {
      id: "emitidas",
      label: "Emitidas (Sin ingresar)",
      count: counts.emitidas,
    },
    {
      id: "en_proceso",
      label:
        counts.rellenandoVivo > 0
          ? `Rellenando / En Proceso (${counts.rellenandoVivo} en vivo)`
          : "En Proceso",
      count: counts.enProceso,
      liveDot: counts.rellenandoVivo > 0,
    },
    {
      id: "para_evaluador",
      label: "Para Evaluador (Le toca a usted)",
      count: counts.paraEvaluador,
    },
    {
      id: "finalizadas",
      label: "Finalizadas",
      count: counts.finalizadas,
    },
    {
      id: "papelera",
      label: "Papelera",
      count: counts.papelera,
    },
  ];

  return (
    <div className="min-h-screen bg-base text-text">
      <nav
        aria-label="Navegación del panel pericial"
        className="border-b border-overlay0/50 bg-mantle sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/" aria-label="Volver a inicio">
              <Logo size="sm" />
            </Link>
            <div className="hidden md:block h-4 w-px bg-overlay0/60" />
            <span className="hidden md:block text-xs sm:text-sm text-subtext0 font-semibold">
              Gestión de Expedientes
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setPasswordModalOpen(true)}
              className="min-h-[40px] flex items-center gap-1.5 rounded-xl border border-overlay0/60 bg-surface1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-text hover:border-gold transition-colors cursor-pointer"
              title="Cambiar mi contraseña"
            >
              <Key className="h-4 w-4 text-gold" aria-hidden="true" />
              <span className="hidden lg:inline">Clave</span>
            </button>

            {esAdmin && (
              <Link
                href="/dashboard/usuarios"
                className="min-h-[40px] flex items-center gap-1.5 rounded-xl border border-overlay0/60 bg-surface1 px-3 py-1.5 text-xs sm:text-sm font-semibold text-text hover:border-gold transition-colors"
                title="Administrar personal y bitácora"
              >
                <Users className="h-4 w-4 text-gold" aria-hidden="true" />
                <span className="hidden sm:inline">Personal</span>
              </Link>
            )}

            <LogoutButton />

            {esAdmin && (
              <Link
                href="/dashboard/nueva"
                className="min-h-[40px] flex items-center gap-1.5 rounded-xl bg-gold px-4 py-1.5 text-xs sm:text-sm font-bold text-white hover:bg-gold-light transition-all shadow-xs"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                <span>Nueva Visita</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main
        id="main-content"
        tabIndex={-1}
        className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 outline-none space-y-6 sm:space-y-8"
      >
        {feedbackMsg && (
          <div
            role="status"
            aria-live="polite"
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 ${
              feedbackMsg.tipo === "success"
                ? "bg-green/10 border-green/30 text-green"
                : "bg-red/10 border-red/30 text-red"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMsg.tipo === "success" ? (
                <CheckCircle className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
            <div className="flex items-center gap-3">
              {feedbackMsg.undoToken && (
                <button
                  type="button"
                  onClick={() => {
                    const target = entrevistas.find(
                      (x) => x.token === feedbackMsg.undoToken
                    );
                    if (target) handleTogglePapeleraInstant(target, false);
                  }}
                  className="px-3 py-1 rounded-lg bg-green text-white font-bold text-xs cursor-pointer"
                >
                  Deshacer
                </button>
              )}
              <button
                onClick={() => setFeedbackMsg(null)}
                aria-label="Cerrar notificación"
                className="cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {errorParam === "unauthorized_role" && (
          <div
            role="alert"
            className="p-4 rounded-2xl bg-red/10 border border-red/30 text-xs sm:text-sm text-red font-semibold flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>
                Acceso restringido: solo los administradores pueden emitir enlaces o administrar personal.
              </span>
            </div>
            <Link
              href="/dashboard"
              className="underline font-bold text-red hover:opacity-80"
            >
              Cerrar
            </Link>
          </div>
        )}

        {/* Cabecera de Sesión y Acciones Rápidas */}
        <div className="rounded-2xl sm:rounded-3xl border border-overlay0/60 bg-surface0 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold shrink-0">
              {esAdmin ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <UserCheck className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-text">
                {currentUser?.name || "Cargando sesión..."}{" "}
                <span className="text-subtext0 font-medium text-xs sm:text-sm">
                  • {esAdmin ? "Administrador General" : "Perito Evaluador"}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-subtext0 mt-0.5">
                {esAdmin
                  ? "Control de cartera por apartados, detección en vivo y papelera instantánea"
                  : "Relevamiento en campo y cierre de expedientes asignados"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {esAdmin && (
              <a
                href="/api/backup"
                className="min-h-[40px] text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl border border-gold/50 bg-gold/10 hover:bg-gold/20 text-text transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Descargar respaldo completo de todos los expedientes en formato JSON"
              >
                <Download className="h-4 w-4 text-gold" aria-hidden="true" />
                <span>Respaldo Completo (.JSON)</span>
              </a>
            )}
            <button
              type="button"
              onClick={handleExportCarteraCsv}
              className="min-h-[40px] text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl border border-overlay0/80 bg-surface1 hover:border-gold text-text transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="h-4 w-4 text-gold" aria-hidden="true" />
              <span>Exportar Cartera CSV</span>
            </button>
          </div>
        </div>

        {/* Tarjetas de Indicadores Interactivas (Click para ir al apartado) */}
        <div className="space-y-4">
          <div
            className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
                <MetricCardSkeleton />
              </>
            ) : (
              [
                {
                  id: "emitidas" as ApartadoTab,
                  label: "Emitidas",
                  value: counts.emitidas,
                  sub: "Aún no ingresaron",
                  icon: Send,
                  color: "text-subtext1",
                },
                {
                  id: "en_proceso" as ApartadoTab,
                  label: "En Proceso",
                  value: counts.enProceso,
                  sub:
                    counts.rellenandoVivo > 0
                      ? `🟢 ${counts.rellenandoVivo} rellenando ahora`
                      : "Postulante completando",
                  icon: Clock,
                  color: "text-yellow",
                },
                {
                  id: "para_evaluador" as ApartadoTab,
                  label: "Para Evaluador",
                  value: counts.paraEvaluador,
                  sub: "Evaluado finalizó (Falta Paso 9)",
                  icon: ClipboardCheck,
                  color: "text-gold",
                },
                {
                  id: "finalizadas" as ApartadoTab,
                  label: "Finalizadas",
                  value: counts.finalizadas,
                  sub: `${counts.tasaEfectividad}% efectividad total`,
                  icon: CheckCircle,
                  color: "text-green",
                },
                {
                  id: "papelera" as ApartadoTab,
                  label: "Papelera",
                  value: counts.papelera,
                  sub: "Borrados restaurables",
                  icon: Trash2,
                  color: "text-red",
                },
              ].map((stat) => {
                const isSelected = apartadoActivo === stat.id;
                return (
                  <button
                    key={stat.label}
                    type="button"
                    onClick={() =>
                      setApartadoActivo(isSelected ? "activas" : stat.id)
                    }
                    className={`text-left rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-gold bg-gold/10 shadow-md"
                        : "border-overlay0/60 bg-surface0 hover:border-gold/50 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs sm:text-sm font-bold text-subtext0">
                        {stat.label}
                      </p>
                      <stat.icon
                        className={`h-4 w-4 ${stat.color}`}
                        aria-hidden="true"
                      />
                    </div>
                    <p
                      className={`text-2xl sm:text-3xl font-bold font-mono tabular-nums ${stat.color}`}
                    >
                      {stat.value}
                    </p>
                    <p className="text-xs text-subtext0 mt-1">{stat.sub}</p>
                  </button>
                );
              })
            )}
          </div>

          {!loading && (
            <div className="pt-1">
              <MetricsCharts
                totalExpedientes={counts.activas}
                completadas={counts.finalizadas}
              />
            </div>
          )}
        </div>

        {/* Listado de Expedientes con Pestañas de Apartados */}
        <div className="rounded-2xl sm:rounded-3xl border border-overlay0/60 bg-surface0 overflow-hidden shadow-xs space-y-5 p-4 sm:p-6">
          {/* Barra de Pestañas por Apartado */}
          <div className="flex flex-wrap items-center gap-2 border-b border-overlay0/50 pb-4">
            {TABS.map((t) => {
              const active = apartadoActivo === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setApartadoActivo(t.id)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                    active
                      ? "bg-gold text-white border-gold shadow-sm"
                      : "bg-surface1 text-subtext1 border-overlay0/70 hover:border-gold/50 hover:text-text"
                  }`}
                >
                  {t.liveDot && (
                    <span className="h-2.5 w-2.5 rounded-full bg-green animate-ping" />
                  )}
                  <span>{t.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-xs ${
                      active
                        ? "bg-black/25 text-white"
                        : "bg-surface2 text-text"
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-overlay0/40">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-text">
                {TABS.find((t) => t.id === apartadoActivo)?.label ||
                  "Expedientes"}
              </h2>
              <p className="text-xs sm:text-sm text-subtext0 mt-0.5 tabular-nums">
                Mostrando {filteredAndSorted.length} expediente
                {filteredAndSorted.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full lg:w-auto">
              <div className="flex items-center gap-2 rounded-xl border border-overlay0/70 bg-surface1 px-3.5 min-h-[42px] focus-within:border-gold">
                <Search
                  className="h-4 w-4 text-subtext0 shrink-0"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  placeholder="Buscar nombre, CI o ciudad..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-text outline-none w-full font-medium"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-subtext0 hover:text-text cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="min-h-[42px] flex items-center gap-2 bg-surface1 border border-overlay0/70 rounded-xl px-3.5 text-xs sm:text-sm font-semibold text-text">
                <ArrowUpDown
                  className="h-4 w-4 text-gold shrink-0"
                  aria-hidden="true"
                />
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as SortField)}
                  aria-label="Ordenar expedientes"
                  className="bg-transparent outline-none cursor-pointer text-xs sm:text-sm w-full"
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
              <h3 className="font-bold text-text text-sm sm:text-base">
                Sin expedientes en este apartado
              </h3>
              <p className="text-xs sm:text-sm text-subtext0 max-w-sm mx-auto">
                {apartadoActivo === "papelera"
                  ? "La papelera está vacía."
                  : search
                  ? "Pruebe con otro término de búsqueda."
                  : "No hay visitas registradas en esta sección por el momento."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-overlay0/30" role="list">
              {filteredAndSorted.map((e) => {
                const ap = getApartado(e);
                return (
                  <div
                    key={e.token}
                    role="listitem"
                    className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 hover:bg-surface1/40 rounded-xl px-2 sm:px-3 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="h-11 w-11 rounded-xl bg-surface1 border border-overlay0/50 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                        {estadoIcon(e)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5 mb-1">
                          <h3 className="font-bold text-text text-base sm:text-lg truncate">
                            {e.candidatoNombre || "Postulante sin nombre"}
                          </h3>
                          {estadoBadge(e)}
                          {e.cedula && (
                            <span className="text-xs sm:text-sm font-mono font-semibold text-subtext1 tabular-nums">
                              CI: {e.cedula}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-subtext0 tabular-nums">
                          <span className="font-semibold text-subtext1">
                            {e.entidadSolicitante}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin
                              className="h-3.5 w-3.5 text-gold"
                              aria-hidden="true"
                            />
                            {e.ciudad || "Gran Asunción"}
                          </span>
                          <span>•</span>
                          <span>Módulo {e.pasoActual}/9</span>
                          {e.evaluadorAsignado && (
                            <>
                              <span>•</span>
                              <span className="text-gold font-semibold">
                                {e.evaluadorAsignado}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>{formatDate(e.actualizadoEn.slice(0, 10))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Acciones Táctil */}
                    <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-overlay0/20">
                      {e.enPapelera ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleTogglePapeleraInstant(e, false)}
                            className="min-h-[40px] px-3.5 rounded-xl bg-gold text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
                            title="Restaurar expediente inmediatamente"
                          >
                            <RotateCcw className="h-4 w-4" />
                            <span>Restaurar</span>
                          </button>
                          {esAdmin && (
                            <button
                              type="button"
                              onClick={() => handlePermanentDeleteInstant(e)}
                              className="min-h-[40px] px-3.5 rounded-xl border border-red/40 bg-red/10 hover:bg-red text-red hover:text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Eliminar definitivamente"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Borrar definitivo</span>
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <a
                            href={`/api/exportar/${encodeURIComponent(e.token)}?formato=pdf&t=${encodeURIComponent(e.actualizadoEn)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[40px] px-3 rounded-xl border border-gold/50 bg-gold/10 hover:bg-gold/20 transition-colors text-text flex items-center gap-1.5 text-xs sm:text-sm font-bold"
                            title="Abrir Informe en 5 Páginas (PDF)"
                          >
                            <FileText className="h-4 w-4 text-gold" />
                            <span>PDF</span>
                          </a>

                          <a
                            href={`/api/exportar/${encodeURIComponent(e.token)}?formato=pptx&t=${encodeURIComponent(e.actualizadoEn)}`}
                            className="min-h-[40px] px-3 rounded-xl border border-overlay0/70 bg-surface1 hover:border-gold transition-colors text-text flex items-center gap-1.5 text-xs sm:text-sm font-bold"
                            title="Descargar Informe PowerPoint (.PPTX)"
                          >
                            <Download className="h-4 w-4 text-gold" />
                            <span>PPTX</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCopyLink(e.token)}
                            className="min-h-[40px] px-3 rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold transition-colors text-subtext1 hover:text-text flex items-center gap-1.5 text-xs sm:text-sm font-medium cursor-pointer"
                            title="Copiar enlace de la entrevista"
                          >
                            {copiadoToken === e.token ? (
                              <>
                                <Check className="h-4 w-4 text-green" />
                                <span className="sm:hidden">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" />
                                <span className="sm:hidden">Enlace</span>
                              </>
                            )}
                          </button>

                          <a
                            href={buildWhatsAppUrl(e)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[40px] px-3 rounded-xl border border-overlay0/60 bg-surface1 hover:border-green/50 transition-colors text-subtext1 hover:text-green flex items-center gap-1.5 text-xs sm:text-sm font-medium"
                            title="Enviar enlace por WhatsApp"
                          >
                            <Share2 className="h-4 w-4" />
                            <span className="sm:hidden">WhatsApp</span>
                          </a>

                          {esAdmin && (
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(e)}
                              className="min-h-[40px] min-w-[40px] rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold transition-colors text-subtext1 hover:text-text flex items-center justify-center cursor-pointer"
                              title="Editar expediente"
                              aria-label="Editar expediente"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}

                          {esAdmin && (
                            <button
                              type="button"
                              onClick={() => handleTogglePapeleraInstant(e, true)}
                              className="min-h-[40px] min-w-[40px] rounded-xl border border-overlay0/60 hover:bg-red/10 hover:border-red/40 hover:text-red transition-colors text-subtext0 flex items-center justify-center cursor-pointer"
                              title="Mover a la papelera instantáneamente"
                              aria-label="Mover a la papelera"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}

                          <Link
                            href={`/entrevista/${e.token}`}
                            className="min-h-[40px] flex items-center gap-1.5 rounded-xl bg-gold text-white hover:bg-gold-light px-4 py-1.5 text-xs sm:text-sm font-bold transition-all"
                          >
                            <span>
                              {ap === "para_evaluador"
                                ? "Completar Paso 9"
                                : ap === "finalizadas"
                                ? "Ver / Editar"
                                : "Abrir"}
                            </span>
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Editar */}
        {editModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <div className="w-full max-w-lg rounded-2xl sm:rounded-3xl border border-overlay0/80 bg-surface0 p-5 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-overlay0/40">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-gold" />
                  <h3 className="font-bold text-base text-text">
                    Editar Expediente
                  </h3>
                </div>
                <button
                  onClick={() => setEditModal(null)}
                  className="text-subtext0 hover:text-text p-1 cursor-pointer"
                  aria-label="Cerrar modal"
                >
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
                    label="Apartado / Estado"
                    value={editEstado}
                    onChange={(e) =>
                      setEditEstado(e.target.value as EstadoVisita)
                    }
                    options={[
                      { value: "pendiente", label: "Emitida (Sin ingresar)" },
                      { value: "en_progreso", label: "En Proceso (Rellenando)" },
                      {
                        value: "revision",
                        label: "Para Evaluador (Evaluado finalizó)",
                      },
                      { value: "completado", label: "Finalizada (Homologada)" },
                    ]}
                  />
                </div>
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-overlay0/40">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setEditModal(null)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" loading={actionLoading}>
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Cambiar Contraseña */}
        {passwordModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          >
            <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-overlay0/80 bg-surface0 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-overlay0/40">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-gold" />
                  <h3 className="font-bold text-base text-text">
                    Cambiar Contraseña
                  </h3>
                </div>
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="text-subtext0 hover:text-text p-1 cursor-pointer"
                  aria-label="Cerrar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <Input
                  label="Contraseña Actual"
                  type="password"
                  value={passActual}
                  onChange={(e) => setPassActual(e.target.value)}
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
                  required
                />
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-overlay0/40">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setPasswordModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" loading={actionLoading}>
                    Actualizar
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
