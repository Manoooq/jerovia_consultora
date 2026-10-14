"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, FileText, MapPin, Calculator, Shield, 
  Moon, Sun, X, Key, Building2
} from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navegación" | "Herramientas" | "Normativa" | "Sistema";
  shortcut?: string;
  icon: typeof Search;
  action: () => void;
}

export function CommandPalette() {
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

  const commands: CommandItem[] = [
    {
      id: "demo",
      title: "Explorar Formulario Pericial (Demo)",
      category: "Navegación",
      icon: FileText,
      action: () => router.push("/entrevista/demo"),
    },
    {
      id: "login",
      title: "Acceso al Portal Pericial",
      category: "Navegación",
      shortcut: "L",
      icon: Key,
      action: () => router.push("/login"),
    },
    {
      id: "dashboard",
      title: "Panel General",
      category: "Navegación",
      shortcut: "D",
      icon: Building2,
      action: () => router.push("/dashboard"),
    },
    {
      id: "dossier",
      title: "Estructura del Informe",
      category: "Herramientas",
      icon: FileText,
      action: () => {
        const el = document.getElementById("showcase");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      },
    },
    {
      id: "simulador",
      title: "Cotizador de Aranceles",
      category: "Herramientas",
      icon: Calculator,
      action: () => {
        const el = document.getElementById("simulador");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      },
    },
    {
      id: "mapa",
      title: "Mapa de Cobertura",
      category: "Herramientas",
      icon: MapPin,
      action: () => {
        const el = document.getElementById("cobertura");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      },
    },
    {
      id: "ley1682",
      title: "Ley N° 1682/01 de Protección de Datos",
      category: "Normativa",
      icon: Shield,
      action: () => {
        alert("Ley N° 1682/01: Reglamenta la recopilación y tratamiento de datos crediticios y personales.");
      },
    },
    {
      id: "theme",
      title: `Alternar Tema (${isDark ? "Modo Claro" : "Modo Oscuro"})`,
      category: "Sistema",
      shortcut: "T",
      icon: isDark ? Sun : Moon,
      action: toggleTheme,
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
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
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      setIsOpen(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-lg border border-overlay0 bg-surface1 px-3 py-1.5 text-sm text-subtext0 hover:border-overlay1 hover:text-text transition-all shadow-sm"
        title="Buscar (Ctrl+K)"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Buscar...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-surface2 px-1.5 py-0.5 text-xs text-subtext1 border border-overlay0 font-sans">
          ⌘K
        </kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-24 bg-base/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl rounded-xl border border-overlay0 bg-surface0 shadow-2xl overflow-hidden flex flex-col"
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-overlay0 bg-surface0">
              <Search className="h-5 w-5 text-subtext0 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Busca herramientas, secciones o comandos..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-base text-text placeholder-subtext0 outline-none"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-subtext0 hover:text-text p-1 rounded-md hover:bg-surface1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-sm text-subtext0">
                  No se encontraron resultados para &quot;{query}&quot;.
                </div>
              ) : (
                filteredCommands.map((item, index) => {
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
                      className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors text-sm ${
                        isSelected
                          ? "bg-surface1 text-text font-medium"
                          : "text-subtext0 hover:bg-surface1/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 ${isSelected ? "text-text" : "text-subtext1"}`} />
                        <span>{item.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-subtext1 bg-surface2 px-2 py-1 rounded-md">
                          {item.category}
                        </span>
                        {item.shortcut && (
                          <kbd className="text-xs text-subtext0 bg-surface2 px-2 py-1 rounded-md border border-overlay0">
                            {item.shortcut}
                          </kbd>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="px-4 py-3 border-t border-overlay0 bg-surface1 text-xs text-subtext0 flex items-center gap-4">
               <span><kbd className="bg-surface2 px-1 py-0.5 rounded border border-overlay0">↑</kbd> <kbd className="bg-surface2 px-1 py-0.5 rounded border border-overlay0">↓</kbd> Navegar</span>
               <span><kbd className="bg-surface2 px-1 py-0.5 rounded border border-overlay0">↵</kbd> Seleccionar</span>
               <span><kbd className="bg-surface2 px-1 py-0.5 rounded border border-overlay0">esc</kbd> Cerrar</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
