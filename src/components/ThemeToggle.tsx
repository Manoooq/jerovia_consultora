"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark" | "system";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("jerovia-theme") as ThemeMode | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    } else {
      applyTheme("system");
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const current = localStorage.getItem("jerovia-theme") as ThemeMode | null;
      if (!current || current === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  function applyTheme(mode: ThemeMode) {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else if (mode === "light") {
      root.classList.remove("dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }

  function handleSelect(mode: ThemeMode) {
    setTheme(mode);
    localStorage.setItem("jerovia-theme", mode);
    applyTheme(mode);
  }

  if (!mounted) {
    return (
      <div className={cn("flex items-center rounded-xl border border-overlay0/40 bg-surface1 p-1", className)}>
        <div className="h-7 w-20" />
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Selector de apariencia visual"
      className={cn(
        "inline-flex items-center gap-1 rounded-xl border border-overlay0/60 bg-surface1 p-1 shadow-sm",
        className
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === "light"}
        aria-label="Activar modo claro"
        onClick={() => handleSelect("light")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus-visible:ring-2",
          theme === "light"
            ? "bg-gold text-black shadow-sm font-bold"
            : "text-subtext0 hover:text-text hover:bg-surface2"
        )}
      >
        <Sun className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === "system"}
        aria-label="Modo automático según la configuración de tu teléfono o sistema"
        onClick={() => handleSelect("system")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus-visible:ring-2",
          theme === "system"
            ? "bg-gold text-black shadow-sm font-bold"
            : "text-subtext0 hover:text-text hover:bg-surface2"
        )}
      >
        <Smartphone className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === "dark"}
        aria-label="Activar modo oscuro"
        onClick={() => handleSelect("dark")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg transition-colors focus-visible:ring-2",
          theme === "dark"
            ? "bg-gold text-black shadow-sm font-bold"
            : "text-subtext0 hover:text-text hover:bg-surface2"
        )}
      >
        <Moon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
