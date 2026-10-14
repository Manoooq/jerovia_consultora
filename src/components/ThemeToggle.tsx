"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
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
    const body = document.body;
    let isDark = false;
    if (mode === "dark") {
      isDark = true;
    } else if (mode === "light") {
      isDark = false;
    } else {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    if (isDark) {
      root.classList.add("dark");
      if (body) body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      if (body) body.classList.remove("dark");
    }
  }

  function handleSelect(mode: ThemeMode) {
    setTheme(mode);
    localStorage.setItem("jerovia-theme", mode);
    applyTheme(mode);
  }

  if (!mounted) {
    return (
      <div className={cn("flex items-center rounded-lg border border-overlay0 bg-surface1 p-1", className)}>
        <div className="h-7 w-20" />
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Selector de tema"
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border border-overlay0 bg-surface1 p-1 shadow-sm",
        className
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === "light"}
        aria-label="Tema Claro"
        onClick={() => handleSelect("light")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          theme === "light"
            ? "bg-surface0 text-text shadow-sm border border-overlay1"
            : "text-subtext0 hover:text-text hover:bg-surface2"
        )}
      >
        <Sun className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === "system"}
        aria-label="Tema del Sistema"
        onClick={() => handleSelect("system")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          theme === "system"
            ? "bg-surface0 text-text shadow-sm border border-overlay1"
            : "text-subtext0 hover:text-text hover:bg-surface2"
        )}
      >
        <Monitor className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === "dark"}
        aria-label="Tema Oscuro"
        onClick={() => handleSelect("dark")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
          theme === "dark"
            ? "bg-surface0 text-text shadow-sm border border-overlay1"
            : "text-subtext0 hover:text-text hover:bg-surface2"
        )}
      >
        <Moon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
