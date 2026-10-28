"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  MapPin,
  Calculator,
  Shield,
  Moon,
  Sun,
  X,
  Key,
  Building2,
  CircleHelp,
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navegación" | "Sección" | "Sistema";
  shortcut?: string;
  icon: typeof Search;
  action: () => void;
}

interface CommandPaletteProps {
  variant?: "default" | "hero-icon";
}

export function CommandPalette({ variant = "default" }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, [isOpen]);

  const toggleTheme = () => {
    const root = document.documentElement;
    const nextDark = !root.classList.contains("dark");
    if (nextDark) {
      root.classList.add("dark");
      localStorage.setItem("jerovia-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("jerovia-theme", "light");
    }
    setIsDark(nextDark);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const commands: CommandItem[] = [
    {
      id: "demo",
      title: "Probar Cuestionario Socioambiental (Demo 9 Módulos)",
      category: "Navegación",
      icon: FileText,
      action: () => router.push("/entrevista/demo"),
    },
    {
      id: "login",
      title: "Ingresar al Portal de Evaluadores",
      category: "Navegación",
      shortcut: "L",
      icon: Key,
      action: () => router.push("/login"),
    },
    {
      id: "dashboard",
      title: "Ir al Panel General de Expedientes",
      category: "Navegación",
      shortcut: "D",
      icon: Building2,
      action: () => router.push("/dashboard"),
    },
    {
      id: "showcase",
      title: "Explorar Consola Interactiva y 5 Láminas",
      category: "Sección",
      icon: FileText,
      action: () => scrollToSection("showcase"),
    },
    {
      id: "simulador",
      title: "Simulador de Aranceles y Plazos",
      category: "Sección",
      icon: Calculator,
      action: () => scrollToSection("simulador"),
    },
    {
      id: "mapa",
      title: "Mapa de Cobertura en Paraguay",
      category: "Sección",
      icon: MapPin,
      action: () => scrollToSection("cobertura"),
    },
    {
      id: "especificaciones",
      title: "Especificaciones del Servicio",
      category: "Sección",
      icon: Shield,
      action: () => scrollToSection("especificaciones"),
    },
    {
      id: "theme",
      title: `Cambiar a ${isDark ? "Modo Claro" : "Modo Oscuro"}`,
      category: "Sistema",
      shortcut: "T",
      icon: isDark ? Sun : Moon,
      action: toggleTheme,
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) =>
          (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1)
      );
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      setIsOpen(false);
    }
  };

  return (
    <>
      {variant === "hero-icon" ? (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setQuery("");
            setSelectedIndex(0);
          }}
          className="h-9 w-9 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
          title="Comandos y ayuda rápida (Ctrl+K)"
          aria-label="Abrir buscador de comandos"
        >
          <CircleHelp className="h-5 w-5 stroke-[1.8]" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setQuery("");
            setSelectedIndex(0);
          }}
          className="min-h-[38px] flex items-center gap-2 rounded-xl border border-overlay1 bg-surface1 px-3 py-1.5 text-xs font-bold text-text hover:border-gold transition-all cursor-pointer"
          title="Comandos rápidos (Ctrl+K)"
        >
          <Search className="h-3.5 w-3.5 text-gold" />
          <span className="hidden sm:inline">Buscar</span>
          <kbd className="hidden sm:inline-flex items-center rounded bg-surface2 px-1.5 py-0.5 font-mono text-[10px] text-subtext1 border border-overlay1">
            ⌘K
          </kbd>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.16 }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              className="w-full max-w-xl rounded-2xl border border-overlay1 bg-surface0 shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-overlay0 bg-surface1/60">
                <Search className="h-4 w-4 text-gold shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Ir a sección, probar cuestionario o cambiar tema..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="w-full bg-transparent text-sm text-text placeholder:text-subtext0 outline-none font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-subtext1 hover:text-text p-1 cursor-pointer"
                  aria-label="Cerrar buscador"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filteredCommands.map((item, index) => {
                  const isSelected = selectedIndex === index;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors text-xs cursor-pointer ${
                        isSelected
                          ? "bg-gold/15 text-text font-bold border border-gold/40"
                          : "text-subtext1 hover:bg-surface1"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`h-4 w-4 ${
                            isSelected ? "text-gold" : "text-subtext0"
                          }`}
                        />
                        <span>{item.title}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-subtext1 bg-surface1 px-2 py-0.5 rounded-md border border-overlay0">
                        {item.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
