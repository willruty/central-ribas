import { useState, useEffect } from "react";
import ClientsTable, { ClientData } from "@/components/dashboard/ClientsTable";
import { Plus, Search, Users, Filter, UserCheck, UserX } from "lucide-react";
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
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { getClientes, createCliente } from "@/services/clientesService";
import { Cliente } from "@/services/types";
import { motion } from "framer-motion";

function toClientData(c: Cliente): ClientData {
  const name = c.razao_social || c.nome_fantasia || c.nome_completo || "—";
  const location = [c.cidade, c.estado].filter(Boolean).join(", ") || "—";
  return {
    id: c.id,
    name,
    email: c.email || "—",
    phone: c.celular || c.telefone || "—",
    location,
    status: c.ativo ? "Ativo" : "Inativo",
  };
}

const ITEMS_PER_PAGE = 10;

const Clients = () => {
  const { token } = useAuth();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [newTipo, setNewTipo] = useState<"pessoa_juridica" | "pessoa_fisica">("pessoa_juridica");
  const [newNome, setNewNome] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newTelefone, setNewTelefone] = useState("");
  const [newCidade, setNewCidade] = useState("");

  useEffect(() => {
    if (!token) return;
    getClientes(token).then(({ data, error }) => {
      if (error) toast.error(`Erro ao carregar clientes: ${error}`);
      else if (data) setClients(data);
    }).finally(() => setIsLoading(false));
  }, [token]);

  const clientData = clients.map(toClientData);

  const filtered = clientData.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const ativos = clientData.filter(c => c.status === "Ativo").length;
  const inativos = clientData.filter(c => c.status === "Inativo").length;

  const handleAddClient = async () => {
    if (!newNome) {
      toast.error("Preencha o nome do cliente.");
      return;
    }

    const payload: Partial<Cliente> = {
      tipo: newTipo,
      email: newEmail || undefined,
      celular: newTelefone || undefined,
      cidade: newCidade || undefined,
      ativo: true,
      ...(newTipo === "pessoa_juridica"
        ? { razao_social: newNome }
        : { nome_completo: newNome }),
    };

    const { data, error } = await createCliente(payload, token!);
    if (error) { toast.error(`Erro: ${error}`); return; }

    setClients(prev => [data!, ...prev]);
    setIsDialogOpen(false);
    setNewNome(""); setNewEmail(""); setNewTelefone(""); setNewCidade("");
    toast.success("Cliente cadastrado com sucesso!");
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-foreground">Gestão de Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie sua base de clientes</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Pesquisar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-muted/30 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
            />
          </div>
          <button
            onClick={() => toast.info("Filtros avançados em desenvolvimento.")}
            className="flex items-center gap-2 text-sm bg-muted/30 border border-border px-4 py-2 rounded text-foreground hover:bg-muted/50 transition-colors"
          >
            <Filter size={14} className="text-muted-foreground" /> Filtros
          </button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity font-medium">
                <Plus size={16} /> Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px]">
              <DialogHeader>
                <DialogTitle>Novo Cliente</DialogTitle>
                <DialogDescription>Adicione um novo cliente à sua base de dados.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Tipo</Label>
                  <div className="col-span-3">
                    <Select value={newTipo} onValueChange={(v) => setNewTipo(v as typeof newTipo)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                        <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">
                    {newTipo === "pessoa_juridica" ? "Razão Social" : "Nome"}{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input value={newNome} onChange={(e) => setNewNome(e.target.value)} className="col-span-3" placeholder="Nome completo / Razão social" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right text-sm mt-2.5">E-mail</Label>
                  <div className="col-span-3">
                    <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@exemplo.com" />
                    {newEmail.length > 0 && !(newEmail.includes("@") && newEmail.includes(".")) && (
                      <p className="text-xs text-destructive mt-1">E-mail inválido</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">
                    Telefone{" "}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {newTelefone.length}/15
                    </span>
                  </Label>
                  <Input value={newTelefone} onChange={(e) => setNewTelefone(e.target.value)} className="col-span-3" placeholder="(00) 90000-0000" maxLength={15} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Cidade</Label>
                  <Input value={newCidade} onChange={(e) => setNewCidade(e.target.value)} className="col-span-3" placeholder="Ex: Curitiba" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="button" onClick={handleAddClient}>Cadastrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total de Clientes", value: isLoading ? "…" : clients.length, icon: Users, color: "text-primary" },
          { label: "Clientes Ativos", value: isLoading ? "…" : ativos, icon: UserCheck, color: "text-green-500" },
          { label: "Inativos", value: isLoading ? "…" : inativos, icon: UserX, color: "text-red-500" },
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
        <ClientsTable data={paginated} isLoading={isLoading} />
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

export default Clients;
