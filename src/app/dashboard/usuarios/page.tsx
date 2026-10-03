"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/FormFields";
import { formatDate } from "@/lib/utils";
import { 
  ArrowLeft, UserPlus, Users, Shield, UserCheck, 
  Trash2, Power, CheckCircle, X, ShieldAlert,
  Key, Edit3, Search, History, RefreshCw, Copy, Check,
  Clock, ShieldCheck, Lock
} from "lucide-react";

interface SafeUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "admin" | "evaluador";
  activo: boolean;
  creadoEn: string;
  ultimoAcceso?: string;
  cargo?: string;
  telefono?: string;
}

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  detail: string;
  ip?: string;
}

export default function UsuariosPage() {
  const [tab, setTab] = useState<"usuarios" | "auditoria">("usuarios");
  const [usuarios, setUsuarios] = useState<SafeUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [auditLoading, setAuditLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"todos" | "admin" | "evaluador">("todos");
  const [filterStatus, setFilterStatus] = useState<"todos" | "activos" | "inactivos">("todos");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modales
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<SafeUser | null>(null);
  const [passwordModal, setPasswordModal] = useState<SafeUser | null>(null);
  const [deleteModal, setDeleteModal] = useState<SafeUser | null>(null);

  // Formulario nuevo usuario
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [role, setRole] = useState<"evaluador" | "admin">("evaluador");
  const [password, setPassword] = useState("");

  // Formulario editar usuario
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCargo, setEditCargo] = useState("");
  const [editTelefono, setEditTelefono] = useState("");
  const [editRole, setEditRole] = useState<"evaluador" | "admin">("evaluador");

  // Formulario cambiar contraseña
  const [newPassword, setNewPassword] = useState("");
  const [copiedKey, setCopiedKey] = useState(false);

  // Helper de generador de contraseña
  function handleGeneratePassword() {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%*";
    let pwd = "Jv-";
    for (let i = 0; i < 9; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pwd);
    setNewPassword(pwd);
  }

  function handleCopyPassword(pwd: string) {
    navigator.clipboard.writeText(pwd);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  }

  async function loadUsuarios() {
    try {
      const res = await fetch("/api/usuarios");
      if (!res.ok) throw new Error("No se pudo obtener la lista de usuarios.");
      const data = await res.json();
      setUsuarios(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }

  async function loadAudit() {
    setAuditLoading(true);
    try {
      const res = await fetch("/api/audit?limit=60");
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
      }
    } catch (err) {
      console.error("Error al cargar auditoría:", err);
    } finally {
      setAuditLoading(false);
    }
  }

  useEffect(() => {
    loadUsuarios();
    loadAudit();
  }, []);

  const filteredUsers = useMemo(() => {
    return usuarios.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.cargo || "").toLowerCase().includes(search.toLowerCase());

      const matchRole = filterRole === "todos" || u.role === filterRole;
      const matchStatus =
        filterStatus === "todos" ||
        (filterStatus === "activos" && u.activo) ||
        (filterStatus === "inactivos" && !u.activo);

      return matchSearch && matchRole && matchStatus;
    });
  }, [usuarios, search, filterRole, filterStatus]);

  // Crear usuario
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, cargo, telefono, role, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear usuario.");

      setSuccess(`Personal ${data.name} registrado con éxito.`);
      setName("");
      setUsername("");
      setEmail("");
      setCargo("");
      setTelefono("");
      setPassword("");
      setRole("evaluador");
      setCreateModalOpen(false);
      await loadUsuarios();
      await loadAudit();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar usuario.");
    } finally {
      setSubmitting(false);
    }
  }

  // Abrir modal editar usuario
  function handleOpenEdit(u: SafeUser) {
    setEditModal(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditCargo(u.cargo || "");
    setEditTelefono(u.telefono || "");
    setEditRole(u.role);
  }

  // Guardar edición usuario
  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editModal) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/usuarios/${editModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: editName, 
          email: editEmail, 
          cargo: editCargo, 
          telefono: editTelefono, 
          role: editRole 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar usuario.");

      setSuccess(`Registro de ${data.name} actualizado.`);
      setEditModal(null);
      await loadUsuarios();
      await loadAudit();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar cambios.");
    } finally {
      setSubmitting(false);
    }
  }

  // Cambiar contraseña de un usuario
  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!passwordModal) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/usuarios/${passwordModal.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al restablecer contraseña.");

      setSuccess(`Contraseña de ${passwordModal.name} restablecida.`);
      setPasswordModal(null);
      setNewPassword("");
      await loadAudit();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cambiar contraseña.");
    } finally {
      setSubmitting(false);
    }
  }

  // Activar o desactivar usuario
  async function handleToggleStatus(u: SafeUser) {
    setError(null);
    try {
      const res = await fetch(`/api/usuarios/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !u.activo }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "No se pudo cambiar el estado.");
      }
      setSuccess(`Estado de ${u.name} modificado a ${!u.activo ? "Activo" : "Bloqueado"}.`);
      await loadUsuarios();
      await loadAudit();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cambiar estado.");
    }
  }

  // Eliminar usuario
  async function handleConfirmDelete() {
    if (!deleteModal) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/usuarios/${deleteModal.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "No se pudo eliminar el usuario.");
      }
      setSuccess(`Usuario ${deleteModal.name} eliminado.`);
      setDeleteModal(null);
      await loadUsuarios();
      await loadAudit();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar.");
    } finally {
      setSubmitting(false);
    }
  }

  // Estadísticas de gestión
  const stats = useMemo(() => {
    const total = usuarios.length;
    const activos = usuarios.filter((u) => u.activo).length;
    const evaluadores = usuarios.filter((u) => u.role === "evaluador").length;
    const admins = usuarios.filter((u) => u.role === "admin").length;
    return { total, activos, evaluadores, admins };
  }, [usuarios]);

  return (
    <div className="min-h-screen bg-base text-text selection:bg-gold/30 selection:text-gold">
      {/* Top Navbar */}
      <nav aria-label="Navegación de superusuario" className="border-b border-overlay0/40 bg-mantle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs text-subtext1 hover:text-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver al panel</span>
            </Link>
            <div className="h-4 w-px bg-overlay0/50" />
            <Logo size="sm" />
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="h-4 w-px bg-overlay0/50 hidden sm:block" />
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 outline-none space-y-6">
        {/* Cabecera Ejecutiva */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-overlay0/30">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold mb-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Módulo de Superusuario · Control de Accesos y Seguridad</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text">Gestión de Personal y Auditoría</h1>
            <p className="text-xs sm:text-sm text-subtext0 mt-0.5">
              Administración centralizada de evaluadores de campo, asignación de roles y trazabilidad de eventos.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              onClick={() => {
                handleGeneratePassword();
                setCreateModalOpen(true);
              }}
              className="bg-gold text-black hover:bg-gold-light font-bold shadow-md shadow-gold/20 flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Nuevo Personal</span>
            </Button>
          </div>
        </div>

        {/* Notificaciones */}
        {error && (
          <div className="p-4 rounded-2xl bg-red/10 border border-red/30 text-xs text-red font-semibold flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)}><X className="h-4 w-4" /></button>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-2xl bg-green/10 border border-green/30 text-xs text-green font-semibold flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess(null)}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Tarjetas de Métricas de Personal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl border border-overlay0/40 bg-surface0 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-subtext0 uppercase tracking-wider">Personal Total</span>
              <Users className="h-4 w-4 text-gold" />
            </div>
            <div className="text-2xl font-black text-text font-mono">{stats.total}</div>
            <p className="text-[11px] text-subtext0 mt-0.5">{stats.activos} cuentas activas</p>
          </div>

          <div className="p-5 rounded-2xl border border-overlay0/40 bg-surface0 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-subtext0 uppercase tracking-wider">Peritos de Campo</span>
              <UserCheck className="h-4 w-4 text-blue" />
            </div>
            <div className="text-2xl font-black text-blue font-mono">{stats.evaluadores}</div>
            <p className="text-[11px] text-subtext0 mt-0.5">Operando en territorio</p>
          </div>

          <div className="p-5 rounded-2xl border border-overlay0/40 bg-surface0 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-subtext0 uppercase tracking-wider">Directores / Admin</span>
              <Shield className="h-4 w-4 text-gold" />
            </div>
            <div className="text-2xl font-black text-gold font-mono">{stats.admins}</div>
            <p className="text-[11px] text-subtext0 mt-0.5">Control y emisión total</p>
          </div>

          <div className="p-5 rounded-2xl border border-overlay0/40 bg-surface0 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-subtext0 uppercase tracking-wider">Auditoría de Acciones</span>
              <History className="h-4 w-4 text-green" />
            </div>
            <div className="text-2xl font-black text-green font-mono">{auditLogs.length}</div>
            <p className="text-[11px] text-subtext0 mt-0.5">Eventos trazados en log</p>
          </div>
        </div>

        {/* Pestañas de Vista: Directorio vs Bitácora de Auditoría */}
        <div className="flex border-b border-overlay0/30 gap-6 text-sm font-bold">
          <button
            type="button"
            onClick={() => setTab("usuarios")}
            className={`pb-3 flex items-center gap-2 transition-colors relative ${
              tab === "usuarios" ? "text-gold" : "text-subtext0 hover:text-text"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Directorio de Personal ({filteredUsers.length})</span>
            {tab === "usuarios" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setTab("auditoria");
              loadAudit();
            }}
            className={`pb-3 flex items-center gap-2 transition-colors relative ${
              tab === "auditoria" ? "text-gold" : "text-subtext0 hover:text-text"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Bitácora de Auditoría y Trazabilidad</span>
            {tab === "auditoria" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
            )}
          </button>
        </div>

        {/* ══ PESTAÑA 1: DIRECTORIO DE PERSONAL ══ */}
        {tab === "usuarios" && (
          <div className="rounded-3xl border border-overlay0/40 bg-surface0 overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-overlay0/30">
              {/* Búsqueda */}
              <div className="flex items-center gap-2 rounded-xl border border-overlay0/60 bg-surface1 px-3 py-1.5 w-full sm:w-64 focus-within:border-gold">
                <Search className="h-3.5 w-3.5 text-subtext0" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, usuario o cargo..."
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

              {/* Filtros de Rol y Estado */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as "todos" | "admin" | "evaluador")}
                  className="text-xs font-semibold bg-surface1 border border-overlay0/60 rounded-xl px-3 py-1.5 text-text outline-none cursor-pointer"
                >
                  <option value="todos">Todos los roles</option>
                  <option value="evaluador">Peritos Evaluadores</option>
                  <option value="admin">Administradores</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as "todos" | "activos" | "inactivos")}
                  className="text-xs font-semibold bg-surface1 border border-overlay0/60 rounded-xl px-3 py-1.5 text-text outline-none cursor-pointer"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activos">Cuentas Activas</option>
                  <option value="inactivos">Cuentas Bloqueadas</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="p-8 space-y-4">
                <div className="h-12 rounded-xl bg-surface1 animate-pulse" />
                <div className="h-12 rounded-xl bg-surface1 animate-pulse" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-subtext0 text-xs">
                No se encontraron usuarios coincidentes con el criterio de búsqueda.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface1/60 text-subtext0 font-semibold uppercase tracking-wider border-b border-overlay0/30">
                    <tr>
                      <th className="px-6 py-3.5">Nombre / Usuario</th>
                      <th className="px-6 py-3.5">Contacto / Cargo</th>
                      <th className="px-6 py-3.5">Rol Institucional</th>
                      <th className="px-6 py-3.5">Estado</th>
                      <th className="px-6 py-3.5">Último Acceso</th>
                      <th className="px-6 py-3.5 text-right">Acciones de Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-overlay0/20">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-surface1/40 transition-colors">
                        <td className="px-6 py-4 font-medium text-text">
                          <div className="font-bold text-sm text-text">{u.name}</div>
                          <div className="text-[11px] text-subtext0 font-mono">@{u.username}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-text font-medium">{u.email}</div>
                          <div className="text-[11px] text-subtext0">{u.cargo || "Perito Evaluador"}</div>
                        </td>
                        <td className="px-6 py-4">
                          {u.role === "admin" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gold/15 text-gold border border-gold/30">
                              <Shield className="h-3 w-3" /> Administrador
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-surface2 text-subtext1 border border-overlay0/40">
                              <UserCheck className="h-3 w-3" /> Evaluador
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {u.activo ? (
                            <span className="inline-flex items-center gap-1.5 text-green font-semibold">
                              <span className="h-2 w-2 rounded-full bg-green" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-red font-semibold">
                              <span className="h-2 w-2 rounded-full bg-red" /> Bloqueado
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-subtext0">
                          {u.ultimoAcceso ? (
                            <div className="flex items-center gap-1 font-mono text-[11px]">
                              <Clock className="h-3 w-3 text-gold" />
                              <span>{formatDate(u.ultimoAcceso.slice(0, 10))}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] italic">Sin ingresos</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Restablecer Contraseña */}
                            <button
                              type="button"
                              onClick={() => {
                                setPasswordModal(u);
                                handleGeneratePassword();
                              }}
                              className="p-1.5 rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold text-subtext0 hover:text-text transition-colors"
                              title="Restablecer contraseña de acceso"
                            >
                              <Key className="h-3.5 w-3.5 text-gold" />
                            </button>

                            {/* Editar datos */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(u)}
                              className="p-1.5 rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold text-subtext0 hover:text-text transition-colors"
                              title="Editar datos del personal"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            {/* Bloquear / Desbloquear */}
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(u)}
                              className={`p-1.5 rounded-xl border transition-colors ${
                                u.activo
                                  ? "border-overlay0/60 hover:bg-red/10 hover:text-red hover:border-red/30 text-subtext0"
                                  : "border-green/30 bg-green/10 text-green hover:bg-green/20"
                              }`}
                              title={u.activo ? "Bloquear acceso temporalmente" : "Desbloquear cuenta"}
                            >
                              <Power className="h-3.5 w-3.5" />
                            </button>

                            {/* Eliminar (excepto admin principal) */}
                            {u.username !== "admin" && (
                              <button
                                type="button"
                                onClick={() => setDeleteModal(u)}
                                className="p-1.5 rounded-xl border border-overlay0/60 hover:bg-red/10 hover:text-red hover:border-red/30 text-subtext0 transition-colors"
                                title="Eliminar registro"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══ PESTAÑA 2: BITÁCORA DE AUDITORÍA DE SEGURIDAD ══ */}
        {tab === "auditoria" && (
          <div className="rounded-3xl border border-overlay0/40 bg-surface0 overflow-hidden shadow-sm space-y-4 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-overlay0/30">
              <div>
                <h2 className="font-bold text-base text-text">Trazabilidad de Operaciones de Seguridad</h2>
                <p className="text-xs text-subtext0 mt-0.5">
                  Registro inalterable de ingresos, modificaciones de personal, emisión de peritajes y cambios de clave.
                </p>
              </div>
              <button
                type="button"
                onClick={loadAudit}
                disabled={auditLoading}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold transition-colors"
              >
                <RefreshCw className={`h-3 w-3 ${auditLoading ? "animate-spin" : ""}`} />
                <span>Actualizar</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface1/60 text-subtext0 font-semibold uppercase tracking-wider border-b border-overlay0/30">
                  <tr>
                    <th className="px-6 py-3.5">Fecha y Hora</th>
                    <th className="px-6 py-3.5">Usuario / Rol</th>
                    <th className="px-6 py-3.5">Acción</th>
                    <th className="px-6 py-3.5">Detalle Operativo</th>
                    <th className="px-6 py-3.5 text-right">Dirección IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-overlay0/20">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface1/40 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-subtext0 whitespace-nowrap">
                        {log.timestamp.replace("T", " ").slice(0, 19)}
                      </td>
                      <td className="px-6 py-3.5 font-medium text-text">
                        <span className="font-bold">{log.userName}</span>{" "}
                        <span className="text-[10px] text-subtext0 font-mono">({log.userRole})</span>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-surface2 text-gold border border-gold/30">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-text font-medium">{log.detail}</td>
                      <td className="px-6 py-3.5 text-right font-mono text-[11px] text-subtext0">
                        {log.ip || "127.0.0.1"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══ MODAL DE CREACIÓN DE USUARIO CON GENERADOR DE CLAVE ══ */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl border border-overlay0/60 bg-surface0 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-base">Registrar Nuevo Personal</h3>
                    <p className="text-[11px] text-subtext0">Credenciales periciales para Jerovia</p>
                  </div>
                </div>
                <button onClick={() => setCreateModalOpen(false)} className="text-subtext0 hover:text-text">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-4">
                <Input
                  label="Nombre Completo"
                  placeholder="Ej: Lic. Andrea Gómez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nombre de Usuario"
                    placeholder="Ej: agomez"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <Input
                    label="Correo Institucional"
                    type="email"
                    placeholder="Ej: andrea@jerovia.com.py"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Cargo / Título"
                    placeholder="Ej: Perito Social"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                  />
                  <Input
                    label="Teléfono / Celular"
                    placeholder="Ej: 0981 123456"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>

                <Select
                  label="Rol y Nivel de Acceso"
                  value={role}
                  onChange={(e) => setRole(e.target.value as "evaluador" | "admin")}
                  options={[
                    { value: "evaluador", label: "Perito Evaluador (Solo visitas asignadas)" },
                    { value: "admin", label: "Administrador General (Control y emisión total)" },
                  ]}
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-text">Contraseña Segura</label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[11px] font-semibold text-gold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Generar otra
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyPassword(password)}
                      className="p-2.5 rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold text-subtext0 hover:text-text transition-colors"
                      title="Copiar contraseña generada"
                    >
                      {copiedKey ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-subtext0 mt-1">
                    Puedes copiar esta contraseña y enviarla al evaluador de forma segura.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-overlay0/30">
                  <Button type="button" variant="secondary" onClick={() => setCreateModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" loading={submitting} className="bg-gold text-black font-bold">
                    Guardar Personal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══ MODAL DE EDICIÓN DE USUARIO ══ */}
        {editModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-overlay0/60 bg-surface0 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-gold" />
                  <h3 className="font-bold text-base text-text">Editar Personal</h3>
                </div>
                <button onClick={() => setEditModal(null)} className="text-subtext0 hover:text-text">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <Input
                  label="Nombre Completo"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                />
                <Input
                  label="Correo Electrónico"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Cargo"
                    value={editCargo}
                    onChange={(e) => setEditCargo(e.target.value)}
                  />
                  <Input
                    label="Teléfono"
                    value={editTelefono}
                    onChange={(e) => setEditTelefono(e.target.value)}
                  />
                </div>
                <Select
                  label="Rol Institucional"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as "evaluador" | "admin")}
                  options={[
                    { value: "evaluador", label: "Perito Evaluador" },
                    { value: "admin", label: "Administrador General" },
                  ]}
                  required
                />

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-overlay0/30">
                  <Button type="button" variant="secondary" onClick={() => setEditModal(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" loading={submitting} className="bg-gold text-black font-bold">
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══ MODAL DE RESTABLECIMIENTO DE CONTRASEÑA ══ */}
        {passwordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-overlay0/60 bg-surface0 p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-gold" />
                  <h3 className="font-bold text-base text-text">Restablecer Contraseña</h3>
                </div>
                <button onClick={() => setPasswordModal(null)} className="text-subtext0 hover:text-text">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="text-xs text-subtext0">
                Asigna una nueva clave para <strong>{passwordModal.name}</strong> (@{passwordModal.username}).
              </p>

              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-text">Nueva Clave Criptográfica</label>
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="text-[11px] font-semibold text-gold hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Regenerar
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="text"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyPassword(newPassword)}
                      className="p-2.5 rounded-xl border border-overlay0/60 bg-surface1 hover:border-gold text-subtext0 hover:text-text transition-colors"
                      title="Copiar contraseña generada"
                    >
                      {copiedKey ? <Check className="h-4 w-4 text-green" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-overlay0/30">
                  <Button type="button" variant="secondary" onClick={() => setPasswordModal(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" loading={submitting} className="bg-gold text-black font-bold">
                    Guardar Nueva Clave
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ══ MODAL DE ELIMINACIÓN DE USUARIO ══ */}
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-red/40 bg-surface0 p-6 sm:p-8 shadow-2xl text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-red/10 text-red flex items-center justify-center mx-auto">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text">¿Eliminar Usuario?</h3>
              <p className="text-xs text-subtext0 leading-relaxed">
                Se dará de baja permanentemente la cuenta de <strong>{deleteModal.name}</strong> (@{deleteModal.username}). Esta acción quedará asentada en la bitácora de auditoría.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setDeleteModal(null)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  loading={submitting}
                  onClick={handleConfirmDelete}
                  className="bg-red hover:bg-red/90 text-white font-bold"
                >
                  Sí, Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
