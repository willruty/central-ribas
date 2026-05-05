import { useState, useMemo } from "react";
import {
  Plus, Calendar as CalendarIcon, Clock, Users, Video, MapPin,
  Search, Filter, ChevronRight, Sparkles, ArrowUpRight, Phone
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
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
import { mockMeetings, MockMeeting } from "@/lib/mockData";

const Meetings = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [meetings, setMeetings] = useState<MockMeeting[]>(mockMeetings);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] = useState<"Presencial" | "Online">("Online");

  const handleAddMeeting = () => {
    if (!newTitle || !newCompany || !newTime || !date) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    const newMeeting: MockMeeting = {
      id: crypto.randomUUID(),
      title: newTitle,
      company: newCompany,
      time: newTime,
      date: date.toISOString(),
      type: newType,
      participants: 1,
    };
    setMeetings([newMeeting, ...meetings]);
    setIsDialogOpen(false);
    setNewTitle(""); setNewCompany(""); setNewTime("");
    toast.success("Reunião agendada com sucesso!");
  };

  const isSameDay = (a: string, b?: Date) =>
    !!b && new Date(a).toDateString() === b.toDateString();

  const dayMeetings = useMemo(
    () => meetings
      .filter(m => isSameDay(m.date, date))
      .filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.company.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.time.localeCompare(b.time)),
    [meetings, date, searchTerm]
  );

  const upcoming = useMemo(
    () => meetings
      .filter(m => new Date(m.date).getTime() > Date.now())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3),
    [meetings]
  );

  const datesWithEvents = useMemo(
    () => new Set(meetings.map(m => new Date(m.date).toDateString())),
    [meetings]
  );

  const stats = useMemo(() => ({
    hoje: meetings.filter(m => isSameDay(m.date, new Date())).length,
    semana: meetings.filter(m => {
      const d = new Date(m.date).getTime();
      const now = Date.now();
      return d >= now && d <= now + 7 * 86400000;
    }).length,
    online: meetings.filter(m => m.type === "Online").length,
  }), [meetings]);

  const formattedDate = date?.toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long"
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/70 mb-1">
            Agenda Comercial
          </p>
          <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
            Reuniões
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {stats.hoje} hoje · {stats.semana} nos próximos 7 dias
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              type="text"
              placeholder="Buscar reunião..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-56 h-10 pl-9 pr-3 bg-muted/30 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-background transition-colors"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 rounded shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                <Plus size={16} /> Agendar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px]">
              <DialogHeader>
                <DialogTitle>Nova Reunião</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes abaixo para agendar.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título</Label>
                  <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ex: Alinhamento de contrato" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Cliente / Empresa</Label>
                  <Input id="company" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} placeholder="Ex: MRV Engenharia" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="time">Horário</Label>
                    <Input id="time" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Modalidade</Label>
                    <Select value={newType} onValueChange={(v) => setNewType(v as "Online" | "Presencial")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Presencial">Presencial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddMeeting}>Agendar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Layout 2/3 timeline + 1/3 sidebar (regra dos terços) ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-5">
          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Hoje",          value: stats.hoje,    icon: CalendarIcon, accent: "from-blue-500/10 to-blue-500/0 text-blue-500" },
              { label: "Próximos 7d",   value: stats.semana,  icon: Clock,        accent: "from-emerald-500/10 to-emerald-500/0 text-emerald-500" },
              { label: "Online",        value: stats.online,  icon: Video,        accent: "from-purple-500/10 to-purple-500/0 text-purple-500" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative section-card p-4 overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.accent.split(" ").slice(0, 2).join(" ")} opacity-60`} />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{s.label}</p>
                    <p className="text-2xl font-black text-card-foreground">{s.value}</p>
                  </div>
                  <s.icon size={22} className={s.accent.split(" ").pop()} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Timeline principal */}
          <div className="section-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-card-foreground capitalize">
                  {formattedDate}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {dayMeetings.length} compromisso{dayMeetings.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Filtros em desenvolvimento.")}>
                <Filter size={12} /> Filtrar
              </Button>
            </div>

            {dayMeetings.length === 0 ? (
              <EmptyDay />
            ) : (
              <div className="relative pl-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/40 via-primary/10 to-transparent" />
                <AnimatePresence>
                  {dayMeetings.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="relative pb-5 last:pb-0 group"
                    >
                      <span className="absolute -left-[22px] top-3 w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all" />
                      <div className="flex items-center gap-4 p-4 rounded border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                        <div className="w-14 h-14 shrink-0 rounded bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex flex-col items-center justify-center text-primary">
                          <span className="text-sm font-black leading-none">{m.time.split(":")[0]}</span>
                          <span className="text-[10px] font-bold tracking-widest text-primary/70">{m.time.split(":")[1] || "00"}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-card-foreground truncate group-hover:text-primary transition-colors">
                            {m.title}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">{m.company}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] font-semibold">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md ${
                              m.type === "Online"
                                ? "bg-purple-500/10 text-purple-500 dark:text-purple-400"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            }`}>
                              {m.type === "Online" ? <Video size={10} /> : <MapPin size={10} />}
                              {m.type}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Users size={10} /> {m.participants}
                            </span>
                            {m.location && (
                              <span className="text-muted-foreground truncate">· {m.location}</span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 gap-1 transition-opacity"
                        >
                          {m.type === "Online" ? "Entrar" : "Detalhes"} <ArrowUpRight size={13} />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar: calendar + próximos ── */}
        <aside className="space-y-4">
          <div className="section-card p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              modifiers={{
                hasEvent: (d) => datesWithEvents.has(d.toDateString()),
              }}
              modifiersClassNames={{
                hasEvent: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary",
              }}
              className="rounded-md flex items-center justify-center"
            />
          </div>

          <div className="section-card p-5">
            <h3 className="text-sm font-bold text-card-foreground mb-4 flex items-center gap-2">
              <Clock size={14} className="text-primary" /> Próximas reuniões
            </h3>
            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhuma reunião futura.</p>
              ) : upcoming.map((m, i) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                  onClick={() => setDate(new Date(m.date))}
                  className="w-full group text-left flex items-start gap-3 p-2 -mx-2 rounded hover:bg-muted/40 transition-colors"
                >
                  <div className="w-10 h-10 shrink-0 rounded bg-primary/10 flex flex-col items-center justify-center text-primary">
                    <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
                      {new Date(m.date).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}
                    </span>
                    <span className="text-sm font-black leading-none mt-0.5">
                      {new Date(m.date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-card-foreground truncate group-hover:text-primary transition-colors">
                      {m.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {m.time} · {m.company}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-2" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="relative section-card p-5 overflow-hidden bg-gradient-to-br from-primary/5 via-card to-card">
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={13} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Dica
                </span>
              </div>
              <p className="text-xs font-semibold text-card-foreground leading-snug">
                Envie confirmação automática 24h antes — reduz cancelamentos em 37%.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};

const EmptyDay = () => (
  <div className="py-16 flex flex-col items-center justify-center text-center">
    <div className="w-16 h-16 rounded bg-muted/40 border border-border flex items-center justify-center mb-4">
      <CalendarIcon className="text-muted-foreground/60" size={24} />
    </div>
    <h3 className="text-base font-bold text-card-foreground">Dia livre</h3>
    <p className="text-xs text-muted-foreground max-w-[240px] mt-1">
      Sem reuniões nesta data. Use o tempo para avançar em propostas ou aprove horário para novos clientes.
    </p>
  </div>
);

export default Meetings;
