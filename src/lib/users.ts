/**
 * Jerovia Consultora — Gestión de Usuarios y Roles (RBAC)
 * Seguridad criptográfica nativa con Web Crypto API (Node.js & Edge compatible)
 */

export type UserRole = "admin" | "evaluador";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
  passwordSalt: string;
  activo: boolean;
  creadoEn: string;
}

export type SafeUser = Omit<User, "passwordHash" | "passwordSalt">;

/**
 * Función de hashing criptográfico con salt utilizando Web Crypto API
 */
export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const actualSalt = salt || crypto.randomUUID().replace(/-/g, "");
  const enc = new TextEncoder();
  const data = enc.encode(`${actualSalt}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return { hash, salt: actualSalt };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const computed = await hashPassword(password, salt);
  return computed.hash === hash;
}

// Semilla inicial pre-hasheada para arranque instantáneo sin latencia
// admin: jerovia2026 | salt: salt_adm_2026
// evaluador: evaluador2026 | salt: salt_eval_2026
const usersStore = new Map<string, User>([
  [
    "usr_admin_01",
    {
      id: "usr_admin_01",
      username: "admin",
      email: "admin@jerovia.com.py",
      name: "Lic. Michelle Romero",
      role: "admin",
      passwordHash: "281058ee367ef73d7e7ac1088c42673560ad0efe6c45bb09c7e87573fa8b3433",
      passwordSalt: "salt_adm_2026",
      activo: true,
      creadoEn: "2026-09-01T08:00:00.000Z",
    },
  ],
  [
    "usr_eval_01",
    {
      id: "usr_eval_01",
      username: "evaluador",
      email: "evaluador@jerovia.com.py",
      name: "Lic. Carlos Benítez",
      role: "evaluador",
      passwordHash: "0fdb065e6fb13a58f92d6ae838f86574c4484abba831f42b1843cbbb65381d65",
      passwordSalt: "salt_eval_2026",
      activo: true,
      creadoEn: "2026-09-15T09:30:00.000Z",
    },
  ],
]);

function toSafeUser(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

export function listarUsuarios(): SafeUser[] {
  return Array.from(usersStore.values()).map(toSafeUser);
}

export function listarEvaluadores(): SafeUser[] {
  return Array.from(usersStore.values())
    .filter((u) => u.activo && (u.role === "evaluador" || u.role === "admin"))
    .map(toSafeUser);
}

export function obtenerUsuarioPorId(id: string): User | undefined {
  return usersStore.get(id);
}

export function obtenerUsuarioPorIdentificador(identifier: string): User | undefined {
  const clean = identifier.toLowerCase().trim();
  for (const user of usersStore.values()) {
    if (user.username.toLowerCase() === clean || user.email.toLowerCase() === clean) {
      return user;
    }
  }
  return undefined;
}

export async function crearUsuario(datos: {
  username: string;
  email: string;
  name: string;
  role: UserRole;
  password: string;
}): Promise<SafeUser> {
  const existing = obtenerUsuarioPorIdentificador(datos.username) || obtenerUsuarioPorIdentificador(datos.email);
  if (existing) {
    throw new Error("El nombre de usuario o correo ya se encuentra registrado.");
  }

  const { hash, salt } = await hashPassword(datos.password);
  const id = `usr_${crypto.randomUUID().slice(0, 8)}`;

  const nuevoUsuario: User = {
    id,
    username: datos.username.toLowerCase().trim(),
    email: datos.email.toLowerCase().trim(),
    name: datos.name.trim(),
    role: datos.role,
    passwordHash: hash,
    passwordSalt: salt,
    activo: true,
    creadoEn: new Date().toISOString(),
  };

  usersStore.set(id, nuevoUsuario);
  return toSafeUser(nuevoUsuario);
}

export function actualizarUsuario(id: string, patch: Partial<Omit<User, "id" | "passwordHash" | "passwordSalt">>): SafeUser | null {
  const user = usersStore.get(id);
  if (!user) return null;
  const updated: User = { ...user, ...patch };
  usersStore.set(id, updated);
  return toSafeUser(updated);
}

export function eliminarUsuario(id: string): boolean {
  const user = usersStore.get(id);
  if (!user) return false;
  if (user.username === "admin") {
    throw new Error("No es posible eliminar la cuenta principal de administración.");
  }
  return usersStore.delete(id);
}

export async function verificarCredenciales(identifier: string, password: string): Promise<SafeUser | null> {
  const user = obtenerUsuarioPorIdentificador(identifier);
  if (!user || !user.activo) return null;

  const valid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!valid) return null;

  return toSafeUser(user);
}
