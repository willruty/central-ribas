import {
  LayoutDashboard, FolderOpen, Users,
  UserCog, BarChart3, Settings,
  PanelLeftClose, PanelLeftOpen, Truck
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Logo from "@/components/Logo";

type NavItem = { icon: typeof LayoutDashboard; label: string; path: string; badge?: string };
type NavSection = { label: string; items: NavItem[] };

const navSections: NavSection[] = [
  {
    label: "Operação",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/" },
      { icon: FolderOpen, label: "Documentos", path: "/documents" },
      { icon: Truck, label: "Equipamentos", path: "/equipments" },
      { icon: Users, label: "Funcionários", path: "/team" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { icon: BarChart3, label: "Relatórios", path: "/reports" },
      { icon: Settings, label: "Configurações", path: "/settings" },
    ],
  },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useLocalStorage<boolean>("gr:sidebar-collapsed", false);
  const { user } = useAuth();
  const displayName = user?.email?.split("@")[0] ?? "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 264 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="h-screen fixed left-0 top-0 z-40 flex flex-col overflow-hidden bg-gradient-to-b from-[hsl(222,47%,9%)] via-[hsl(222,47%,7%)] to-[hsl(222,47%,5%)] border-r border-white/5"
    >
      {/* ── Brand ────────────────────────────────────────────── */}
      <div className={`h-[72px] shrink-0 flex items-center border-b border-white/5 ${collapsed ? "justify-center px-2" : "justify-between gap-3 px-5"}`}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2.5 min-w-0"
            >
              <Logo collapsed={false} className="w-[104px] h-auto" />
            </motion.div>
          ) : (
            <motion.div
              key="logo-icon"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.18 }}
            >
              <Logo collapsed className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded text-white/50 hover:bg-white/5 hover:text-white transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* ── Navegação agrupada (Chunking/Miller) ─────────────── */}
      <nav className={`flex-1 overflow-y-auto scrollbar-hide ${collapsed ? "px-2 py-5 space-y-3" : "px-3 py-5 space-y-6"}`}>
        {navSections.map((section) => (
          <div key={section.label} className="space-y-1.5">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                {section.label}
              </p>
            )}
            {collapsed && <div className="mx-3 my-2 h-px bg-white/5" />}

            {section.items.map((item) => (
              collapsed ? (
                <Tooltip key={item.label} delayDuration={80}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className={({ isActive }) =>
                        `relative flex items-center justify-center h-12 w-12 mx-auto rounded transition-all duration-200 ${
                          isActive
                            ? "bg-white/10 text-white shadow-inner shadow-white/5"
                            : "text-white/50 hover:bg-white/5 hover:text-white"
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="sidebar-active-dot"
                              className="absolute left-0 w-1 h-7 bg-gradient-to-b from-blue-400 to-blue-500 rounded-r-full"
                            />
                          )}
                          <item.icon size={19} />
                          {item.badge && (
                            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center border border-[hsl(222,47%,7%)]">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-semibold text-xs">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `group/nav relative flex items-center gap-3 h-12 px-3 rounded text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 ${
                      isActive
                        ? "bg-white/10 text-white shadow-inner shadow-white/5"
                        : "text-white/55 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-bar"
                          className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-500 rounded-r-full"
                        />
                      )}
                      <item.icon size={18} className={`shrink-0 transition-transform group-hover/nav:scale-110 ${isActive ? "text-blue-300" : ""}`} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className={`px-1.5 h-[18px] rounded-full text-[10px] font-black flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-blue-500 text-white"
                            : "bg-white/10 text-white/70 group-hover/nav:bg-white/20"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              )
            ))}
          </div>
        ))}
      </nav>

      {/* ── Perfil + Logout (Fitts: alvos grandes) ───────────── */}
      <div className={`shrink-0 border-t border-white/5 ${collapsed ? "p-2 flex flex-col items-center gap-2" : "p-3"}`}>
        {!collapsed ? (
          <button
            onClick={() => toast.info("Perfil em breve.")}
            className="w-full group/prof flex items-center gap-3 p-2.5 rounded hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-black text-[13px] shadow-md shadow-blue-500/30">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[hsl(222,47%,7%)]" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-bold text-white truncate leading-tight">{displayName}</p>
              <p className="text-[10px] text-white/40 font-medium uppercase tracking-wider">Administrador</p>
            </div>
          </button>
        ) : (
          <Tooltip delayDuration={80}>
            <TooltipTrigger asChild>
              <button className="relative w-11 h-11 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/30 hover:scale-105 transition-transform">
                {initials}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[hsl(222,47%,7%)]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">{displayName} · Admin</TooltipContent>
          </Tooltip>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
