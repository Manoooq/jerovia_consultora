"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs font-semibold text-subtext0 hover:text-red transition-colors px-2 py-1 rounded-lg hover:bg-surface2"
      title="Cerrar sesión de administrador"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden md:inline">{loading ? "Saliendo..." : "Cerrar sesión"}</span>
    </button>
  );
}
