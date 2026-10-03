import fs from "fs";
import path from "path";

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
  ultimoAcceso?: string;
  cargo?: string;
  telefono?: string;
}

export type SafeUser = Omit<User, "passwordHash" | "passwordSalt">;

/**
 * Genera contraseñas aleatorias de alta seguridad para asignación a evaluadores
 */
export function generarContrasenaSegura(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%*";
  let pwd = "Jv-";
  for (let i = 0; i < 9; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "usuarios.json");

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

const usersStore = new Map<string, User>();

function seedDefaultUsers() {
  usersStore.set("usr_admin_01", {
    id: "usr_admin_01",
    username: "admin",
    email: "admin@jerovia.com.py",
    name: "Lic. Michelle Romero",
    role: "admin",
    passwordHash: "281058ee367ef73d7e7ac1088c42673560ad0efe6c45bb09c7e87573fa8b3433",
    passwordSalt: "salt_adm_2026",
    activo: true,
    creadoEn: "2026-09-01T08:00:00.000Z",
  });

  usersStore.set("usr_eval_01", {
    id: "usr_eval_01",
    username: "evaluador",
    email: "evaluador@jerovia.com.py",
    name: "Lic. Carlos Benítez",
    role: "evaluador",
    passwordHash: "0fdb065e6fb13a58f92d6ae838f86574c4484abba831f42b1843cbbb65381d65",
    passwordSalt: "salt_eval_2026",
    activo: true,
    creadoEn: "2026-09-15T09:30:00.000Z",
  });
}

function initUsers() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, "utf-8");
      if (content.trim()) {
        const list: User[] = JSON.parse(content);
        usersStore.clear();
        list.forEach((u) => usersStore.set(u.id, u));
        return;
      }
    }
  } catch (err) {
    console.error("[initUsers error]:", err);
  }

  seedDefaultUsers();
  persistUsers();
}

function persistUsers() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const list = Array.from(usersStore.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.warn("[persistUsers warn]:", err);
  }
}

initUsers();

function toSafeUser(user: User): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

export function listarUsuarios(): SafeUser[] {
  if (usersStore.size === 0) initUsers();
  return Array.from(usersStore.values()).map(toSafeUser);
}

export function listarEvaluadores(): SafeUser[] {
  if (usersStore.size === 0) initUsers();
  return Array.from(usersStore.values())
    .filter((u) => u.activo && (u.role === "evaluador" || u.role === "admin"))
    .map(toSafeUser);
}

export function obtenerUsuarioPorId(id: string): User | undefined {
  if (usersStore.size === 0) initUsers();
  return usersStore.get(id);
}

export function obtenerUsuarioPorIdentificador(identifier: string): User | undefined {
  if (usersStore.size === 0) initUsers();
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
  persistUsers();
  return toSafeUser(nuevoUsuario);
}

export function actualizarUsuario(
  id: string,
  patch: Partial<Omit<User, "id" | "passwordHash" | "passwordSalt">>
): SafeUser | null {
  const user = usersStore.get(id);
  if (!user) return null;
  const updated: User = { ...user, ...patch };
  usersStore.set(id, updated);
  persistUsers();
  return toSafeUser(updated);
}

export async function cambiarContrasena(id: string, nuevaContrasena: string): Promise<boolean> {
  const user = usersStore.get(id);
  if (!user) return false;
  if (nuevaContrasena.length < 6) {
    throw new Error("La contraseña debe tener un mínimo de 6 caracteres.");
  }
  const { hash, salt } = await hashPassword(nuevaContrasena);
  user.passwordHash = hash;
  user.passwordSalt = salt;
  usersStore.set(id, user);
  persistUsers();
  return true;
}

export function eliminarUsuario(id: string): boolean {
  const user = usersStore.get(id);
  if (!user) return false;
  if (user.username === "admin") {
    throw new Error("No es posible eliminar la cuenta principal de administración.");
  }
  const deleted = usersStore.delete(id);
  if (deleted) persistUsers();
  return deleted;
}

export async function verificarCredenciales(identifier: string, password: string): Promise<SafeUser | null> {
  const user = obtenerUsuarioPorIdentificador(identifier);
  if (!user || !user.activo) return null;

  const valid = await verifyPassword(password, user.passwordHash, user.passwordSalt);
  if (!valid) return null;

  user.ultimoAcceso = new Date().toISOString();
  persistUsers();

  return toSafeUser(user);
}
