import { useState, useMemo } from "react";
import {
  Plus, CheckSquare, Search, Filter, Clock, AlertTriangle,
  CheckCircle2, Trash2, Flag, Sparkles, TrendingUp
} from "lucide-react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { mockTasks, MockTask } from "@/lib/mockData";

type Priority = "Alta" | "Média" | "Baixa";
type Status = "Pendente" | "Concluido";

const PRIORITY_META: Record<Priority, { dot: string; text: string; bg: string; ring: string }> = {
  Alta:  { dot: "bg-red-500",     text: "text-red-600 dark:text-red-400",     bg: "bg-red-500/10",     ring: "ring-red-500/20" },
  Média: { dot: "bg-amber-500",   text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10",   ring: "ring-amber-500/20" },
  Baixa: { dot: "bg-blue-400",    text: "text-blue-500 dark:text-blue-400",   bg: "bg-blue-500/10",    ring: "ring-blue-500/20" },
};

const Tasks = () => {
  const [tasks, setTasks] = useLocalStorage<MockTask[]>("gr:tasks", mockTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"Todos" | Status>("Todos");
  const [filterPriority, setFilterPriority] = useState<"Todas" | Priority>("Todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("Média");
  const [newCategory, setNewCategory] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  const handleAddTask = () => {
    if (!newTitle) {
      toast.error("Dê um título para a tarefa.");
      return;
    }
    const newTask: MockTask = {
      id: crypto.randomUUID(),
      title: newTitle,
      priority: newPriority,
      status: "Pendente",
      deadline: newDeadline
        ? new Date(newDeadline + "T12:00:00").toLocaleDateString("pt-BR")
        : "Hoje",
      category: newCategory || "Geral",
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...tasks]);
    setIsDialogOpen(false);
    setNewTitle(""); setNewCategory(""); setNewDeadline(""); setNewPriority("Média");
    toast.success("Tarefa adicionada!");
  };

  const toggleTask = (id: string) =>
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status: t.status === "Pendente" ? "Concluido" : "Pendente" } : t
    ));

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    toast.success("Tarefa removida.");
  };

  const filtered = useMemo(
    () => tasks.filter(t => {
      const s = searchTerm.toLowerCase();
      const matchesSearch = t.title.toLowerCase().includes(s) || t.category.toLowerCase().includes(s);
      const matchesStatus = filterStatus === "Todos" || t.status === filterStatus;
      const matchesPriority = filterPriority === "Todas" || t.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    }),
    [tasks, searchTerm, filterStatus, filterPriority]
  );

  const pendentes = tasks.filter(t => t.status === "Pendente").length;
  const concluidas = tasks.filter(t => t.status === "Concluido").length;
  const altas = tasks.filter(t => t.priority === "Alta" && t.status === "Pendente").length;
  const taxa = tasks.length > 0 ? Math.round((concluidas / tasks.length) * 100) : 0;

  const categorias = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(t => map.set(t.category, (map.get(t.category) || 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [tasks]);

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/70 mb-1">
            Produtividade
          </p>
          <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
            Tarefas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pendentes} pendente{pendentes !== 1 ? "s" : ""} · {concluidas} concluída{concluidas !== 1 ? "s" : ""} · {taxa}% de conclusão
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
              <Plus size={16} /> Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[440px]">
            <DialogHeader>
              <DialogTitle>Adicionar Tarefa</DialogTitle>
              <DialogDescription>
                Defina prazo, prioridade e categoria para manter o foco.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Descreva a tarefa..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label>Prioridade</Label>
                  <Select value={newPriority} onValueChange={(v) => setNewPriority(v as Priority)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Prazo</Label>
                  <Input id="deadline" type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Ex: Compliance, Comercial, Manutenção..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddTask}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Stats (chunking Miller) ─────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Pendentes",       value: pendentes,   icon: Clock,          accent: "text-amber-500",  bg: "from-amber-500/10 to-amber-500/0" },
          { label: "Concluídas",      value: concluidas,  icon: CheckCircle2,   accent: "text-emerald-500", bg: "from-emerald-500/10 to-emerald-500/0" },
          { label: "Alta prioridade", value: altas,       icon: AlertTriangle,  accent: "text-red-500",    bg: "from-red-500/10 to-red-500/0" },
          { label: "Taxa de conclusão", value: `${taxa}%`, icon: TrendingUp,     accent: "text-primary",    bg: "from-primary/10 to-primary/0" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative section-card p-4 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.bg} opacity-70`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
                <p className="text-2xl font-black text-card-foreground">{s.value}</p>
              </div>
              <s.icon size={22} className={s.accent} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Main (2/3) + Sidebar (1/3) ──────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          {/* Filtros + busca */}
          <div className="section-card p-3 flex flex-col lg:flex-row lg:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
              <input
                type="text"
                placeholder="Buscar tarefas ou categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10 pl-10 pr-3 bg-muted/30 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-background transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(["Todos", "Pendente", "Concluido"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 h-9 rounded text-xs font-bold transition-all ${
                    filterStatus === status
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/30 border border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {status === "Concluido" ? "Concluídas" : status}
                </button>
              ))}

              <span className="mx-1 w-px h-6 bg-border" />

              {(["Todas", "Alta", "Média", "Baixa"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPriority(p)}
                  className={`px-3 h-9 rounded text-xs font-bold transition-all flex items-center gap-1.5 ${
                    filterPriority === p
                      ? "bg-foreground/90 text-background shadow-sm"
                      : "bg-muted/30 border border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {p !== "Todas" && (
                    <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_META[p].dot}`} />
                  )}
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de tarefas */}
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <EmptyState hasTasks={tasks.length > 0} />
            ) : (
              <AnimatePresence>
                {filtered.map((task, i) => {
                  const meta = PRIORITY_META[task.priority];
                  const done = task.status === "Concluido";
                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, height: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`group section-card p-4 flex items-center gap-4 transition-all cursor-pointer ${
                        done
                          ? "opacity-60 hover:opacity-80"
                          : "hover:border-primary/20 hover:shadow-md"
                      }`}
                    >
                      {/* Priority indicator bar */}
                      <div className={`w-1 self-stretch rounded-full ${done ? "bg-muted" : meta.dot} shrink-0`} />

                      {/* Checkbox (Fitts: alvo 32px) */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                          done
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "border-border hover:border-primary hover:bg-primary/5"
                        }`}
                      >
                        {done && <CheckCircle2 size={16} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-sm text-card-foreground truncate transition-all ${done ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
                            {task.category}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${meta.bg} ${meta.text}`}>
                            <Flag size={9} /> {task.priority}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                            <Clock size={10} /> {task.deadline}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {task.priority === "Alta" && !done && (
                          <AlertTriangle size={14} className="text-red-500" />
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
                          title="Remover"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Sidebar: progresso + categorias */}
        <aside className="space-y-4">
          <div className="section-card p-5">
            <h3 className="text-sm font-bold text-card-foreground mb-1">Progresso semanal</h3>
            <p className="text-xs text-muted-foreground mb-4">Evolução da sua produtividade</p>

            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-black text-card-foreground">{taxa}%</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  <TrendingUp size={12} /> em andamento
                </span>
              </div>
              <div className="h-2 bg-muted/60 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${taxa}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground font-semibold mt-2">
                <span>{concluidas} concluídas</span>
                <span>{tasks.length} no total</span>
              </div>
            </div>
          </div>

          <div className="section-card p-5">
            <h3 className="text-sm font-bold text-card-foreground mb-4 flex items-center gap-2">
              <Filter size={14} className="text-primary" /> Por categoria
            </h3>
            {categorias.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Ainda não há categorias.</p>
            ) : (
              <div className="space-y-2.5">
                {categorias.map(([cat, count], i) => {
                  const pct = Math.round((count / tasks.length) * 100);
                  return (
                    <motion.div
                      key={cat}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                        <span className="text-card-foreground">{cat}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-1.5 bg-muted/60 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary/80 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="relative section-card p-5 overflow-hidden bg-gradient-to-br from-primary/5 via-card to-card">
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Foco</span>
              </div>
              <p className="text-xs font-semibold text-card-foreground leading-snug">
                Priorize as {altas} tarefa{altas !== 1 ? "s" : ""} de alta criticidade antes do meio-dia.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

const EmptyState = ({ hasTasks }: { hasTasks: boolean }) => (
  <div className="section-card py-16 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 rounded bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
      <CheckSquare className="text-primary/60" size={28} />
    </div>
    <h3 className="text-base font-bold text-card-foreground">
      {hasTasks ? "Nenhuma tarefa encontrada" : "Sua lista está limpa"}
    </h3>
    <p className="text-xs text-muted-foreground max-w-[260px] mt-2">
      {hasTasks
        ? "Ajuste os filtros ou a busca para ver outros resultados."
        : "Adicione sua primeira tarefa para começar a organizar sua rotina."}
    </p>
  </div>
);

export default Tasks;
