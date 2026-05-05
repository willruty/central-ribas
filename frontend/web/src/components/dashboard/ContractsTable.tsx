import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight, FileText, Calendar } from "lucide-react";
import { Contract } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

interface ContractsTableProps {
  data: Contract[];
  isLoading?: boolean;
}

const ContractsTable = ({ data, isLoading = false }: ContractsTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="section-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-display text-card-foreground">Lista de Contratos</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground/70 uppercase tracking-wider">
              <th className="text-left pb-3 font-medium">Cliente</th>
              <th className="text-left pb-3 font-medium">Código</th>
              <th className="text-left pb-3 font-medium">Status</th>
              <th className="text-left pb-3 font-medium">Prazo/Data</th>
              <th className="text-right pb-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="table-row-hover">
                  <td className="py-3"><Skeleton className="h-4 w-36" /></td>
                  <td className="py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-3"><Skeleton className="h-5 w-16 rounded" /></td>
                  <td className="py-3"><Skeleton className="h-4 w-20" /></td>
                  <td className="py-3 text-right flex justify-end"><Skeleton className="h-8 w-20 rounded-md" /></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground italic">
                  Nenhum contrato encontrado.
                </td>
              </tr>
            ) : (
              data.map((c, i) => (
                <motion.tr 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="table-row-hover"
                >
                  <td className="py-3 font-medium text-card-foreground">
                    <div className="flex items-center gap-2">
                      {c.client}
                      {c.date && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-muted px-2 py-0.5 rounded">
                          <Calendar size={10} /> {c.date}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground/80">{c.code}</td>
                  <td className="py-3">
                    <span className={c.status === "Pendente" ? "badge-pending" : "badge-active"}>
                      {c.status === "Pendente" && <AlertTriangle size={10} />} {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-card-foreground">{c.days || "-"}</td>
                  <td className="py-3 text-right">
                    <button className="inline-flex items-center gap-1 text-xs bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-md text-card-foreground transition-colors">
                      <FileText size={12} /> Detalhes <ChevronRight size={12} />
                    </button>
                  </td>
                </motion.tr>
              ))

            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ContractsTable;

