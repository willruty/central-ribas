import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, LayoutDashboard, FileText, FolderOpen, Users, Calendar,
  CheckSquare, UserCog, BarChart3, Settings, X
} from "lucide-react";

const commands = [
  { icon: LayoutDashboard, label: "Dashboard", description: "Painel principal", path: "/", group: "Navegação" },
  { icon: FileText, label: "Contratos", description: "Gestão de contratos", path: "/contracts", group: "Navegação" },
  { icon: FolderOpen, label: "Documentos", description: "Repositório de documentos", path: "/documents", group: "Navegação" },
  { icon: Users, label: "Clientes", description: "Gestão de clientes", path: "/clients", group: "Navegação" },
  { icon: Calendar, label: "Reuniões", description: "Agenda de reuniões", path: "/meetings", group: "Navegação" },
  { icon: CheckSquare, label: "Tarefas", description: "Gerenciador de tarefas", path: "/tasks", group: "Navegação" },
  { icon: UserCog, label: "Equipe", description: "Gestão da equipe", path: "/team", group: "Navegação" },
  { icon: BarChart3, label: "Relatórios", description: "Relatórios e métricas", path: "/reports", group: "Navegação" },
  { icon: Settings, label: "Configurações", description: "Configurações do sistema", path: "/settings", group: "Navegação" },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const CommandPalette = ({ open, onClose }: CommandPaletteProps) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const filtered = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = useCallback((path: string) => {
    navigate(path);
    onClose();
    setQuery("");
    setSelected(0);
  }, [navigate, onClose]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(0);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && filtered[selected]) { handleSelect(filtered[selected].path); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, selected, filtered, handleSelect, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-card border border-border rounded shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                <Search size={18} className="text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar páginas e ações..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X size={16} />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-border text-[10px] font-bold text-muted-foreground bg-muted">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="py-2 max-h-72 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">Nenhum resultado encontrado</p>
                ) : (
                  filtered.map((cmd, i) => (
                    <button
                      key={cmd.path}
                      onClick={() => handleSelect(cmd.path)}
                      onMouseEnter={() => setSelected(i)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        i === selected ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <div className={`p-1.5 rounded ${i === selected ? "bg-primary/10" : "bg-muted"}`}>
                        <cmd.icon size={15} className={i === selected ? "text-primary" : ""} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${i === selected ? "text-foreground" : ""}`}>{cmd.label}</p>
                        <p className="text-xs truncate opacity-70">{cmd.description}</p>
                      </div>
                      {i === selected && (
                        <kbd className="shrink-0 text-[10px] px-1.5 py-0.5 rounded border border-border bg-muted font-bold text-muted-foreground">
                          ↵
                        </kbd>
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Footer hint */}
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border bg-muted/20">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded border border-border bg-muted font-bold text-[9px]">↑↓</kbd> navegar
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded border border-border bg-muted font-bold text-[9px]">↵</kbd> selecionar
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded border border-border bg-muted font-bold text-[9px]">ESC</kbd> fechar
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
