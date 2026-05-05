import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { PendingDoc } from "@/types/dashboard";

const docs: PendingDoc[] = [];

const PendingDocs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.3 }}
      className="section-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold font-display text-card-foreground">Documentos Pendentes</h2>
        <button className="text-xs text-status-info flex items-center gap-1 hover:underline">
          Ver documentos <ChevronRight size={14} />
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground/70 uppercase tracking-wider">
            <th className="text-left pb-2 font-medium">Tipo</th>
            <th className="text-left pb-2 font-medium">Clientes</th>
            <th className="text-left pb-2 font-medium">Última atualização</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {docs.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-8 text-center text-muted-foreground italic">
                Nenhum documento pendente.
              </td>
            </tr>
          ) : (
            docs.map((d, i) => (
              <tr key={i} className="table-row-hover">
                <td className="py-2.5 font-medium text-card-foreground">{d.type}</td>
                <td className="py-2.5 text-muted-foreground/80">{d.client}</td>
                <td className="py-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${d.status === "success" ? "bg-status-success" : "bg-status-pending"}`} />
                    <span className="text-muted-foreground/80">{d.time}</span>
                    <ChevronRight size={12} className="text-muted-foreground/50 ml-auto" />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button className="mt-3 text-xs text-muted-foreground/70 hover:text-card-foreground flex items-center gap-1">
        Ver documentos <ChevronRight size={14} />
      </button>
    </motion.div>
  );
};

export default PendingDocs;
