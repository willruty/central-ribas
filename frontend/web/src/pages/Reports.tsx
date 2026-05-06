import { useState, useEffect, useLayoutEffect } from "react";
import {
  BarChart3, Users, FileText, Download,
  PieChart as PieChartIcon, Printer, AlertTriangle,
  CheckCircle2, Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import * as XLSX from "xlsx";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { getResumo } from "@/services/relatoriosService";
import { ResumoRelatorio } from "@/services/types";

const TIPO_LABELS: Record<string, string> = {
  cnh: "CNH",
  aso: "ASO",
  certificado: "Cert.",
  contrato: "Contrato",
  laudo: "Laudo",
  nota_fiscal: "NF",
  art: "ART",
  outro: "Outro",
};

const STATUS_LABELS: Record<string, string> = {
  disponivel: "Disponível",
  locado: "Locado",
  em_manutencao: "Manutenção",
  inativo: "Inativo",
};

const STATUS_COLORS: Record<string, string> = {
  disponivel: "#10b981",
  locado: "#3b82f6",
  em_manutencao: "#f59e0b",
  inativo: "#94a3b8",
};

// ── Loading skeleton ─────────────────────────────────────────────
function KpiSkeleton() {
  return (
    <div className="section-card p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-2.5 w-24 rounded bg-muted" />
      </div>
      <div className="h-8 w-16 rounded bg-muted mb-2" />
      <div className="h-2 w-32 rounded bg-muted/60" />
    </div>
  );
}

function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <div className="animate-pulse" style={{ height }}>
      <div className="h-full rounded bg-muted/40" />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
const Reports = () => {
  const { token } = useAuth();
  const [resumo, setResumo] = useState<ResumoRelatorio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getResumo(token)
      .then(({ data, error }) => {
        if (error) toast.error(`Erro ao carregar relatório: ${error}`);
        else if (data) setResumo(data);
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  // ── Export Excel ─────────────────────────────────────────────
  const handleExportExcel = () => {
    if (!resumo) return;
    const wb = XLSX.utils.book_new();

    const kpiSheet = XLSX.utils.json_to_sheet([
      { KPI: "Equipamentos ativos",    Valor: resumo.equipamentosAtivos },
      { KPI: "Documentos vencidos",    Valor: resumo.documentosVencidos },
      { KPI: "Vencendo em 30 dias",    Valor: resumo.documentosVencendo30d },
      { KPI: "Funcionários ativos",    Valor: resumo.funcionariosAtivos },
    ]);
    XLSX.utils.book_append_sheet(wb, kpiSheet, "KPIs");

    const tipoSheet = XLSX.utils.json_to_sheet(
      resumo.documentosPorTipo.map((r) => ({
        Tipo: TIPO_LABELS[r.tipo] ?? r.tipo,
        Total: r.total,
      }))
    );
    XLSX.utils.book_append_sheet(wb, tipoSheet, "Documentos por Tipo");

    const frotaSheet = XLSX.utils.json_to_sheet(
      resumo.frotaPorStatus.map((r) => ({
        Status: STATUS_LABELS[r.status] ?? r.status,
        Total: r.total,
      }))
    );
    XLSX.utils.book_append_sheet(wb, frotaSheet, "Frota por Status");

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `relatorio-ribas-${today}.xlsx`);
    toast.success("Relatório exportado!");
  };

  // ── GSAP ScrollTrigger ───────────────────────────────────────
  useLayoutEffect(() => {
    if (isLoading) return;
    const scroller = "#dashboard-main";
    const ctx = gsap.context(() => {
      gsap.from(".reports-kpi", {
        opacity: 0,
        y: 18,
        stagger: 0.07,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".reports-kpi-grid",
          scroller,
          start: "top 88%",
          once: true,
        },
      });

      gsap.from(".reports-chart-section", {
        opacity: 0,
        y: 14,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".reports-charts-row",
          scroller,
          start: "top 85%",
          once: true,
        },
      });

      gsap.from(".performance-op", {
        opacity: 0,
        y: 8,
        scale: 0.97,
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".performance-ops",
          scroller,
          start: "top 87%",
          once: true,
        },
      });

      gsap.from(".compliance-alert", {
        opacity: 0,
        x: -10,
        stagger: 0.08,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".compliance-alerts",
          scroller,
          start: "top 87%",
          once: true,
        },
      });
    });
    return () => ctx.revert();
  }, [isLoading]);

  // ── Donut helpers ────────────────────────────────────────────
  const frotaFiltered = resumo
    ? resumo.frotaPorStatus.filter((s) => s.total > 0)
    : [];
  const frotaTotal = frotaFiltered.reduce((acc, s) => acc + s.total, 0);
  const CIRC = 2 * Math.PI * 40;

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-4 flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/70 mb-1">
            Business Intelligence · {new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
          </p>
          <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
            Relatórios &amp; Métricas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Dados operacionais em tempo real
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="gap-2 rounded"
          >
            <Printer size={14} /> Imprimir
          </Button>
          <Button
            onClick={handleExportExcel}
            disabled={isLoading || !resumo}
            className="gap-2 rounded shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            <Download size={14} /> Exportar
          </Button>
        </div>
      </div>

      {/* ── KPI cards ───────────────────────────────────────── */}
      <div className="reports-kpi-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : resumo ? (
          [
            {
              label: "Equipamentos ativos",
              value: resumo.equipamentosAtivos,
              sub: `${resumo.equipamentosDisponiveis} disponíveis`,
              glow: "bg-emerald-500/10",
            },
            {
              label: "Documentos vencidos",
              value: resumo.documentosVencidos,
              sub: "renovação urgente",
              glow: resumo.documentosVencidos > 0 ? "bg-red-500/10" : "bg-emerald-500/10",
            },
            {
              label: "Vencendo em 30d",
              value: resumo.documentosVencendo30d,
              sub: "requerem atenção",
              glow: resumo.documentosVencendo30d > 0 ? "bg-amber-500/10" : "bg-emerald-500/10",
            },
            {
              label: "Equipe ativa",
              value: resumo.funcionariosAtivos,
              sub: "colaboradores",
              glow: "bg-blue-500/10",
            },
          ].map((kpi) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="reports-kpi relative section-card p-5 overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl ${kpi.glow}`} />
              <div className="relative">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-3">
                  {kpi.label}
                </span>
                <p className="text-2xl md:text-3xl font-black text-card-foreground tracking-tight leading-none">
                  {kpi.value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-1.5">{kpi.sub}</p>
              </div>
            </motion.div>
          ))
        ) : null}
      </div>

      {/* ── Charts row ──────────────────────────────────────── */}
      <div className="reports-charts-row grid grid-cols-1 xl:grid-cols-[1.618fr_1fr] gap-6 mb-6">

        {/* Bar chart — Documentos por tipo */}
        <div className="reports-chart-section section-card p-6">
          <div className="mb-5">
            <h3 className="text-base font-bold text-card-foreground flex items-center gap-2">
              <BarChart3 size={16} className="text-primary" />
              Documentos por tipo
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Distribuição por categoria</p>
          </div>

          {isLoading ? (
            <ChartSkeleton height={220} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={(resumo?.documentosPorTipo ?? []).map((d) => ({
                  ...d,
                  label: TIPO_LABELS[d.tipo] ?? d.tipo,
                }))}
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => String(v)}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  width={32}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value) => [value, "Documentos"]}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                />
                <Bar dataKey="total" radius={[6, 6, 0, 0] as any}>
                  {(resumo?.documentosPorTipo ?? []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill="hsl(var(--primary))" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut — Frota por status */}
        <div className="reports-chart-section section-card p-6">
          <h3 className="text-base font-bold text-card-foreground flex items-center gap-2 mb-5">
            <PieChartIcon size={16} className="text-primary" /> Frota por status
          </h3>

          {isLoading ? (
            <div className="flex items-center gap-6">
              <div className="w-[140px] h-[140px] rounded-full bg-muted/40 animate-pulse shrink-0" />
              <div className="flex-1 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-3 rounded bg-muted/40 animate-pulse" />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="relative w-[140px] h-[140px] shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {(() => {
                    let offset = 0;
                    return frotaFiltered.map((seg, i) => {
                      const pct = seg.total / (frotaTotal || 1);
                      const len = pct * CIRC;
                      const color = STATUS_COLORS[seg.status] ?? "#94a3b8";
                      const el = (
                        <motion.circle
                          key={seg.status}
                          cx="50" cy="50" r="40"
                          fill="none"
                          strokeWidth="14"
                          stroke={color}
                          strokeDasharray={`${len} ${CIRC}`}
                          strokeDashoffset={-offset}
                          strokeLinecap="round"
                          initial={{ strokeDasharray: `0 ${CIRC}` }}
                          animate={{ strokeDasharray: `${len} ${CIRC}` }}
                          transition={{ delay: 0.35 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                      );
                      offset += len;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-card-foreground leading-none">
                    {resumo?.equipamentosAtivos ?? 0}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                    Ativos
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-2.5 min-w-0">
                {frotaFiltered.map((seg) => {
                  const pct = Math.round((seg.total / (frotaTotal || 1)) * 100);
                  const color = STATUS_COLORS[seg.status] ?? "#94a3b8";
                  return (
                    <div key={seg.status} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ background: color }}
                        />
                        <span className="text-xs font-semibold text-card-foreground truncate">
                          {STATUS_LABELS[seg.status] ?? seg.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="font-bold text-card-foreground tabular-nums">{seg.total}</span>
                        <span className="text-muted-foreground tabular-nums w-8 text-right">{pct}%</span>
                      </div>
                    </div>
                  );
                })}
                {frotaFiltered.length === 0 && (
                  <p className="text-xs text-muted-foreground">Nenhum equipamento cadastrado.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom section ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Resumo operacional */}
        <div className="section-card p-6">
          <h3 className="text-base font-bold text-card-foreground flex items-center gap-2 mb-5">
            <Users size={16} className="text-primary" /> Resumo operacional
          </h3>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-3 rounded bg-muted/30 border border-border/40 animate-pulse">
                  <div className="h-6 w-10 rounded bg-muted mb-2" />
                  <div className="h-2 w-24 rounded bg-muted/60" />
                </div>
              ))}
            </div>
          ) : resumo ? (
            <div className="performance-ops grid grid-cols-2 gap-4">
              {[
                { label: "Equipamentos ativos",  value: resumo.equipamentosAtivos,    sub: "na frota" },
                { label: "Disponíveis agora",    value: resumo.equipamentosDisponiveis, sub: "prontos para locação" },
                { label: "Documentos totais",    value: resumo.documentosTotal,        sub: "cadastrados" },
                { label: "Em compliance",        value: resumo.documentosOk,           sub: "dentro da validade" },
                { label: "Funcionários",         value: resumo.funcionariosAtivos,     sub: "ativos" },
                { label: "Clientes",             value: resumo.clientesAtivos,         sub: "ativos" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="performance-op p-3 rounded bg-muted/30 border border-border/40"
                >
                  <p className="text-lg font-black text-card-foreground tabular-nums">{item.value}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{item.sub}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Compliance alerts */}
        <div className="section-card p-6">
          <h3 className="text-base font-bold text-card-foreground flex items-center gap-2 mb-5">
            <FileText size={16} className="text-primary" /> Status de compliance
          </h3>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : resumo ? (
            <div className="compliance-alerts space-y-3">
              <div className="compliance-alert flex items-center justify-between p-3 rounded border border-red-500/20 bg-red-500/5">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle size={15} className="text-red-500 shrink-0" />
                  <span className="text-sm font-semibold text-card-foreground">Documentos vencidos</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                  resumo.documentosVencidos > 0
                    ? "bg-red-500/15 text-red-600 dark:text-red-400"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                }`}>
                  {resumo.documentosVencidos}
                </span>
              </div>

              <div className="compliance-alert flex items-center justify-between p-3 rounded border border-amber-500/20 bg-amber-500/5">
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-amber-500 shrink-0" />
                  <span className="text-sm font-semibold text-card-foreground">Vencendo em 30 dias</span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                  resumo.documentosVencendo30d > 0
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                }`}>
                  {resumo.documentosVencendo30d}
                </span>
              </div>

              <div className="compliance-alert flex items-center justify-between p-3 rounded border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <span className="text-sm font-semibold text-card-foreground">Em dia</span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  {resumo.documentosOk}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Reports;
