import { motion } from "framer-motion";
import { User, Phone, MapPin, ChevronRight, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "Ativo" | "Inativo";
}

interface ClientsTableProps {
  data: ClientData[];
  isLoading?: boolean;
}

const ClientsTable = ({ data, isLoading = false }: ClientsTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="section-card"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground/70 uppercase tracking-wider">
              <th className="text-left pb-3 font-medium">Cliente</th>
              <th className="text-left pb-3 font-medium">Contato</th>
              <th className="text-left pb-3 font-medium">Localização</th>
              <th className="text-left pb-3 font-medium">Status</th>
              <th className="text-right pb-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="table-row-hover">
                  <td className="py-4"><Skeleton className="h-4 w-36" /></td>
                  <td className="py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="py-4"><Skeleton className="h-5 w-16 rounded" /></td>
                  <td className="py-4 text-right flex justify-end"><Skeleton className="h-8 w-20 rounded-md" /></td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground italic">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              data.map((client) => (
                <tr key={client.id} className="table-row-hover">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-card-foreground">{client.name}</p>
                        <p className="text-[10px] text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Phone size={12} />
                      <span>{client.phone}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin size={12} />
                      <span>{client.location}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={client.status === "Ativo" ? "badge-active" : "badge-pending"}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <DropdownMenu>
                        <DropdownMenuTrigger className="p-1 hover:bg-muted rounded-md transition-colors">
                          <MoreVertical size={16} className="text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">Editar</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">Ver Contratos</DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <button className="p-1 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ClientsTable;
