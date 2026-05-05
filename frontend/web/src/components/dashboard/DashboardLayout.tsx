import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const [collapsed] = useLocalStorage<boolean>("gr:sidebar-collapsed", false);

  return (
    <div className="min-h-screen bg-background flex font-sans overflow-hidden transition-colors duration-300">
      <Sidebar />

      <motion.div
        animate={{ marginLeft: collapsed ? 76 : 264 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col min-h-screen relative z-10"
      >
        <Header />

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            id="dashboard-main"
            className="flex-1 p-8 overflow-y-auto relative"
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </motion.main>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default DashboardLayout;
