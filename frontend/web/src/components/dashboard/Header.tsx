import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import CommandPalette from "./CommandPalette";
import { useTheme } from "@/components/theme-provider";

const Header = () => {
  const [cmdOpen, setCmdOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const ThemeIcon = theme === "dark" ? Moon : Sun;

  const cycleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getPageLabel = () => {
    const routes: Record<string, string> = {
      "/": "Dashboard",
      "/contracts": "Contratos",
      "/clients": "Clientes",
      "/documents": "Documentos",
      "/meetings": "Reuniões",
      "/tasks": "Tarefas",
      "/team": "Equipe",
      "/reports": "Relatórios",
      "/settings": "Configurações",
    };
    return routes[location.pathname] || "Página";
  };

  return (
    <>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      <header className="bg-background/80 flex items-center justify-between px-8 gap-6 sticky top-0 z-20 backdrop-blur-md border-b border-border/50 transition-colors duration-300">
        {/* Page Indicator with Animation */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 min-w-0"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary/5 border border-primary/10">
            <motion.div
              className="w-2 h-2 rounded-full bg-primary"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-sm font-semibold text-foreground tracking-wide">
              {getPageLabel()}
            </span>
          </div>
        </motion.div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Search trigger (Cmd+K) */}
          <button
            onClick={() => setCmdOpen(true)}
            title="Buscar (⌘K)"
            className="p-2 bg-card border border-border rounded text-muted-foreground hover:text-primary hover:shadow-md transition-all"
          >
            <Search size={18} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            title={`Tema: ${theme}`}
            className="p-2 bg-card border border-border rounded text-muted-foreground hover:text-primary hover:shadow-md transition-all"
          >
            <ThemeIcon size={18} />
          </button>

          {/* User profile */}
          <div className="flex items-center gap-3 pl-3 border-l border-border/50">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-foreground leading-tight">Helena Ribas</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Administradora</span>
            </div>
            <div className="w-9 h-9 rounded bg-primary/10 border border-border shadow-sm flex items-center justify-center">
              <span className="text-sm font-bold text-primary">HR</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
