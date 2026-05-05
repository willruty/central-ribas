import { useState, useEffect } from "react";
import ContractsTable from "@/components/dashboard/ContractsTable";
import { Plus, Filter, Search, FileText, TrendingUp } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Contract } from "@/types/dashboard";
import { Contrato, Cliente } from "@/services/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getContratos, createContrato } from "@/services/contratosService";
import { getClientesAtivos } from "@/services/clientesService";
import { motion } from "framer-motion";

type ContratoComCliente = Contrato & {
  clientes?: Pick<Cliente, "id" | "razao_social" | "nome_fantasia" | "nome_completo">;
};

const STATUS_LABELS: Record<string, string> = {
  rascunho: "Rascunho",
  aprovado: "Aprovado",
  em_execucao: "Ativo",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

function toContractRow(c: ContratoComCliente): Contract {
  const client =
    c.clientes?.razao_social ||
    c.clientes?.nome_fantasia ||
    c.clientes?.nome_completo ||
    c.cliente_id;

  const date = c.data_inicio
    ? new Date(c.data_inicio + "T12:00:00").toLocaleDateString("pt-BR")
    : undefined;

  const days = c.data_fim_previsto
    ? new Date(c.data_fim_previsto + "T12:00:00").toLocaleDateString("pt-BR")
    : "Em aberto";

  return {
    client,
    code: c.numero,
    status: STATUS_LABELS[c.status] ?? c.status,
    days,
    action: "Ver",
    date,
  };
}

const ITEMS_PER_PAGE = 10;

const Contracts = () => {
  const { token } = useAuth();
  const [contratos, setContratos] = useState<ContratoComCliente[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [newClienteId, setNewClienteId] = useState("");
  const [newNumero, setNewNumero] = useState("");
  const [newDataInicio, setNewDataInicio] = useState("");
  const [newDataFim, setNewDataFim] = useState("");
  const [newStatus, setNewStatus] = useState<Contrato["status"]>("rascunho");

  useEffect(() => {
    if (!token) return;
    Promise.all([
      getContratos(token),
      getClientesAtivos(token),
    ]).then(([contratosRes, clientesRes]) => {
      if (contratosRes.error) toast.error(`Erro ao carregar contratos: ${contratosRes.error}`);
      else if (contratosRes.data) setContratos(contratosRes.data as ContratoComCliente[]);

      if (clientesRes.data) setClientes(clientesRes.data);
    }).finally(() => setIsLoading(false));
  }, [token]);

  const rows = contratos.map(toContractRow);

  const filtered = rows.filter(c =>
    c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const ativos = contratos.filter(c => c.status === "em_execucao").length;
  const pendentes = contratos.filter(c => c.status === "rascunho" || c.status === "aprovado").length;

  const handleAddContract = async () => {
    if (!newClienteId || !newNumero || !newDataInicio) {
      toast.error("Selecione o cliente, preencha o número e a data de início.");
      return;
    }

    const payload: Partial<Contrato> & { cliente_id: string } = {
      cliente_id: newClienteId,
      numero: newNumero,
      data_inicio: newDataInicio,
      data_fim_previsto: newDataFim || undefined,
      status: newStatus,
    };

    const { data, error } = await createContrato(payload as any, token!);
    if (error) { toast.error(`Erro: ${error}`); return; }

    setContratos(prev => [data as ContratoComCliente, ...prev]);
    setIsDialogOpen(false);
    setNewClienteId(""); setNewNumero(""); setNewDataInicio(""); setNewDataFim(""); setNewStatus("rascunho");
    toast.success("Contrato cadastrado com sucesso!");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-foreground">Gestão de Contratos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie e acompanhe todos os contratos</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-muted/30 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
            />
          </div>
          <button
            onClick={() => toast.info("Sistema de filtros em desenvolvimento.")}
            className="flex items-center gap-2 text-sm bg-muted/30 border border-border px-4 py-2 rounded text-foreground hover:bg-muted/50 transition-colors"
          >
            <Filter size={14} /> Filtros
          </button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity font-medium">
                <Plus size={16} /> Novo Contrato
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px]">
              <DialogHeader>
                <DialogTitle>Novo Contrato</DialogTitle>
                <DialogDescription>Preencha os dados para cadastrar um novo contrato.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Cliente</Label>
                  <div className="col-span-3">
                    <Select value={newClienteId} onValueChange={setNewClienteId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map(c => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.razao_social || c.nome_fantasia || c.nome_completo || c.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Número</Label>
                  <Input value={newNumero} onChange={(e) => setNewNumero(e.target.value)} className="col-span-3" placeholder="Ex: CTR-2026-001" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Início</Label>
                  <Input type="date" value={newDataInicio} onChange={(e) => setNewDataInicio(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Vencimento</Label>
                  <Input type="date" value={newDataFim} onChange={(e) => setNewDataFim(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Status</Label>
                  <div className="col-span-3">
                    <Select value={newStatus} onValueChange={(v) => setNewStatus(v as Contrato["status"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rascunho">Rascunho</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="em_execucao">Em Execução</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="button" onClick={handleAddContract}>Salvar Contrato</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total de Contratos", value: isLoading ? "…" : contratos.length, icon: FileText, color: "text-primary" },
          { label: "Em Execução", value: isLoading ? "…" : ativos, icon: TrendingUp, color: "text-green-500" },
          { label: "Pendentes", value: isLoading ? "…" : pendentes, icon: Filter, color: "text-yellow-500" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="section-card p-4 flex items-center gap-4"
          >
            <div className="p-2.5 rounded bg-muted/50">
              <item.icon size={18} className={item.color} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-card-foreground">{item.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <ContractsTable data={paginated} isLoading={isLoading} />
        {filtered.length > ITEMS_PER_PAGE && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                  aria-disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                  aria-disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
};

export default Contracts;
