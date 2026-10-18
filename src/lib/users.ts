import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import { fetchGistJsonFile, saveGistFiles } from "./cloudPersistence";

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

export function generarContrasenaSegura(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%*";
  const randomValues = new Uint32Array(10);
  crypto.getRandomValues(randomValues);
  let pwd = "Jv-";
  for (let i = 0; i < randomValues.length; i++) {
    pwd += chars.charAt(randomValues[i] % chars.length);
  }
  return pwd;
}

const TMP_DIR = path.join(os.tmpdir(), "jerovia_data_v4");
const TMP_USERS_FILE = path.join(TMP_DIR, "usuarios.json");
const REPO_USERS_FILE = path.join(process.cwd(), "data", "usuarios.json");

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Criptografía de alta seguridad: PBKDF2 con 100.000 iteraciones y SHA-256
 */
export async function hashPassword(
  password: string,
  salt?: string
): Promise<{ hash: string; salt: string }> {
  const actualSalt = salt || crypto.randomUUID().replace(/-/g, "");
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(actualSalt),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const hashArray = Array.from(new Uint8Array(derivedBits));
  const hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return { hash: `pbkdf2$100000$${hex}`, salt: actualSalt };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string
): Promise<boolean> {
  // 1. Verificación moderna PBKDF2
  if (hash.startsWith("pbkdf2$")) {
    const parts = hash.split("$");
    const iterations = parseInt(parts[1], 10) || 100_000;
    const expectedHex = parts[2];
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: enc.encode(salt),
        iterations,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );
    const hashArray = Array.from(new Uint8Array(derivedBits));
    const computedHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return constantTimeEqual(computedHex, expectedHex);
  }

  // 2. Retrocompatibilidad transparente con hashes legados SHA-256
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${password}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const computedLegacy = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return constantTimeEqual(computedLegacy, hash);
}

const usersStore = new Map<string, User>();
let syncPromise: Promise<void> | null = null;

function seedDefaultUsers() {
  usersStore.set("usr_admin_01", {
    id: "usr_admin_01",
    username: "admin",
    email: "admin@jerovia.com.py",
    name: "Lic. Michelle Romero",
    role: "admin",
    cargo: "Directora General",
    passwordHash:
      "64a964191b895fd55cdb5b01a36fabe09b276358a0c61cd57705ccb63dfd63a9",
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
    cargo: "Perito Evaluador",
    passwordHash:
      "a7fa4ca835e360820418dca15665094ed64a5121a0b68ee84c5bee0ec9ba0b08",
    passwordSalt: "salt_eval_2026",
    activo: true,
    creadoEn: "2026-09-15T09:30:00.000Z",
  });
}

function loadLocalUsers() {
  try {
    seedDefaultUsers();
    if (fs.existsSync(REPO_USERS_FILE)) {
      const content = fs.readFileSync(REPO_USERS_FILE, "utf-8");
      if (content.trim()) {
        const list: User[] = JSON.parse(content);
        list.forEach((u) => usersStore.set(u.id, u));
      }
    }
    if (fs.existsSync(TMP_USERS_FILE)) {
      const content = fs.readFileSync(TMP_USERS_FILE, "utf-8");
      if (content.trim()) {
        const list: User[] = JSON.parse(content);
        list.forEach((u) => usersStore.set(u.id, u));
      }
    }
  } catch {}
}

export async function syncUsersFromCloud(): Promise<void> {
  if (syncPromise) return syncPromise;
  syncPromise = (async () => {
    try {
      const cloudUsers = await fetchGistJsonFile<User[]>("_users.json");
      if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
        for (const u of cloudUsers) {
          if (u && u.id) {
            usersStore.set(u.id, u);
          }
        }
        saveUsersLocalTmp();
      }
    } catch {} finally {
      syncPromise = null;
    }
  })();
  return syncPromise;
}

function saveUsersLocalTmp() {
  try {
    fs.mkdirSync(TMP_DIR, { recursive: true });
    const list = Array.from(usersStore.values());
    fs.writeFileSync(TMP_USERS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {}
  try {
    const list = Array.from(usersStore.values());
    fs.writeFileSync(REPO_USERS_FILE, JSON.stringify(list, null, 2), "utf-8");
  } catch {}
}

export async function persistUsersCloud(): Promise<void> {
  saveUsersLocalTmp();
  const list = Array.from(usersStore.values());
  await saveGistFiles({
    "_users.json": { content: JSON.stringify(list, null, 2) },
  });
}

loadLocalUsers();
// Sincronización oportunista no bloqueante al inicio
void syncUsersFromCloud();

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

export function obtenerUsuarioPorIdentificador(
  identifier: string
): User | undefined {
  const clean = identifier.toLowerCase().trim();
  for (const user of usersStore.values()) {
    if (
      user.username.toLowerCase() === clean ||
      user.email.toLowerCase() === clean
    ) {
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
  cargo?: string;
  telefono?: string;
}): Promise<SafeUser> {
  await syncUsersFromCloud();

  const existing =
    obtenerUsuarioPorIdentificador(datos.username) ||
    obtenerUsuarioPorIdentificador(datos.email);
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
    cargo: datos.cargo?.trim() || undefined,
    telefono: datos.telefono?.trim() || undefined,
  };

  usersStore.set(id, nuevoUsuario);
  void persistUsersCloud();
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
  void persistUsersCloud();
  return toSafeUser(updated);
}

export async function cambiarContrasena(
  id: string,
  nuevaContrasena: string
): Promise<boolean> {
  await syncUsersFromCloud();
  const user = usersStore.get(id);
  if (!user) return false;
  if (nuevaContrasena.length < 6) {
    throw new Error("La contraseña debe tener un mínimo de 6 caracteres.");
  }
  const { hash, salt } = await hashPassword(nuevaContrasena);
  user.passwordHash = hash;
  user.passwordSalt = salt;
  usersStore.set(id, user);
  await persistUsersCloud();
  return true;
}

export function eliminarUsuario(id: string): boolean {
  const user = usersStore.get(id);
  if (!user) return false;
  if (user.username === "admin") {
    throw new Error(
      "No es posible eliminar la cuenta principal de administración."
    );
  }
  const deleted = usersStore.delete(id);
  if (deleted) void persistUsersCloud();
  return deleted;
}

const DUMMY_HASH =
  "281058ee367ef73d7e7ac1088c42673560ad0efe6c45bb09c7e87573fa8b3433";
const DUMMY_SALT = "jerovia_constant_time_salt_2026";

export async function verificarCredenciales(
  identifier: string,
  password: string
): Promise<SafeUser | null> {
  await syncUsersFromCloud();
  const user = obtenerUsuarioPorIdentificador(identifier);

  // Evitar Timing Attack cuando el usuario no existe o está inactivo
  if (!user || !user.activo) {
    await verifyPassword(password, DUMMY_HASH, DUMMY_SALT);
    return null;
  }

  const valid = await verifyPassword(
    password,
    user.passwordHash,
    user.passwordSalt
  );
  if (!valid) return null;

  // Si el usuario tenía un hash SHA-256 legado, actualizar automáticamente a PBKDF2
  if (!user.passwordHash.startsWith("pbkdf2$")) {
    const upgraded = await hashPassword(password);
    user.passwordHash = upgraded.hash;
    user.passwordSalt = upgraded.salt;
  }

  user.ultimoAcceso = new Date().toISOString();
  void persistUsersCloud();

  return toSafeUser(user);
}
