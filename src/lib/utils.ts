import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
  }).format(Number.isFinite(amount) ? amount : 0);
}

/**
 * Convierte cualquier fecha (YYYY-MM-DD, ISO o DD/MM/YYYY) al formato oficial día/mes/año (DD/MM/YYYY)
 */
export function formatDateToPy(val: unknown): string {
  if (!val) return "";
  const str = String(val).trim();
  if (!str) return "";
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
    return str;
  }
  if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(str)) {
    return str.replace(/-/g, "/");
  }
  const clean = str.slice(0, 10);
  const parts = clean.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return str;
}

export function formatDate(date: string): string {
  return formatDateToPy(date);
}

/**
 * Genera tokens seguros con CSPRNG (crypto.getRandomValues)
 */
export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomValues[i] % chars.length);
  }
  return result;
}
