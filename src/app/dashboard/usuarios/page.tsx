"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutButton } from "@/components/LogoutButton";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/FormFields";
import { formatDate } from "@/lib/utils";
import { 
  ArrowLeft, UserPlus, Users, Shield, UserCheck, 
  Trash2, Power, CheckCircle, AlertCircle, X, ShieldAlert
} from "lucide-react";

interface SafeUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "admin" | "evaluador";
  activo: boolean;
  creadoEn: string;
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formulario nuevo usuario
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"evaluador" | "admin">("evaluador");
  const [password, setPassword] = useState("");

  async function loadUsuarios() {
    try {
      const res = await fetch("/api/usuarios");
      if (!res.ok) {
        throw new Error("No se pudo obtener la lista de usuarios.");
      }
      const data = await res.json();
      setUsuarios(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsuarios();
  }, []);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, role, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al crear usuario.");
      }

      setSuccess(`Usuario ${data.name} registrado correctamente.`);
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("evaluador");
      setModalOpen(false);
      await loadUsuarios();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar usuario.");
    } finally {
      setSubmitting(false);
    }
  }

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
      await loadUsuarios();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cambiar estado.");
    }
  }

  async function handleDeleteUser(u: SafeUser) {
    if (!confirm(`¿Está seguro de eliminar al usuario ${u.name}? Esta acción no se puede deshacer.`)) {
      return;
    }
    setError(null);
    try {
      const res = await fetch(`/api/usuarios/${u.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "No se pudo eliminar el usuario.");
      }
      setSuccess(`Usuario ${u.name} eliminado.`);
      await loadUsuarios();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al eliminar.");
    }
  }

  return (
    <div className="min-h-screen bg-base">
      {/* Top Navbar */}
      <nav aria-label="Navegación de usuarios" className="border-b border-overlay0/40 bg-mantle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs text-subtext1 hover:text-text transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al panel
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

      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-4 sm:px-6 py-8 outline-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold mb-2">
              <Shield className="h-3.5 w-3.5" />
              Control de Accesos y Seguridad
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text">Gestión de Usuarios</h1>
            <p className="text-xs sm:text-sm text-subtext0 mt-0.5">
              Administración de cuentas con perfiles de acceso restringido para peritos evaluadores y directivos.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setModalOpen(true)}
            className="bg-gold text-black hover:bg-gold-light font-bold shadow-md shadow-gold/20 flex items-center gap-2 self-start sm:self-auto"
          >
            <UserPlus className="h-4 w-4" />
            <span>Nuevo Usuario</span>
          </Button>
        </div>

        {/* Feedback Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red/10 border border-red/30 text-xs text-red font-semibold flex items-center gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-green/10 border border-green/30 text-xs text-green font-semibold flex items-center gap-2.5">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Tabla de Usuarios */}
        <div className="rounded-2xl border border-overlay0/40 bg-surface0 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-overlay0/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" />
              <h2 className="font-bold text-text text-sm">Cuentas Registradas</h2>
            </div>
            <span className="text-xs text-subtext0 font-medium">
              {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading ? (
            <div className="p-8 space-y-4">
              <div className="h-12 rounded-xl bg-surface1 animate-pulse" />
              <div className="h-12 rounded-xl bg-surface1 animate-pulse" />
              <div className="h-12 rounded-xl bg-surface1 animate-pulse" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface1/60 text-subtext0 font-semibold uppercase tracking-wider border-b border-overlay0/30">
                  <tr>
                    <th className="px-6 py-3.5">Nombre / Usuario</th>
                    <th className="px-6 py-3.5">Correo</th>
                    <th className="px-6 py-3.5">Rol Institucional</th>
                    <th className="px-6 py-3.5">Estado</th>
                    <th className="px-6 py-3.5">Alta</th>
                    <th className="px-6 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-overlay0/20">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-surface1/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-text">
                        <div className="font-bold text-sm text-text">{u.name}</div>
                        <div className="text-[11px] text-subtext0 font-mono">@{u.username}</div>
                      </td>
                      <td className="px-6 py-4 text-subtext1 font-medium">{u.email}</td>
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
                          <span className="inline-flex items-center gap-1 text-green font-semibold">
                            <span className="h-2 w-2 rounded-full bg-green" /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-subtext0 font-semibold">
                            <span className="h-2 w-2 rounded-full bg-subtext0" /> Inactivo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-subtext0">{formatDate(u.creadoEn.slice(0, 10))}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              u.activo
                                ? "border-overlay0 hover:bg-red/10 hover:text-red hover:border-red/30 text-subtext0"
                                : "border-green/30 bg-green/10 text-green hover:bg-green/20"
                            }`}
                            title={u.activo ? "Desactivar usuario" : "Activar usuario"}
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>

                          {u.username !== "admin" && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 rounded-lg border border-overlay0 hover:bg-red/10 hover:text-red hover:border-red/30 text-subtext0 transition-colors"
                              title="Eliminar usuario"
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

        {/* Modal de Creación de Usuario */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg rounded-3xl border border-overlay0/60 bg-surface0 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-overlay0/30">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text text-base">Registrar Nuevo Usuario</h3>
                    <p className="text-[11px] text-subtext0">Credenciales periciales para el personal de Jerovia</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="text-subtext0 hover:text-text p-1.5 rounded-lg"
                >
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

                <Select
                  label="Rol y Nivel de Acceso"
                  value={role}
                  onChange={(e) => setRole(e.target.value as "evaluador" | "admin")}
                  options={[
                    { value: "evaluador", label: "Perito Evaluador (Solo visitas asignadas)" },
                    { value: "admin", label: "Administrador General (Creación de links y usuarios)" },
                  ]}
                  required
                />

                <Input
                  label="Contraseña Inicial"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="p-3 rounded-xl bg-surface1 text-[11px] text-subtext0 leading-relaxed border border-overlay0/30">
                  ℹ️ Los <strong>Administradores</strong> pueden emitir nuevos enlaces de evaluación y gestionar personal. Los <strong>Peritos Evaluadores</strong> únicamente acceden a las visitas que se les hayan asignado para recolección en campo.
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-overlay0/30">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    loading={submitting}
                    className="bg-gold text-black hover:bg-gold-light font-bold"
                  >
                    Guardar Usuario
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
