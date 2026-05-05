import { useState, useEffect, useMemo } from "react";
import {
  Plus, Search, Filter, Wrench, CheckCircle2,
  Truck, AlertTriangle, Ban, MoreVertical,
  Gauge, Weight, Ruler, Calendar, Tag, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  getEquipamentos, createEquipamento, updateEquipamento
} from "@/services/equipamentosService";
import { Equipamento, CategoriaEquipamento } from "@/services/types";

// ── Status config ────────────────────────────────────────────────
type StatusKey = Equipamento["status"];

const STATUS_META: Record<StatusKey, {
  label: string; dot: string; ring: string; text: string; bg: string;
}> = {
  disponivel:    { label: "Disponível",    dot: "bg-emerald-500", ring: "ring-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  locado:        { label: "Locado",        dot: "bg-blue-500",    ring: "ring-blue-500/20",    text: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-500/10" },
  em_manutencao: { label: "Manutenção",    dot: "bg-amber-500",   ring: "ring-amber-500/20",   text: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-500/10" },
  inativo:       { label: "Inativo",       dot: "bg-zinc-400",    ring: "ring-zinc-400/20",    text: "text-zinc-400 dark:text-zinc-500",       bg: "bg-zinc-500/10" },
};

type StatusFilter = StatusKey | "todos";

// ── Helpers ─────────────────────────────────────────────────────
function formatCurrency(val?: number) {
  if (val == null) return "—";
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ── Main Component ───────────────────────────────────────────────
const Equipments = () => {
  const { token } = useAuth();
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");

  // Form state
  const [newNome, setNewNome] = useState("");
  const [newModelo, setNewModelo] = useState("");
  const [newFabricante, setNewFabricante] = useState("");
  const [newPlaca, setNewPlaca] = useState("");
  const [newSerie, setNewSerie] = useState("");
  const [newAno, setNewAno] = useState("");
  const [newCapacidade, setNewCapacidade] = useState("");
  const [newDiaria, setNewDiaria] = useState("");

  useEffect(() => {
    if (!token) return;
    getEquipamentos(token).then(({ data, error }) => {
      if (error) toast.error(`Erro ao carregar equipamentos: ${error}`);
      else if (data) setEquipamentos(data);
    }).finally(() => setIsLoading(false));
  }, [token]);

  const categorias = useMemo<CategoriaEquipamento[]>(() => {
    const seen = new Map<string, CategoriaEquipamento>();
    equipamentos.forEach(e => {
      if (e.categorias_equipamento && !seen.has(e.categorias_equipamento.id)) {
        seen.set(e.categorias_equipamento.id, e.categorias_equipamento);
      }
    });
    return Array.from(seen.values()).sort((a, b) => a.nome.localeCompare(b.nome));
  }, [equipamentos]);

  const counts = useMemo(() => ({
    total: equipamentos.length,
    disponivel: equipamentos.filter(e => e.status === "disponivel").length,
    locado: equipamentos.filter(e => e.status === "locado").length,
    em_manutencao: equipamentos.filter(e => e.status === "em_manutencao").length,
    inativo: equipamentos.filter(e => e.status === "inativo").length,
  }), [equipamentos]);

  const filtered = useMemo(() => {
    return equipamentos.filter(e => {
      const matchSearch =
        e.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.modelo ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.fabricante ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.placa ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === "todos" || e.status === statusFilter;
      const matchCategory = categoryFilter === "todas" || e.categoria_id === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [equipamentos, searchTerm, statusFilter, categoryFilter]);

  const handleAddEquipment = async () => {
    if (!newNome) {
      toast.error("Preencha o nome do equipamento.");
      return;
    }

    // categoria_id fixa temporariamente; o backend exige esse campo
    const payload: Partial<Equipamento> & { categoria_id: string } = {
      categoria_id: "00000000-0000-0000-0000-000000000001", // placeholder
      nome: newNome,
      modelo: newModelo || undefined,
      fabricante: newFabricante || undefined,
      placa: newPlaca || undefined,
      numero_serie: newSerie || undefined,
      capacidade_kg: newCapacidade ? parseFloat(newCapacidade) : undefined,
      valor_locacao_diaria: newDiaria ? parseFloat(newDiaria.replace(",", ".")) : undefined,
      status: "disponivel",
      ativo: true,
    };

    if (newAno) (payload as any).ano_fabricacao = parseInt(newAno);

    const { data, error } = await createEquipamento(payload, token!);
    if (error) { toast.error(`Erro: ${error}`); return; }

    setEquipamentos(prev => [data!, ...prev]);
    setIsDialogOpen(false);
    resetForm();
    toast.success("Equipamento cadastrado com sucesso!");
  };

  const handleStatusChange = async (id: string, status: StatusKey) => {
    const { data, error } = await updateEquipamento(id, { status }, token!);
    if (error) { toast.error(`Erro: ${error}`); return; }
    setEquipamentos(prev => prev.map(e => e.id === id ? { ...e, status: data!.status } : e));
    toast.success(`Status atualizado para "${STATUS_META[status].label}"`);
  };

  const resetForm = () => {
    setNewNome(""); setNewModelo(""); setNewFabricante("");
    setNewPlaca(""); setNewSerie(""); setNewAno("");
    setNewCapacidade(""); setNewDiaria("");
  };

  // ── Status chips ──────────────────────────────────────────────
  const chips: { key: StatusFilter; label: string; count: number; icon: typeof Truck; accent: string }[] = [
    { key: "todos",         label: "Todos",       count: counts.total,         icon: Truck,         accent: "text-primary" },
    { key: "disponivel",    label: "Disponíveis", count: counts.disponivel,    icon: CheckCircle2,  accent: "text-emerald-500" },
    { key: "locado",        label: "Locados",     count: counts.locado,        icon: Gauge,         accent: "text-blue-500" },
    { key: "em_manutencao", label: "Manutenção",  count: counts.em_manutencao, icon: Wrench,        accent: "text-amber-500" },
    { key: "inativo",       label: "Inativos",    count: counts.inativo,       icon: Ban,           accent: "text-zinc-400" },
  ];

  return (
    <>
      {/* ── Header ──────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/70 mb-1">
            Frota · Ativos
          </p>
          <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
            Gestão de Equipamentos
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? "Carregando..." : `${counts.total} equipamentos · ${counts.disponivel} disponíveis`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-2 h-10 px-3 bg-muted/30 border border-border rounded text-sm text-foreground hover:bg-muted/50 hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors">
                <Filter size={14} className="text-muted-foreground shrink-0" />
                <span className="max-w-[130px] truncate">
                  {categoryFilter === "todas"
                    ? <span className="text-muted-foreground">Categoria</span>
                    : categorias.find(c => c.id === categoryFilter)?.nome ?? "Categoria"}
                </span>
                <ChevronDown size={13} className="text-muted-foreground shrink-0 ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[180px]">
              <DropdownMenuItem
                onClick={() => setCategoryFilter("todas")}
                className={`cursor-pointer ${categoryFilter === "todas" ? "font-bold text-primary" : ""}`}
              >
                Todas as categorias
              </DropdownMenuItem>
              {categorias.length > 0 && <DropdownMenuSeparator />}
              {categorias.map(cat => (
                <DropdownMenuItem
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`cursor-pointer ${categoryFilter === cat.id ? "font-bold text-primary" : ""}`}
                >
                  {cat.nome}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
            <input
              type="text"
              placeholder="Buscar por nome, modelo, placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 h-10 bg-muted/30 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-72"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                <Plus size={16} /> Novo Equipamento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Novo Equipamento</DialogTitle>
                <DialogDescription>Cadastre uma nova máquina ou veículo na frota.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Nome *</Label>
                  <Input value={newNome} onChange={e => setNewNome(e.target.value)} className="col-span-3" placeholder="Ex: Guindaste Liebherr LTM 1200" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Modelo</Label>
                  <Input value={newModelo} onChange={e => setNewModelo(e.target.value)} className="col-span-3" placeholder="Ex: LTM 1200-5.1" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-sm">Fabricante</Label>
                  <Input value={newFabricante} onChange={e => setNewFabricante(e.target.value)} className="col-span-3" placeholder="Ex: Liebherr" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <Label className="text-sm whitespace-nowrap">Placa</Label>
                    <Input value={newPlaca} onChange={e => setNewPlaca(e.target.value)} placeholder="ABC-1234" />
                  </div>
                  <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <Label className="text-sm">Nº Série</Label>
                    <Input value={newSerie} onChange={e => setNewSerie(e.target.value)} placeholder="SN123456" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm mb-1.5 block">Ano Fab.</Label>
                    <Input type="number" value={newAno} onChange={e => setNewAno(e.target.value)} placeholder="2022" />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Cap. (ton)</Label>
                    <Input type="number" value={newCapacidade} onChange={e => setNewCapacidade(e.target.value)} placeholder="200" />
                  </div>
                  <div>
                    <Label className="text-sm mb-1.5 block">Diária (R$)</Label>
                    <Input value={newDiaria} onChange={e => setNewDiaria(e.target.value)} placeholder="2.500,00" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancelar</Button>
                <Button type="button" onClick={handleAddEquipment}>Cadastrar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Status chips ─────────────────────────────────── */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {chips.map((chip, i) => {
          const active = statusFilter === chip.key;
          return (
            <motion.button
              key={chip.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setStatusFilter(chip.key)}
              className={`group relative text-left p-4 rounded border transition-all overflow-hidden ${
                active
                  ? "bg-card border-primary/40 shadow-lg shadow-primary/5"
                  : "bg-card/50 border-border hover:border-primary/20 hover:bg-card"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="equip-chip-active"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-primary/60"
                />
              )}
              <div className="flex items-center justify-between mb-2">
                <chip.icon size={15} className={`${chip.accent} opacity-80`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {chip.label}
                </span>
              </div>
              <p className="text-2xl font-black text-card-foreground tracking-tight">
                {isLoading ? "…" : chip.count}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* ── Cards grid ───────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="section-card p-5 animate-pulse h-44" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState hasSearch={!!searchTerm} />
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((equip, i) => (
              <EquipmentCard
                key={equip.id}
                equip={equip}
                index={i}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </AnimatePresence>
      )}
    </>
  );
};

// ── Equipment Card ───────────────────────────────────────────────
const EquipmentCard = ({
  equip, index, onStatusChange
}: {
  equip: Equipamento;
  index: number;
  onStatusChange: (id: string, status: StatusKey) => void;
}) => {
  const meta = STATUS_META[equip.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.04 }}
      className="group section-card p-5 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded ${meta.bg} flex items-center justify-center ring-1 ${meta.ring}`}>
          <Truck size={22} className={meta.text} />
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border ring-1 ${meta.ring} ${meta.text} text-[10px] font-bold`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical size={15} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[190px]">
              <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Alterar status
              </p>
              {(Object.entries(STATUS_META) as [StatusKey, typeof STATUS_META[StatusKey]][]).map(([key, val]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => onStatusChange(equip.id, key)}
                  className={`cursor-pointer ${equip.status === key ? "font-bold text-primary" : ""}`}
                >
                  <span className={`w-2 h-2 rounded-full ${val.dot} mr-2`} />
                  {val.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Name & Model */}
      <h3 className="font-bold text-card-foreground leading-snug mb-0.5 group-hover:text-primary transition-colors line-clamp-2">
        {equip.nome}
      </h3>
      {(equip.modelo || equip.categorias_equipamento) && (
        <p className="text-xs text-muted-foreground mb-4">
          {equip.categorias_equipamento && (
            <span className="inline-block bg-primary/8 text-primary/80 font-semibold rounded px-1.5 py-0.5 mr-1.5 text-[10px] uppercase tracking-wide">
              {equip.categorias_equipamento.nome}
            </span>
          )}
          {equip.fabricante ? `${equip.fabricante} · ` : ""}{equip.modelo}
        </p>
      )}

      {/* Details row */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/50">
        {equip.placa && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Tag size={12} className="text-primary/60 shrink-0" />
            <span className="font-mono font-bold text-card-foreground">{equip.placa}</span>
          </div>
        )}
        {equip.capacidade_kg != null && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Weight size={12} className="text-primary/60 shrink-0" />
            <span>{equip.capacidade_kg} t</span>
          </div>
        )}
        {equip.valor_locacao_diaria != null && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground col-span-2">
            <Ruler size={12} className="text-primary/60 shrink-0" />
            <span>
              <span className="font-semibold text-card-foreground">
                {Number(equip.valor_locacao_diaria).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </span>
              {" "}/ dia
            </span>
          </div>
        )}
        {!equip.placa && !equip.capacidade_kg && !equip.valor_locacao_diaria && (
          <p className="text-xs text-muted-foreground/50 italic col-span-2">Sem dados adicionais</p>
        )}
      </div>
    </motion.div>
  );
};

// ── Empty State ─────────────────────────────────────────────────
const EmptyState = ({ hasSearch }: { hasSearch: boolean }) => (
  <div className="section-card min-h-[380px] flex flex-col items-center justify-center text-center py-16">
    <div className="w-20 h-20 bg-primary/5 border border-primary/10 rounded flex items-center justify-center mb-6">
      <Truck className="text-primary/50" size={36} />
    </div>
    <h3 className="text-lg font-bold text-card-foreground">
      {hasSearch ? "Nenhum equipamento encontrado" : "Nenhum equipamento cadastrado"}
    </h3>
    <p className="text-sm text-muted-foreground max-w-sm mt-2">
      {hasSearch
        ? "Tente ajustar os filtros de busca."
        : "Cadastre o primeiro equipamento da frota clicando em \"Novo Equipamento\"."
      }
    </p>
  </div>
);

export default Equipments;
