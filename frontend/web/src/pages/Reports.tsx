import { useMemo, useState, useLayoutEffect } from "react";
import {
  BarChart3, TrendingUp, TrendingDown, Users, FileText, Calendar, Download,
  PieChart as PieChartIcon, Printer, ArrowUpRight, SlidersHorizontal, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import * as XLSX from "xlsx";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Cell
} from "recharts";
import {
  mockKpis, mockRevenueByMonth, mockPortfolioStatus
} from "@/lib/mockData";

const PERIODS = ["7d", "30d", "90d", "Ano"] as const;
type Period = typeof PERIODS[number];

type TrendFilter = "all" | "up" | "down";
type ChartType = "Barras" | "Área";

const Reports = () => {
  const [period, setPeriod] = useState<Period>("7d");

  // ── Filter panel state ───────────────────────────────────────────
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("all");
  const [chartType, setChartType] = useState<ChartType>("Barras");
  const [currentMonthOnly, setCurrentMonthOnly] = useState(false);

  // ── Derived / filtered data ──────────────────────────────────────
  const filteredKpis = useMemo(() => {
    if (trendFilter === "up") return mockKpis.filter(k => k.trend >= 0);
    if (trendFilter === "down") return mockKpis.filter(k => k.trend < 0);
    return mockKpis;
  }, [trendFilter]);

  const filteredRevenue = useMemo(() => {
    if (!currentMonthOnly) return mockRevenueByMonth;
    // "Abr" is the current month in mock data
    return mockRevenueByMonth.filter(m => m.month === "Abr");
  }, [currentMonthOnly]);

  const portfolioTotal = useMemo(
    () => mockPortfolioStatus.reduce((s, p) => s + p.value, 0),
    []
  );

  const hasActiveFilters = trendFilter !== "all" || currentMonthOnly;

  const clearFilters = () => {
    setTrendFilter("all");
    setChartType("Barras");
    setCurrentMonthOnly(false);
  };

  // ── Export Excel ─────────────────────────────────────────────────
  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Aba KPIs
    const kpiSheet = XLSX.utils.json_to_sheet(
      mockKpis.map(k => ({
        Label: k.label,
        Valor: k.value,
        "Variação%": k.trend,
        Subtítulo: k.sub,
      }))
    );
    XLSX.utils.book_append_sheet(wb, kpiSheet, "KPIs");

    // Aba Receita Mensal
    const revenueSheet = XLSX.utils.json_to_sheet(
      mockRevenueByMonth.map(r => ({
        Mês: r.month,
        Valor: r.value,
      }))
    );
    XLSX.utils.book_append_sheet(wb, revenueSheet, "Receita Mensal");

    // Aba Portfólio
    const portfolioSheet = XLSX.utils.json_to_sheet(
      mockPortfolioStatus.map(p => ({
        Status: p.label,
        Contratos: p.value,
      }))
    );
    XLSX.utils.book_append_sheet(wb, portfolioSheet, "Portfólio");

    const today = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `relatorio-ribas-${today}.xlsx`);
    toast.success("Relatório exportado!");
  };

  // ── Print / PDF ──────────────────────────────────────────────────
  const handlePrint = () => {
    window.print();
  };

  // ── GSAP ScrollTrigger ───────────────────────────────────────────
  useLayoutEffect(() => {
    const scroller = "#dashboard-main";
    const ctx = gsap.context(() => {
      // KPI cards — stagger fade+slide ao entrar na viewport
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

      // Seções de gráfico — fade+slide
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

      // Linhas de top clientes — slide da esquerda
      gsap.from(".performance-client", {
        opacity: 0,
        x: -12,
        stagger: 0.06,
        duration: 0.45,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".performance-clients",
          scroller,
          start: "top 85%",
          once: true,
        },
      });

      // Barras de progresso dos clientes
      gsap.from(".client-bar-fill", {
        scaleX: 0,
        transformOrigin: "left",
        stagger: 0.06,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".performance-clients",
          scroller,
          start: "top 85%",
          once: true,
        },
      });

      // Grid de operações — fade+scale
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
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-end justify-between mb-4 flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/70 mb-1">
            Business Intelligence · Abril/2026
          </p>
          <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
            Relatórios &amp; Métricas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Desempenho operacional e financeiro em tempo real
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-muted/30 p-1 rounded border border-border">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 h-8 rounded text-xs font-bold transition-all ${
                  period === p
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Toggle advanced filters */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen(v => !v)}
            className={`gap-2 rounded ${filtersOpen || hasActiveFilters ? "border-primary text-primary" : ""}`}
          >
            <SlidersHorizontal size={14} />
            Filtros
            {hasActiveFilters && (
              <span className="ml-0.5 w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            )}
          </Button>

          <Button
            variant="outline"
            onClick={handlePrint}
            className="gap-2 rounded"
          >
            <Printer size={14} /> Imprimir
          </Button>
          <Button
            onClick={handleExportExcel}
            className="gap-2 rounded shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            <Download size={14} /> Exportar
          </Button>
        </div>
      </div>

      {/* ── Advanced Filters Panel ───────────────────────────── */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            key="filters-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden mb-4"
          >
            <div className="section-card p-4 flex flex-wrap items-end gap-5">

              {/* Trend filter */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Tendência dos KPIs
                </span>
                <div className="flex gap-1">
                  {(["all", "up", "down"] as TrendFilter[]).map((v) => {
                    const labels: Record<TrendFilter, string> = { all: "Todos", up: "Alta", down: "Baixa" };
                    return (
                      <button
                        key={v}
                        onClick={() => setTrendFilter(v)}
                        className={`px-3 h-7 rounded text-xs font-bold border transition-all ${
                          trendFilter === v
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border text-muted-foreground hover:text-foreground bg-background"
                        }`}
                      >
                        {labels[v]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chart type */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Visualização
                </span>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as ChartType)}
                  className="h-7 px-2 rounded text-xs font-semibold border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Barras">Barras</option>
                  <option value="Área">Área</option>
                </select>
              </div>

              {/* Current month only */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Período
                </span>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={currentMonthOnly}
                    onChange={(e) => setCurrentMonthOnly(e.target.checked)}
                    className="w-3.5 h-3.5 accent-primary rounded"
                  />
                  <span className="text-xs font-semibold text-foreground">Mostrar apenas mês atual</span>
                </label>
              </div>

              {/* Clear filters */}
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters && chartType === "Barras"}
                  className="gap-1.5 text-xs text-muted-foreground hover:text-foreground rounded"
                >
                  <X size={12} /> Limpar filtros
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KPI cards — animated by GSAP ScrollTrigger ──────── */}
      <div className="reports-kpi-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <AnimatePresence mode="popLayout">
          {filteredKpis.map((kpi) => {
            const positive = kpi.trend >= 0;
            return (
              <motion.div
                key={kpi.label}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="reports-kpi relative section-card p-5 overflow-hidden group hover:border-primary/30 transition-colors"
              >
                <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl ${
                  positive ? "bg-emerald-500/10" : "bg-red-500/10"
                }`} />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {kpi.label}
                    </span>
                    <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      positive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}>
                      {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {positive ? "+" : ""}{kpi.trend}%
                    </span>
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-card-foreground tracking-tight leading-none">
                    {kpi.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1.5">{kpi.sub}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredKpis.length === 0 && (
          <div className="col-span-full flex items-center justify-center h-24 text-sm text-muted-foreground border border-dashed border-border rounded">
            Nenhum KPI corresponde ao filtro selecionado.
          </div>
        )}
      </div>

      {/* ── Charts row — GSAP animates the section cards ────── */}
      <div className="reports-charts-row grid grid-cols-1 xl:grid-cols-[1.618fr_1fr] gap-6 mb-6">

        {/* Revenue chart — Recharts BarChart */}
        <div className="reports-chart-section section-card p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-card-foreground flex items-center gap-2">
                <BarChart3 size={16} className="text-primary" />
                Receita mensal
                {chartType !== "Barras" && (
                  <span className="ml-1 text-[10px] font-bold uppercase tracking-widest text-primary/60 border border-primary/20 rounded px-1.5 py-0.5">
                    {chartType}
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Últimos 6 meses · crescimento médio de 9,2%
              </p>
            </div>
            <button
              onClick={() => toast.info("Abrindo detalhamento…")}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
            >
              Detalhar <ArrowUpRight size={12} />
            </button>
          </div>

          {/* Recharts BarChart — replaces the old CSS bar grid */}
          <div className="revenue-chart">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={filteredRevenue}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  width={60}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [
                    `R$ ${Number(value).toLocaleString("pt-BR")}`,
                    "Receita",
                  ]}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0] as any}>
                  {filteredRevenue.map((entry, index) => {
                    const isLast = index === filteredRevenue.length - 1;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          isLast
                            ? "hsl(var(--primary))"
                            : "hsl(var(--muted-foreground) / 0.3)"
                        }
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio donut — Framer Motion handles the stroke animation */}
        <div className="reports-chart-section section-card p-6">
          <h3 className="text-base font-bold text-card-foreground flex items-center gap-2 mb-5">
            <PieChartIcon size={16} className="text-primary" /> Portfólio
          </h3>

          <div className="flex items-center gap-6">
            <div className="relative w-[140px] h-[140px] shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  let offset = 0;
                  const circ = 2 * Math.PI * 40;
                  return mockPortfolioStatus.map((seg, i) => {
                    const pct = seg.value / portfolioTotal;
                    const len = pct * circ;
                    const strokeColors = ["#10b981", "#3b82f6", "#f59e0b", "#94a3b8"];
                    const el = (
                      <motion.circle
                        key={seg.label}
                        cx="50" cy="50" r="40"
                        fill="none"
                        strokeWidth="14"
                        stroke={strokeColors[i]}
                        strokeDasharray={`${len} ${circ}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="round"
                        initial={{ strokeDasharray: `0 ${circ}` }}
                        animate={{ strokeDasharray: `${len} ${circ}` }}
                        transition={{ delay: 0.35 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    );
                    offset += len;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-card-foreground leading-none">{portfolioTotal}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Contratos</span>
              </div>
            </div>

            <div className="flex-1 space-y-2.5 min-w-0">
              {mockPortfolioStatus.map((seg) => {
                const pct = Math.round((seg.value / portfolioTotal) * 100);
                return (
                  <div key={seg.label} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2.5 h-2.5 rounded-full ${seg.color} shrink-0`} />
                      <span className="text-xs font-semibold text-card-foreground truncate">{seg.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="font-bold text-card-foreground tabular-nums">{seg.value}</span>
                      <span className="text-muted-foreground tabular-nums w-8 text-right">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Performance tables — GSAP ScrollTrigger ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top clients */}
        <div className="section-card p-6">
          <h3 className="text-base font-bold text-card-foreground flex items-center gap-2 mb-5">
            <Users size={16} className="text-primary" /> Top clientes do período
          </h3>
          <div className="performance-clients space-y-3">
            {[
              { name: "Construtora Andrade Gutierrez", value: "R$ 287.400", contracts: 8, pct: 100 },
              { name: "MRV Engenharia S/A",            value: "R$ 214.800", contracts: 6, pct: 75 },
              { name: "Odebrecht Infraestrutura",      value: "R$ 186.200", contracts: 5, pct: 65 },
              { name: "Votorantim Cimentos",           value: "R$ 142.900", contracts: 4, pct: 50 },
              { name: "Copel Distribuição",            value: "R$ 98.300",  contracts: 3, pct: 34 },
            ].map((c, i) => (
              <div key={c.name} className="performance-client group">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded bg-muted/60 flex items-center justify-center text-[9px] font-black text-muted-foreground shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-card-foreground truncate">{c.name}</span>
                  </div>
                  <span className="font-black text-card-foreground tabular-nums">{c.value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
                    <div
                      className="client-bar-fill h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground w-12 text-right tabular-nums">
                    {c.contracts} ctr
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational summary */}
        <div className="section-card p-6">
          <h3 className="text-base font-bold text-card-foreground flex items-center gap-2 mb-5">
            <Calendar size={16} className="text-primary" /> Resumo operacional
          </h3>
          <div className="performance-ops grid grid-cols-2 gap-4">
            {[
              { label: "Reuniões realizadas",     value: "28",        sub: "92% de presença" },
              { label: "Propostas enviadas",      value: "17",        sub: "41% convertidas" },
              { label: "Documentos processados",  value: "142",       sub: "em compliance" },
              { label: "Horas operacionais",      value: "867",       sub: "frota ativa" },
              { label: "Ticket médio",            value: "R$ 28.500", sub: "por contrato" },
              { label: "Tempo médio de contrato", value: "4,2 meses", sub: "execução" },
            ].map((item) => (
              <div
                key={item.label}
                className="performance-op p-3 rounded bg-muted/30 border border-border/40"
              >
                <p className="text-lg font-black text-card-foreground tabular-nums">{item.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">{item.label}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => toast.info("Gerando relatório completo…")}
            className="w-full mt-5 h-10 text-xs font-bold rounded border border-dashed border-primary/30 text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
          >
            <FileText size={13} /> Gerar relatório completo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
