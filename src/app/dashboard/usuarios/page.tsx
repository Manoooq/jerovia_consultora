"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input, Select, Badge } from "@/components/ui/FormFields";
import { Button } from "@/components/ui/Button";
import { AntigravityBackground } from "@/components/ui/AntigravityBackground";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  ArrowLeft,
  UserPlus,
  ShieldCheck,
  UserCheck,
  Key,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  X,
  Activity,
  RefreshCw,
} from "lucide-react";

interface UserItem {
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

interface AuditItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  detail: string;
  ip?: string;
}

function generateClientPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%";
  const arr = new Uint32Array(10);
  crypto.getRandomValues(arr);
  let out = "Jv-";
  for (let i = 0; i < arr.length; i++) {
    out += chars[arr[i] % chars.length];
  }
  return out;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UserItem[]>([]);
  const [auditoria, setAuditoria] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"usuarios" | "auditoria">("usuarios");

  // Formulario Nuevo Usuario
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"evaluador" | "admin">("evaluador");
  const [newCargo, setNewCargo] = useState("Perito Evaluador");
  const [newTelefono, setNewTelefono] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Modales Edición / Clave
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"evaluador" | "admin">("evaluador");
  const [editCargo, setEditCargo] = useState("");
  const [editTelefono, setEditTelefono] = useState("");

  const [pwdUser, setPwdUser] = useState<UserItem | null>(null);
  const [resetPwdValue, setResetPwdValue] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function loadAll() {
    setLoading(true);
    try {
      const [uRes, aRes] = await Promise.all([
        fetch("/api/usuarios"),
        fetch("/api/audit?limit=60"),
      ]);
      if (uRes.ok) setUsuarios(await uRes.json());
      if (aRes.ok) setAuditoria(await aRes.json());
    } catch (e) {
      console.error("Error cargando usuarios:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          username: newUsername.trim().toLowerCase(),
          email: newEmail.trim().toLowerCase(),
          role: newRole,
          cargo: newCargo.trim(),
          telefono: newTelefono.trim(),
          password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al crear usuario.");

      setFeedback({
        type: "success",
        text: `Cuenta creada para ${data.name} (@${data.username}).`,
      });
      setCreateOpen(false);
      setNewName("");
      setNewUsername("");
      setNewEmail("");
      setNewTelefono("");
      setNewPassword("");
      await loadAll();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Error al crear usuario.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(u: UserItem) {
    setFeedback(null);
    try {
      const res = await fetch(`/api/usuarios/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activo: !u.activo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo cambiar el estado.");
      setFeedback({
        type: "success",
        text: `Estado de ${u.name} actualizado.`,
      });
      await loadAll();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Error al actualizar.",
      });
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/usuarios/${editUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          email: editEmail.trim().toLowerCase(),
          role: editRole,
          cargo: editCargo.trim(),
          telefono: editTelefono.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al editar.");
      setFeedback({
        type: "success",
        text: `Datos de ${editName} actualizados.`,
      });
      setEditUser(null);
      await loadAll();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Error al editar.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!pwdUser) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/usuarios/${pwdUser.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPwdValue }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cambiar clave.");
      setFeedback({
        type: "success",
        text: `Contraseña de ${pwdUser.name} restablecida.`,
      });
      setPwdUser(null);
      setResetPwdValue("");
      await loadAll();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Error al cambiar clave.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteUser(u: UserItem) {
    if (!confirm(`¿Eliminar permanentemente la cuenta de ${u.name}?`)) return;
    setFeedback(null);
    try {
      const res = await fetch(`/api/usuarios/${u.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo eliminar.");
      setFeedback({ type: "success", text: `Usuario ${u.name} eliminado.` });
      await loadAll();
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        text: err instanceof Error ? err.message : "Error al eliminar.",
      });
    }
  }

  return (
    <div className="relative min-h-screen bg-base text-text overflow-x-hidden">
      <AntigravityBackground />

      <header className="glass-panel sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="min-h-[38px] px-3 rounded-xl border border-overlay1 bg-surface1 hover:border-gold text-xs font-bold text-text flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-gold" />
              <span>Expedientes</span>
            </Link>
            <Logo size="sm" />
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setNewPassword(generateClientPassword());
                setCreateOpen(true);
              }}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Nuevo Evaluador</span>
            </Button>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 outline-none"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold">
              ADMINISTRACIÓN INTERNA
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight">
              Personal Evaluador y Auditoría
            </h1>
          </div>

          <div className="recessed-well p-1 rounded-xl inline-flex items-center gap-1 self-start">
            <button
              type="button"
              onClick={() => setTab("usuarios")}
              className={`min-h-[36px] px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                tab === "usuarios"
                  ? "bg-gold text-black"
                  : "text-subtext1 hover:text-text"
              }`}
            >
              Personal ({usuarios.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("auditoria")}
              className={`min-h-[36px] px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                tab === "auditoria"
                  ? "bg-gold text-black"
                  : "text-subtext1 hover:text-text"
              }`}
            >
              Bitácora ({auditoria.length})
            </button>
          </div>
        </div>

        {feedback && (
          <div
            role="status"
            className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 ${
              feedback.type === "success"
                ? "bg-green/10 border-green/30 text-green"
                : "bg-red/10 border-red/30 text-red"
            }`}
          >
            <span className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {feedback.text}
            </span>
            <button
              onClick={() => setFeedback(null)}
              aria-label="Cerrar notificación"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {tab === "usuarios" ? (
          <div className="recessed-well rounded-3xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usuarios.map((u) => (
              <SpotlightCard
                key={u.id}
                sinkIntensity={4.5}
                className="p-5 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-10 w-10 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                        {u.role === "admin" ? (
                          <ShieldCheck className="h-5 w-5" />
                        ) : (
                          <UserCheck className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-text">{u.name}</h3>
                        <p className="text-xs font-mono text-gold">@{u.username}</p>
                      </div>
                    </div>
                    <Badge variant={u.activo ? "success" : "danger"}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>

                  <div className="space-y-1 text-xs text-subtext1 pt-2 border-t border-overlay0/50">
                    <div className="flex justify-between">
                      <span>Correo:</span>
                      <span className="font-mono text-text truncate max-w-[180px]">
                        {u.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rol:</span>
                      <span className="font-bold text-text uppercase text-[11px]">
                        {u.role === "admin" ? "Administrador" : "Perito Evaluador"}
                      </span>
                    </div>
                    {u.cargo && (
                      <div className="flex justify-between">
                        <span>Cargo:</span>
                        <span className="text-text">{u.cargo}</span>
                      </div>
                    )}
                    {u.telefono && (
                      <div className="flex justify-between">
                        <span>Teléfono:</span>
                        <span className="font-mono text-text">{u.telefono}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-overlay0/50">
                  <button
                    type="button"
                    onClick={() => {
                      setEditUser(u);
                      setEditName(u.name);
                      setEditEmail(u.email);
                      setEditRole(u.role);
                      setEditCargo(u.cargo || "");
                      setEditTelefono(u.telefono || "");
                    }}
                    className="min-h-[36px] px-3 rounded-xl border border-overlay1 bg-surface1 hover:border-gold text-xs font-bold text-text flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-gold" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPwdUser(u);
                      setResetPwdValue(generateClientPassword());
                    }}
                    className="min-h-[36px] px-3 rounded-xl border border-overlay1 bg-surface1 hover:border-gold text-xs font-bold text-text flex items-center gap-1.5 cursor-pointer"
                  >
                    <Key className="h-3.5 w-3.5 text-gold" />
                    <span>Clave</span>
                  </button>

                  {u.username !== "admin" && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(u)}
                        className="min-h-[36px] px-2.5 rounded-xl border border-overlay1 bg-surface1 hover:border-gold text-[11px] font-bold text-subtext1 hover:text-text cursor-pointer"
                      >
                        {u.activo ? "Pausar" : "Activar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u)}
                        className="min-h-[36px] min-w-[36px] rounded-xl border border-overlay1 hover:border-red/50 hover:bg-red/10 text-subtext0 hover:text-red flex items-center justify-center cursor-pointer"
                        aria-label="Eliminar usuario"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </SpotlightCard>
            ))}
          </div>
        ) : (
          <div className="recessed-well rounded-3xl p-4 sm:p-5 space-y-2.5">
            {auditoria.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-overlay0/70 bg-surface0/90 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <Activity className="h-4 w-4 text-gold shrink-0 mt-0.5 sm:mt-0" />
                  <div>
                    <span className="font-mono font-bold text-gold mr-2">
                      [{a.action}]
                    </span>
                    <span className="font-bold text-text">{a.userName}: </span>
                    <span className="text-subtext1">{a.detail}</span>
                  </div>
                </div>
                <div className="font-mono text-[11px] text-subtext0 shrink-0 tabular-nums">
                  {a.timestamp.slice(0, 19).replace("T", " ")} {a.ip ? `• ${a.ip}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Crear Usuario */}
        {createOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          >
            <div className="w-full max-w-lg recessed-well rounded-3xl p-3">
              <SpotlightCard sinkIntensity={2} className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-overlay0/60">
                  <h2 className="text-base font-black text-text">
                    Registrar Nuevo Personal
                  </h2>
                  <button
                    onClick={() => setCreateOpen(false)}
                    className="text-subtext0 hover:text-text"
                    aria-label="Cerrar modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-3.5">
                  <Input
                    label="Nombre y Apellido"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej: Lic. Andrea Gómez"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Usuario de Acceso"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Ej: agomez"
                    />
                    <Input
                      label="Correo Electrónico"
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="agomez@jerovia.com.py"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Select
                      label="Rol en Sistema"
                      required
                      value={newRole}
                      onChange={(e) =>
                        setNewRole(e.target.value as "evaluador" | "admin")
                      }
                      options={[
                        { value: "evaluador", label: "Perito Evaluador" },
                        { value: "admin", label: "Administrador" },
                      ]}
                    />
                    <Input
                      label="Cargo"
                      value={newCargo}
                      onChange={(e) => setNewCargo(e.target.value)}
                    />
                    <Input
                      label="Teléfono"
                      value={newTelefono}
                      onChange={(e) => setNewTelefono(e.target.value)}
                      placeholder="0981..."
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Input
                        label="Contraseña Inicial"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setNewPassword(generateClientPassword())}
                    >
                      <RefreshCw className="h-4 w-4 text-gold" />
                    </Button>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-overlay0/50">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setCreateOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" loading={submitting}>
                      Crear Usuario
                    </Button>
                  </div>
                </form>
              </SpotlightCard>
            </div>
          </div>
        )}

        {/* Modal Editar Usuario */}
        {editUser && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          >
            <div className="w-full max-w-lg recessed-well rounded-3xl p-3">
              <SpotlightCard sinkIntensity={2} className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-overlay0/60">
                  <h2 className="text-base font-black text-text">
                    Editar Datos de @{editUser.username}
                  </h2>
                  <button
                    onClick={() => setEditUser(null)}
                    className="text-subtext0 hover:text-text"
                    aria-label="Cerrar modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-3.5">
                  <Input
                    label="Nombre y Apellido"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Correo Electrónico"
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                    <Select
                      label="Rol"
                      value={editRole}
                      onChange={(e) =>
                        setEditRole(e.target.value as "evaluador" | "admin")
                      }
                      options={[
                        { value: "evaluador", label: "Perito Evaluador" },
                        { value: "admin", label: "Administrador" },
                      ]}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                  <div className="flex justify-end gap-2 pt-3 border-t border-overlay0/50">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setEditUser(null)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" loading={submitting}>
                      Guardar Cambios
                    </Button>
                  </div>
                </form>
              </SpotlightCard>
            </div>
          </div>
        )}

        {/* Modal Restablecer Contraseña */}
        {pwdUser && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          >
            <div className="w-full max-w-md recessed-well rounded-3xl p-3">
              <SpotlightCard sinkIntensity={2} className="p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-overlay0/60">
                  <h2 className="text-base font-black text-text">
                    Nueva Clave para {pwdUser.name}
                  </h2>
                  <button
                    onClick={() => setPwdUser(null)}
                    className="text-subtext0 hover:text-text"
                    aria-label="Cerrar modal"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Input
                        label="Nueva Contraseña"
                        required
                        value={resetPwdValue}
                        onChange={(e) => setResetPwdValue(e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setResetPwdValue(generateClientPassword())}
                    >
                      <RefreshCw className="h-4 w-4 text-gold" />
                    </Button>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-overlay0/50">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setPwdUser(null)}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" loading={submitting}>
                      Confirmar Clave
                    </Button>
                  </div>
                </form>
              </SpotlightCard>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
