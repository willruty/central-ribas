import { useState, useMemo, useEffect } from "react";
import {
  FileText, MoreVertical, LayoutGrid, List,
  AlertTriangle, CheckCircle2, Clock3,
  Download, Eye, FolderOpen, Sparkles
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { getDocumentos } from "@/services/documentosService";
import { Documento } from "@/services/types";

// ── Status helpers ───────────────────────────────────────────────

type StatusKey = "valido" | "vencendo" | "vencido";

function computeStatus(validade?: string): StatusKey {
  if (!validade) return "valido";
  const today = new Date();
  const expiry = new Date(validade);
  if (expiry < today) return "vencido";
  const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff <= 30 ? "vencendo" : "valido";
}

function daysUntilExpiry(validade?: string): number | undefined {
  if (!validade) return undefined;
  const today = new Date();
  return Math.ceil((new Date(validade).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

const STATUS_META: Record<StatusKey, { label: string; dot: string; ring: string; text: string }> = {
  valido:   { label: "Válido",   dot: "bg-emerald-500", ring: "ring-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400" },
  vencendo: { label: "Vencendo", dot: "bg-amber-500",   ring: "ring-amber-500/20",   text: "text-amber-600 dark:text-amber-400" },
  vencido:  { label: "Vencido",  dot: "bg-red-500",     ring: "ring-red-500/20",     text: "text-red-600 dark:text-red-400" },
};

const TIPO_LABEL: Record<string, string> = {
  contrato: "Contrato", laudo: "Laudo", nota_fiscal: "NF",
  certificado: "Certificado", cnh: "CNH", aso: "ASO", art: "ART", outro: "Documento",
};

const TIPO_COLOR: Record<string, string> = {
  contrato: "bg-emerald-600", laudo: "bg-purple-600", nota_fiscal: "bg-blue-600",
  certificado: "bg-indigo-600", cnh: "bg-blue-500", aso: "bg-teal-600",
  art: "bg-orange-600", outro: "bg-zinc-600",
};

type StatusFilter = "todos" | StatusKey;

// ── Main Component ───────────────────────────────────────────────

const Documents = () => {
  const { token } = useAuth();
  const [docs, setDocs] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!token) return;
    getDocumentos(token).then(({ data, error }) => {
      if (error) toast.error(`Erro ao carregar documentos: ${error}`);
      else if (data) setDocs(data);
    }).finally(() => setIsLoading(false));
  }, [token]);

  const enriched = useMemo(() =>
    docs.map(d => ({ ...d, _status: computeStatus(d.validade), _days: daysUntilExpiry(d.validade) })),
    [docs]
  );

  const counts = useMemo(() => ({
    total: enriched.length,
    valido: enriched.filter(d => d._status === "valido").length,
    vencendo: enriched.filter(d => d._status === "vencendo").length,
    vencido: enriched.filter(d => d._status === "vencido").length,
  }), [enriched]);

  const filtered = useMemo(() => enriched.filter(d => {
    const name = (d.descricao ?? d.nome_arquivo).toLowerCase();
    const matchSearch = name.includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "todos" || d._status === statusFilter;
    return matchSearch && matchStatus;
  }), [enriched, searchTerm, statusFilter]);

  const statusChips: { key: StatusFilter; label: string; count: number; icon: typeof CheckCircle2; accent: string }[] = [
    { key: "todos",    label: "Todos",    count: counts.total,    icon: FolderOpen,   accent: "text-primary" },
    { key: "valido",   label: "Válidos",  count: counts.valido,   icon: CheckCircle2, accent: "text-emerald-500" },
    { key: "vencendo", label: "Vencendo", count: counts.vencendo, icon: Clock3,       accent: "text-amber-500" },
    { key: "vencido",  label: "Vencidos", count: counts.vencido,  icon: AlertTriangle,accent: "text-red-500" },
  ];

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/70 mb-1">
            Compliance · Repositório
          </p>
          <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
            Gestão de Documentos
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading
              ? "Carregando..."
              : `${counts.total} documentos · ${counts.vencendo + counts.vencido} requerem atenção`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-muted/30 p-1 rounded border border-border">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded transition-all ${viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              title="Grade"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded transition-all ${viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              title="Lista"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Status chips ────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statusChips.map((chip, i) => {
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
                  layoutId="docs-chip-active"
                  className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary to-primary/60"
                />
              )}
              <div className="flex items-center justify-between mb-2">
                <chip.icon size={16} className={`${chip.accent} opacity-80`} />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {chip.label}
                </span>
              </div>
              <p className="text-3xl font-black text-card-foreground tracking-tight">
                {isLoading ? "…" : chip.count}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* ── Main grid / list + sidebar ───────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        <div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="section-card p-5 animate-pulse h-44" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {filtered.map((doc, i) => (
                <DocumentCard key={doc.id} doc={doc} index={i} />
              ))}
            </div>
          ) : (
            <DocumentList docs={filtered} />
          )}
        </div>

        {/* Sidebar — dica de alerta */}
        <aside className="space-y-4">
          <div className="relative section-card p-5 overflow-hidden bg-gradient-to-br from-primary/5 via-card to-card">
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Alertas automáticos
                </span>
              </div>
              <p className="text-sm font-semibold text-card-foreground leading-snug mb-3">
                O sistema envia alertas por e-mail 30, 15 e 3 dias antes do vencimento de cada documento.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info("Configuração de alertas disponível após implantação.")}
                className="w-full gap-1.5 text-xs"
              >
                Configurar alertas
              </Button>
            </div>
          </div>

          {counts.vencido > 0 && (
            <div className="section-card p-5 border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={14} className="text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
                  Ação necessária
                </span>
              </div>
              <p className="text-sm text-card-foreground leading-snug">
                <span className="font-bold text-red-500">{counts.vencido}</span>{" "}
                {counts.vencido === 1 ? "documento vencido" : "documentos vencidos"} — renovação pendente.
              </p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
};

// ── Sub-components ───────────────────────────────────────────────

type EnrichedDoc = Documento & { _status: StatusKey; _days: number | undefined };

const DocumentCard = ({ doc, index }: { doc: EnrichedDoc; index: number }) => {
  const meta = STATUS_META[doc._status];
  const name = doc.descricao ?? doc.nome_arquivo;
  const color = TIPO_COLOR[doc.tipo] ?? "bg-zinc-600";
  const tipoLabel = TIPO_LABEL[doc.tipo] ?? doc.tipo;

  const daysLabel =
    doc._days === undefined ? "—" :
    doc._days < 0 ? `Vencido há ${Math.abs(doc._days)}d` :
    doc._days <= 30 ? `${doc._days} dias` :
    `${Math.round(doc._days / 30)} meses`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group section-card p-5 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded ${color} flex items-center justify-center shadow-md shadow-black/10`}>
          <FileText size={20} className="text-white" />
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-card border ring-1 ${meta.ring} ${meta.text} text-[10px] font-bold`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:bg-muted transition-all"
              >
                <MoreVertical size={15} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem><Eye size={13} className="mr-2" /> Visualizar</DropdownMenuItem>
              <DropdownMenuItem><Download size={13} className="mr-2" /> Baixar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <h4 className="font-bold text-sm text-card-foreground line-clamp-2 leading-snug mb-1 group-hover:text-primary transition-colors">
        {name}
      </h4>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <span className="text-[10px] font-bold uppercase tracking-widest bg-muted/60 text-muted-foreground px-2 py-0.5 rounded">
          {tipoLabel}
        </span>
        <span className={`text-[11px] font-bold ${meta.text}`}>{daysLabel}</span>
      </div>
    </motion.div>
  );
};

const DocumentList = ({ docs }: { docs: EnrichedDoc[] }) => (
  <div className="section-card p-0 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/30">
          <tr className="text-xs text-muted-foreground/80 uppercase tracking-wider">
            <th className="text-left py-4 px-6 font-semibold border-b border-border/40">Documento</th>
            <th className="text-left py-4 px-6 font-semibold border-b border-border/40">Tipo</th>
            <th className="text-left py-4 px-6 font-semibold border-b border-border/40">Status</th>
            <th className="text-left py-4 px-6 font-semibold border-b border-border/40">Validade</th>
            <th className="text-right py-4 px-6 font-semibold border-b border-border/40"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {docs.map((d, i) => {
            const meta = STATUS_META[d._status];
            const name = d.descricao ?? d.nome_arquivo;
            const color = TIPO_COLOR[d.tipo] ?? "bg-zinc-600";
            const daysLabel =
              d._days === undefined ? "—" :
              d._days < 0 ? `Vencido há ${Math.abs(d._days)}d` :
              `${d._days}d restantes`;

            return (
              <motion.tr
                key={d.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-muted/20 transition-colors cursor-pointer group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded ${color} flex items-center justify-center shadow-sm`}>
                      <FileText size={15} className="text-white" />
                    </div>
                    <p className="font-bold text-card-foreground">{name}</p>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-muted/60 text-muted-foreground px-2 py-1 rounded">
                    {TIPO_LABEL[d.tipo] ?? d.tipo}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-card border ring-1 ${meta.ring} ${meta.text} text-[10px] font-bold`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </td>
                <td className={`py-4 px-6 text-xs font-bold ${meta.text}`}>{daysLabel}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Download size={14} /></Button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="section-card min-h-[400px] flex flex-col items-center justify-center text-center py-16">
    <div className="w-20 h-20 bg-primary/5 border border-primary/10 rounded flex items-center justify-center mb-6">
      <FileText className="text-primary/60" size={36} />
    </div>
    <h3 className="text-lg font-bold text-card-foreground">Nenhum documento encontrado</h3>
    <p className="text-sm text-muted-foreground max-w-sm mt-2">
      Tente ajustar os filtros de busca.
    </p>
  </div>
);

export default Documents;
