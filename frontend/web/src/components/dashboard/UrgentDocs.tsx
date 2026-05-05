import { motion } from "framer-motion";
import { FileText, ChevronRight } from "lucide-react";

import { UrgentDoc } from "@/types/dashboard";

const urgent: UrgentDoc[] = [];

const UrgentDocs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.45 }}
      className="rounded p-5 bg-gradient-to-br from-[hsl(0,50%,25%)] to-[hsl(0,45%,18%)] text-white h-full"
    >
      <div className="flex items-center gap-2 mb-4">
        <FileText size={18} />
        <h2 className="text-base font-bold font-display uppercase tracking-wider">Documentos Urgentes</h2>
      </div>

      <div className="space-y-4">
        {urgent.length === 0 ? (
          <div className="py-8 text-center text-white/50 italic text-sm">
            Nenhum documento urgente.
          </div>
        ) : (
          urgent.map((u, i) => (
            <div key={i} className="flex items-start gap-3">
              {u.priority > 0 && (
                <span className="w-5 h-5 rounded bg-white/20 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {u.priority}
                </span>
              )}
              {u.priority === 0 && (
                <span className="w-5 h-5 rounded bg-white/10 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{u.code}</p>
                <p className="text-xs opacity-70">{u.desc}</p>
                {u.detail && <p className="text-xs opacity-50">{u.detail}</p>}
              </div>
              <span className="text-xs opacity-70 flex-shrink-0">{u.time}</span>
            </div>
          ))
        )}
      </div>

      <button className="mt-4 w-full border border-white/30 rounded py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
        Ver Documentos <ChevronRight size={14} />
      </button>
    </motion.div>
  );
};

export default UrgentDocs;
