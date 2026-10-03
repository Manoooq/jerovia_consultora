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
      title: "Explorar Formulario Pericial (Demo 9 Pasos)",
      category: "Navegación",
      icon: FileText,
      action: () => router.push("/entrevista/demo"),
    },
    {
      id: "login",
      title: "Acceso al Portal de Peritos y Evaluadores",
      category: "Navegación",
      shortcut: "L",
      icon: Key,
      action: () => router.push("/login"),
    },
    {
      id: "dashboard",
      title: "Panel General de Expedientes",
      category: "Navegación",
      shortcut: "D",
      icon: Building2,
      action: () => router.push("/dashboard"),
    },
    {
      id: "dossier",
      title: "Ver Estructura del Informe Oficial (5 Láminas)",
      category: "Herramientas",
      icon: FileText,
      action: () => {
        const el = document.getElementById("dossier");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      },
    },
    {
      id: "simulador",
      title: "Simulador de Aranceles y Plazos de Peritaje",
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
      title: "Mapa de Cobertura Territorial en Paraguay",
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
      title: "Normativa: Ley N° 1682/01 de Protección de Datos",
      category: "Normativa",
      icon: Shield,
      action: () => {
        alert("Ley N° 1682/01: Reglamenta la recopilación y tratamiento de datos crediticios y personales en la República del Paraguay.");
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

  // Escuchar tecla Ctrl+K / Cmd+K
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

  // Manejo de flechas de teclado
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
      {/* Botón trigger para la barra de navegación */}
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 rounded-xl border border-overlay0/60 bg-surface1/80 px-3 py-1.5 text-xs text-subtext0 hover:border-gold hover:text-text transition-all"
        title="Buscar comandos o acciones (Ctrl+K)"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Buscar...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-surface2 px-1.5 py-0.5 font-mono text-[10px] text-subtext1 border border-overlay0/40">
          ⌘K
        </kbd>
      </button>

      {/* Modal flotante estilo Linear / Stripe */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-xl rounded-2xl border border-overlay0/80 bg-surface0 shadow-2xl overflow-hidden flex flex-col"
            onKeyDown={handleKeyDown}
          >
            {/* Input de Búsqueda */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-overlay0/30 bg-surface1/40">
              <Search className="h-4 w-4 text-gold shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Escribe un comando o busca una sección..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                className="w-full bg-transparent text-sm text-text placeholder-subtext0 outline-none font-medium"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-subtext0 hover:text-text p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Lista de Resultados */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="p-6 text-center text-xs text-subtext0">
                  No se encontraron comandos para &quot;{query}&quot;.
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
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-colors text-xs ${
                        isSelected
                          ? "bg-gold/10 text-text font-semibold border border-gold/30"
                          : "text-subtext1 hover:bg-surface1"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`h-4 w-4 ${isSelected ? "text-gold" : "text-subtext0"}`} />
                        <span>{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-subtext0 bg-surface1 px-2 py-0.5 rounded-md border border-overlay0/20">
                          {item.category}
                        </span>
                        {item.shortcut && (
                          <kbd className="font-mono text-[10px] text-gold bg-surface2 px-1.5 py-0.5 rounded border border-overlay0/40">
                            {item.shortcut}
                          </kbd>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Pie de Ayuda del Command Menu */}
            <div className="px-4 py-2.5 border-t border-overlay0/30 bg-mantle text-[11px] text-subtext0 flex items-center justify-between">
              <div className="flex items-center gap-3 font-mono">
                <span>↑↓ Navegar</span>
                <span>↵ Seleccionar</span>
                <span>ESC Cerrar</span>
              </div>
              <span className="font-mono text-gold font-bold">Jerovia OS · v2.6</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
