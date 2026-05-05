import { motion } from "framer-motion";
import { FileText, ChevronRight } from "lucide-react";

import { RecentFile } from "@/types/dashboard";

const files: RecentFile[] = [];

const RecentFiles = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.4 }}
      className="section-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold font-display text-card-foreground">Últimos Arquivos Enviados</h2>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground/70 uppercase tracking-wider mb-2">
        <span>Nome / Autor</span>
        <span>Ver todos <ChevronRight size={10} className="inline" /></span>
      </div>

      <div className="space-y-0 divide-y divide-border/40">
        {files.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground italic text-sm">
            Nenhum arquivo enviado recentemente.
          </div>
        ) : (
          files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 table-row-hover rounded px-1">
              <div className={`w-8 h-8 rounded ${f.color} flex items-center justify-center`}>
                <FileText size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground/70 truncate">{f.author}</p>
              </div>
              <div className="text-right text-xs text-muted-foreground/70">
                <p>{f.time}</p>
                <p>{f.extra}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default RecentFiles;
