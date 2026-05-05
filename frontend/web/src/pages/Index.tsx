import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle, ShieldCheck, Truck, Clock,
  FileText, ChevronRight, CircleDot, ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getDocumentosVencidos, getDocumentosProximoVencimento, getDocumentos } from "@/services/documentosService";
import { getEquipamentos } from "@/services/equipamentosService";
import { Documento, Equipamento } from "@/services/types";

// ── Helpers ──────────────────────────────────────────────────────

const TIPO_LABEL: Record<string, string> = {
  contrato: "Contrato", laudo: "Laudo", nota_fiscal: "NF",
  certificado: "Certificado", cnh: "CNH", aso: "ASO", art: "ART", outro: "Documento",
};

function daysUntilExpiry(validade?: string): number | undefined {
  if (!validade) return undefined;
  return Math.ceil((new Date(validade).getTime() - Date.now()) / 86400000);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── KPI Card ─────────────────────────────────────────────────────

const KpiCard = ({
  label, value, sub, icon: Icon, variant,
}: {
  label: string; value: number; sub: string;
  icon: typeof FileText; variant: "red" | "amber" | "blue" | "emerald" | "dark";
}) => {
  const styles = {
    dark:    { wrap: "bg-gradient-to-br from-slate-900 via-slate-800 to-[hsl(222,47%,18%)] text-white shadow-lg shadow-black/20", icon: "bg-white/10", iconText: "text-white/80", label: "text-white/60", val: "text-white", sub: "text-white/50" },
    red:     { wrap: "bg-card border border-border/50 hover:border-red-500/20 hover:shadow-md",     icon: "bg-red-500/10",     iconText: "text-red-500",     label: "text-muted-foreground", val: "text-card-foreground", sub: "text-muted-foreground" },
    amber:   { wrap: "bg-card border border-border/50 hover:border-amber-500/20 hover:shadow-md",   icon: "bg-amber-500/10",   iconText: "text-amber-500",   label: "text-muted-foreground", val: "text-card-foreground", sub: "text-muted-foreground" },
    blue:    { wrap: "bg-card border border-border/50 hover:border-blue-500/20 hover:shadow-md",    icon: "bg-blue-500/10",    iconText: "text-blue-500",    label: "text-muted-foreground", val: "text-card-foreground", sub: "text-muted-foreground" },
    emerald: { wrap: "bg-card border border-border/50 hover:border-emerald-500/20 hover:shadow-md", icon: "bg-emerald-500/10", iconText: "text-emerald-500", label: "text-muted-foreground", val: "text-card-foreground", sub: "text-muted-foreground" },
  };
  const s = styles[variant];

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}
      className={`relative rounded p-5 overflow-hidden cursor-pointer transition-all ${s.wrap}`}
    >
      <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-white/5" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[10px] font-black uppercase tracking-widest ${s.label}`}>{label}</span>
          <div className={`w-8 h-8 rounded flex items-center justify-center ${s.icon}`}>
            <Icon size={14} className={s.iconText} />
          </div>
        </div>
        <p className={`text-[28px] font-black leading-none mb-1.5 ${s.val}`}>{value}</p>
        <p className={`text-[11px] ${s.sub}`}>{sub}</p>
      </div>
    </motion.div>
  );
};

// ── Alert Row ────────────────────────────────────────────────────

const AlertRow = ({ doc, index }: { doc: Documento; index: number }) => {
  const days = daysUntilExpiry(doc.validade);
  const isVencido = days !== undefined && days < 0;
  const name = doc.descricao ?? doc.nome_arquivo;
  const tipoLabel = TIPO_LABEL[doc.tipo] ?? doc.tipo;

  const daysLabel =
    days === undefined ? "—" :
    days < 0 ? `Vencido há ${Math.abs(days)}d` :
    `Vence em ${days}d`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex items-center gap-3 p-3 rounded hover:bg-white/5 transition-colors cursor-pointer border border-white/5"
    >
      <span className={`w-6 h-6 rounded flex items-center justify-center text-[11px] font-black shrink-0 ${
        isVencido ? "bg-white text-red-600" : "bg-white/15 text-white"
      }`}>
        {index + 1}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold truncate text-white">{name}</p>
        <p className="text-[11px] text-white/60 truncate uppercase tracking-wider">{tipoLabel}</p>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${
        isVencido ? "text-red-200" : "text-amber-200"
      }`}>
        {daysLabel}
      </span>
    </motion.div>
  );
};

// ── Page ─────────────────────────────────────────────────────────

const Index = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [vencidos, setVencidos] = useState<Documento[]>([]);
  const [vencendo, setVencendo] = useState<Documento[]>([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      getDocumentosVencidos(token),
      getDocumentosProximoVencimento(30, token),
      getDocumentos(token),
      getEquipamentos(token),
    ]).then(([venc, prox, todos, equip]) => {
      setVencidos(venc.data ?? []);
      setVencendo(prox.data ?? []);
      setTotalDocs(todos.data?.length ?? 0);
      setEquipamentos(equip.data ?? []);
    }).finally(() => setIsLoading(false));
  }, [token]);

  const equipAtivos = equipamentos.filter(e => e.ativo).length;
  const docsOk = Math.max(0, totalDocs - vencidos.length - vencendo.length);
  const urgentes = [...vencidos, ...vencendo];

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long",
  });
  const greeting = user?.email?.split("@")[0] ?? "Admin";

  return (
    <div className="space-y-8">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded bg-gradient-to-br from-slate-900 via-[hsl(222,47%,13%)] to-[hsl(222,47%,20%)] p-8 text-white shadow-xl shadow-black/10">
        <img
          src="/assets/sidebar-bg.png"
          alt=""
          aria-hidden
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-right scale-110 blur-[3px] opacity-30 select-none pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[hsl(222,47%,10%)]/60 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl" />

        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div className="flex-1 min-w-[260px]">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/90 mb-3">
              <CircleDot size={10} className="animate-pulse" /> {capitalize(today)}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
              Bom dia, {capitalize(greeting)}.
            </h1>
            <p className="mt-2 text-white/70 text-[15px] max-w-xl">
              {isLoading
                ? "Carregando situação operacional..."
                : urgentes.length > 0
                  ? `${urgentes.length} ${urgentes.length === 1 ? "documento requer" : "documentos requerem"} atenção — ${vencidos.length} vencido${vencidos.length !== 1 ? "s" : ""}, ${vencendo.length} vencendo em 30 dias.`
                  : "Todos os documentos estão em dia — operação sem pendências."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigate("/documents")}
                className="h-11 px-5 inline-flex items-center gap-2 rounded bg-white text-slate-900 font-bold text-[13px] shadow-lg shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <FileText size={15} /> Ver documentos
              </button>
              <button
                onClick={() => navigate("/equipments")}
                className="h-11 px-5 inline-flex items-center gap-2 rounded bg-white/10 border border-white/15 text-white font-bold text-[13px] hover:bg-white/15 transition-all"
              >
                <Truck size={15} /> Ver equipamentos
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            {[
              { label: "Alertas críticos", value: isLoading ? "…" : urgentes.length, icon: AlertTriangle },
              { label: "Equipamentos", value: isLoading ? "…" : equipAtivos, icon: Truck },
            ].map((it) => (
              <div key={it.label} className="min-w-[140px] rounded bg-white/5 border border-white/10 backdrop-blur-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{it.label}</span>
                  <it.icon size={12} className="text-white/50" />
                </div>
                <p className="text-3xl font-black leading-none">{it.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPIs ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Vencidos",        value: vencidos.length,  sub: "renovação urgente",     icon: AlertTriangle, variant: "red"     as const },
          { label: "Atenção (30d)",   value: vencendo.length,  sub: "vencendo em 30 dias",   icon: Clock,         variant: "amber"   as const },
          { label: "Equipamentos",    value: equipAtivos,      sub: "ativos na frota",        icon: Truck,         variant: "blue"    as const },
          { label: "Documentos OK",   value: docsOk,           sub: "dentro da validade",     icon: ShieldCheck,   variant: "emerald" as const },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <KpiCard
              label={kpi.label}
              value={isLoading ? 0 : kpi.value}
              sub={kpi.sub}
              icon={kpi.icon}
              variant={kpi.variant}
            />
          </motion.div>
        ))}
      </div>

      {/* ── Alertas de documentos ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Lista urgente (3/5) */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <AlertTriangle size={12} /> Documentos que requerem atenção
            </h2>
            <button
              onClick={() => navigate("/documents")}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
            >
              Ver todos <ChevronRight size={11} />
            </button>
          </div>

          {isLoading ? (
            <div className="section-card p-5 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted/40 rounded animate-pulse" />
              ))}
            </div>
          ) : urgentes.length === 0 ? (
            <div className="section-card p-8 flex flex-col items-center justify-center text-center">
              <ShieldCheck size={32} className="text-emerald-500 mb-3" />
              <p className="font-bold text-card-foreground">Nenhum alerta</p>
              <p className="text-sm text-muted-foreground mt-1">Todos os documentos estão dentro da validade.</p>
            </div>
          ) : (
            <div className="relative rounded overflow-hidden p-5 bg-gradient-to-br from-[hsl(0,60%,32%)] via-[hsl(0,55%,26%)] to-[hsl(0,50%,20%)] text-white shadow-lg shadow-red-900/20">
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
              <div className="relative space-y-2">
                {urgentes.slice(0, 6).map((doc, i) => (
                  <AlertRow key={doc.id} doc={doc} index={i} />
                ))}
              </div>
              <button
                onClick={() => navigate("/documents")}
                className="relative w-full mt-4 h-10 rounded border border-white/20 bg-white/5 text-[11px] font-black uppercase tracking-widest hover:bg-white/15 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={13} /> Revisar compliance
              </button>
            </div>
          )}
        </div>

        {/* Equipamentos (2/5) */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Truck size={12} /> Frota
            </h2>
            <button
              onClick={() => navigate("/equipments")}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
            >
              Ver todos <ChevronRight size={11} />
            </button>
          </div>
          <div className="section-card p-4 space-y-2">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted/40 rounded animate-pulse" />
              ))
            ) : equipamentos.slice(0, 5).map((e, i) => {
              const statusLabel: Record<string, string> = {
                disponivel: "Disponível", locado: "Locado",
                em_manutencao: "Manutenção", inativo: "Inativo",
              };
              const statusColor: Record<string, string> = {
                disponivel: "text-emerald-500", locado: "text-blue-500",
                em_manutencao: "text-amber-500", inativo: "text-zinc-400",
              };
              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate("/equipments")}
                  className="flex items-center gap-3 p-3 rounded hover:bg-muted/40 cursor-pointer transition-colors group"
                >
                  <div className="w-9 h-9 shrink-0 rounded bg-primary/10 border border-primary/10 flex items-center justify-center">
                    <Truck size={14} className="text-primary/70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-card-foreground truncate">{e.nome}</p>
                    {e.modelo && <p className="text-[10px] text-muted-foreground truncate">{e.fabricante} · {e.modelo}</p>}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusColor[e.status]}`}>
                    {statusLabel[e.status]}
                  </span>
                  <ArrowUpRight size={13} className="text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
