import { Contract } from "@/types/dashboard";
import { ClientData } from "@/components/dashboard/ClientsTable";

export const mockContracts: Contract[] = [
  { client: "Construtora Andrade Gutierrez", code: "CTR-2026-041", status: "Ativo", days: "18/11/2026", action: "Ver", date: "04/03/2026" },
  { client: "MRV Engenharia S/A", code: "CTR-2026-040", status: "Ativo", days: "02/12/2026", action: "Ver", date: "01/03/2026" },
  { client: "Odebrecht Infraestrutura", code: "CTR-2026-039", status: "Pendente", days: "Em aberto", action: "Ver", date: "27/02/2026" },
  { client: "Votorantim Cimentos", code: "CTR-2026-038", status: "Ativo", days: "15/09/2026", action: "Ver", date: "22/02/2026" },
  { client: "Prefeitura de Curitiba", code: "CTR-2026-037", status: "Pendente", days: "Em revisão", action: "Ver", date: "18/02/2026" },
  { client: "Copel Distribuição", code: "CTR-2026-036", status: "Ativo", days: "28/08/2026", action: "Ver", date: "12/02/2026" },
  { client: "Sanepar S/A", code: "CTR-2026-035", status: "Concluído", days: "Finalizado", action: "Ver", date: "08/02/2026" },
];

export const mockClients: ClientData[] = [
  { id: "1", name: "Construtora Andrade Gutierrez", email: "contato@agutierrez.com.br", phone: "(41) 3322-4500", location: "Curitiba, PR", status: "Ativo" },
  { id: "2", name: "MRV Engenharia S/A", email: "obras@mrv.com.br", phone: "(31) 3615-8400", location: "Belo Horizonte, MG", status: "Ativo" },
  { id: "3", name: "Odebrecht Infraestrutura", email: "locacoes@odebrecht.com", phone: "(71) 3317-1100", location: "Salvador, BA", status: "Ativo" },
  { id: "4", name: "Votorantim Cimentos", email: "suprimentos@vcimentos.com", phone: "(11) 4432-1000", location: "São Paulo, SP", status: "Ativo" },
  { id: "5", name: "Prefeitura de Curitiba", email: "licitacoes@curitiba.pr.gov.br", phone: "(41) 3350-8484", location: "Curitiba, PR", status: "Ativo" },
  { id: "6", name: "Copel Distribuição", email: "compras@copel.com", phone: "(41) 3310-5050", location: "Curitiba, PR", status: "Ativo" },
  { id: "7", name: "Sanepar S/A", email: "engenharia@sanepar.com.br", phone: "(41) 3330-3000", location: "Curitiba, PR", status: "Inativo" },
  { id: "8", name: "Queiroz Galvão Construção", email: "obras@queirozgalvao.com", phone: "(81) 3412-8800", location: "Recife, PE", status: "Ativo" },
];

export interface MockDocument {
  id: string;
  name: string;
  type: "CNH" | "ART" | "Laudo" | "Contrato" | "NR-11" | "ASO" | "AVCB" | "Outro";
  client: string;
  size: string;
  updatedAt: string;
  status: "valido" | "vencendo" | "vencido";
  expiresIn?: number; // dias para vencer (negativo = vencido)
  author: string;
  color: string;
}

export const mockDocuments: MockDocument[] = [
  { id: "d1", name: "CNH - João Carlos Silva.pdf", type: "CNH", client: "Operador", size: "2.1 MB", updatedAt: "há 2 horas", status: "vencendo", expiresIn: 14, author: "Helena Ribas", color: "bg-blue-500" },
  { id: "d2", name: "ART Grua XCMG QY70K.pdf", type: "ART", client: "Equipamento #GR-047", size: "856 KB", updatedAt: "há 1 dia", status: "valido", expiresIn: 180, author: "Roberto Pires", color: "bg-emerald-500" },
  { id: "d3", name: "Laudo Técnico Grua Manitowoc.pdf", type: "Laudo", client: "Equipamento #GR-032", size: "3.4 MB", updatedAt: "há 3 dias", status: "vencido", expiresIn: -5, author: "Helena Ribas", color: "bg-red-500" },
  { id: "d4", name: "Contrato CTR-2026-040 MRV.pdf", type: "Contrato", client: "MRV Engenharia", size: "1.8 MB", updatedAt: "há 5 dias", status: "valido", expiresIn: 270, author: "Amanda Torres", color: "bg-purple-500" },
  { id: "d5", name: "NR-11 - Pedro Almeida.pdf", type: "NR-11", client: "Operador", size: "640 KB", updatedAt: "há 1 semana", status: "valido", expiresIn: 365, author: "Helena Ribas", color: "bg-emerald-500" },
  { id: "d6", name: "ASO - Marcelo Ribeiro.pdf", type: "ASO", client: "Operador", size: "1.1 MB", updatedAt: "há 1 semana", status: "vencendo", expiresIn: 22, author: "Helena Ribas", color: "bg-amber-500" },
  { id: "d7", name: "AVCB Sede Administrativa.pdf", type: "AVCB", client: "Empresa", size: "920 KB", updatedAt: "há 2 semanas", status: "valido", expiresIn: 450, author: "Amanda Torres", color: "bg-emerald-500" },
  { id: "d8", name: "Inspeção Guindaste Liebherr LTM.pdf", type: "Laudo", client: "Equipamento #GR-018", size: "2.7 MB", updatedAt: "há 2 semanas", status: "vencendo", expiresIn: 28, author: "Roberto Pires", color: "bg-amber-500" },
];

export interface MockActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  type: "contract" | "document" | "client" | "meeting" | "alert";
}

export const mockActivities: MockActivity[] = [
  { id: "a1", user: "Helena Ribas", action: "assinou", target: "Contrato CTR-2026-041", time: "há 12 min", type: "contract" },
  { id: "a2", user: "Sistema", action: "alertou vencimento de", target: "CNH - João Carlos", time: "há 1 hora", type: "alert" },
  { id: "a3", user: "Amanda Torres", action: "fez upload de", target: "ART Grua XCMG QY70K", time: "há 2 horas", type: "document" },
  { id: "a4", user: "Helena Ribas", action: "agendou reunião com", target: "Construtora Andrade", time: "há 3 horas", type: "meeting" },
  { id: "a5", user: "Roberto Pires", action: "cadastrou cliente", target: "Queiroz Galvão", time: "ontem", type: "client" },
];

export interface MockTask {
  id: string;
  title: string;
  priority: "Alta" | "Média" | "Baixa";
  status: "Pendente" | "Concluido";
  deadline: string;
  category: string;
  createdAt: string;
}

export const mockTasks: MockTask[] = [
  { id: "t1", title: "Renovar CNH do operador João Carlos (vence em 14 dias)", priority: "Alta", status: "Pendente", deadline: "30/04/2026", category: "Compliance", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "t2", title: "Agendar inspeção técnica da Grua Liebherr LTM-1100", priority: "Alta", status: "Pendente", deadline: "22/04/2026", category: "Manutenção", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "t3", title: "Revisar proposta comercial MRV Engenharia", priority: "Média", status: "Pendente", deadline: "20/04/2026", category: "Comercial", createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: "t4", title: "Enviar relatório mensal à contabilidade", priority: "Média", status: "Concluido", deadline: "15/04/2026", category: "Financeiro", createdAt: new Date(Date.now() - 432000000).toISOString() },
  { id: "t5", title: "Atualizar documentação do Guindaste GR-032", priority: "Alta", status: "Pendente", deadline: "18/04/2026", category: "Compliance", createdAt: new Date(Date.now() - 345600000).toISOString() },
  { id: "t6", title: "Negociar renovação do seguro da frota", priority: "Baixa", status: "Pendente", deadline: "05/05/2026", category: "Administrativo", createdAt: new Date(Date.now() - 518400000).toISOString() },
  { id: "t7", title: "Treinamento NR-11 para novos colaboradores", priority: "Média", status: "Concluido", deadline: "12/04/2026", category: "RH", createdAt: new Date(Date.now() - 604800000).toISOString() },
];

export interface MockMeeting {
  id: string;
  title: string;
  company: string;
  time: string;
  date: string; // ISO
  type: "Presencial" | "Online";
  participants: number;
  location?: string;
}

const today = new Date();
const todayISO = today.toISOString();
const tomorrowISO = new Date(today.getTime() + 86400000).toISOString();
const in2daysISO = new Date(today.getTime() + 172800000).toISOString();

export const mockMeetings: MockMeeting[] = [
  { id: "m1", title: "Kickoff obra Curitiba Sul", company: "Construtora Andrade Gutierrez", time: "09:00", date: todayISO, type: "Presencial", participants: 5, location: "Sede Guindastes Ribas" },
  { id: "m2", title: "Alinhamento logístico de gruas", company: "MRV Engenharia S/A", time: "11:30", date: todayISO, type: "Online", participants: 3 },
  { id: "m3", title: "Revisão de contrato trimestral", company: "Votorantim Cimentos", time: "14:00", date: todayISO, type: "Online", participants: 4 },
  { id: "m4", title: "Visita técnica ao canteiro", company: "Odebrecht Infraestrutura", time: "16:30", date: todayISO, type: "Presencial", participants: 2, location: "Obra BR-376" },
  { id: "m5", title: "Reunião semanal da equipe", company: "Interno — Operações", time: "08:00", date: tomorrowISO, type: "Online", participants: 8 },
  { id: "m6", title: "Apresentação de nova frota", company: "Prefeitura de Curitiba", time: "10:30", date: tomorrowISO, type: "Presencial", participants: 6, location: "Paço Municipal" },
  { id: "m7", title: "Auditoria de compliance", company: "Copel Distribuição", time: "15:00", date: in2daysISO, type: "Presencial", participants: 4 },
];

export interface MockReportKpi {
  label: string;
  value: string;
  trend: number;
  sub: string;
}

export const mockKpis: MockReportKpi[] = [
  { label: "Receita do Mês", value: "R$ 1.247.800", trend: 12.4, sub: "vs. mês anterior" },
  { label: "Contratos Ativos", value: "41", trend: 8.1, sub: "7 novos em abril" },
  { label: "Taxa de Ocupação", value: "87%", trend: 3.2, sub: "da frota operacional" },
  { label: "Documentos Vencendo", value: "12", trend: -18.6, sub: "próximos 30 dias" },
];

export const mockRevenueByMonth = [
  { month: "Nov", value: 980000 },
  { month: "Dez", value: 1120000 },
  { month: "Jan", value: 890000 },
  { month: "Fev", value: 1050000 },
  { month: "Mar", value: 1110000 },
  { month: "Abr", value: 1247800 },
];

export const mockPortfolioStatus = [
  { label: "Em execução", value: 41, color: "bg-emerald-500" },
  { label: "Aprovados", value: 14, color: "bg-blue-500" },
  { label: "Em rascunho", value: 7, color: "bg-amber-500" },
  { label: "Concluídos", value: 63, color: "bg-slate-400" },
];

export interface MockUrgentDoc {
  code: string;
  desc: string;
  detail: string;
  time: string;
  priority: number;
}

export const mockUrgentDocs: MockUrgentDoc[] = [
  { code: "CNH - João Carlos Silva", desc: "Operador Sênior", detail: "Vence em 14 dias", time: "30/04", priority: 1 },
  { code: "Laudo Grua Manitowoc", desc: "Equipamento #GR-032", detail: "VENCIDO há 5 dias", time: "11/04", priority: 2 },
  { code: "ASO - Marcelo Ribeiro", desc: "Operador de campo", detail: "Vence em 22 dias", time: "08/05", priority: 3 },
  { code: "Inspeção Liebherr LTM", desc: "Equipamento #GR-018", detail: "Vence em 28 dias", time: "14/05", priority: 4 },
];

export interface MockPendingDoc {
  type: string;
  client: string;
  time: string;
  status: "success" | "warning";
}

export const mockPendingDocs: MockPendingDoc[] = [
  { type: "Contrato assinado", client: "MRV Engenharia S/A", time: "há 2 horas", status: "success" },
  { type: "ART pendente upload", client: "Equipamento #GR-047", time: "há 1 dia", status: "warning" },
  { type: "Laudo vencido", client: "Equipamento #GR-032", time: "há 3 dias", status: "warning" },
  { type: "CNH renovada", client: "Pedro Almeida", time: "há 5 dias", status: "success" },
];

export interface MockRecentFile {
  name: string;
  author: string;
  time: string;
  extra: string;
  color: string;
}

export const mockRecentFiles: MockRecentFile[] = [
  { name: "ART Grua XCMG QY70K.pdf", author: "Roberto Pires", time: "há 2 horas", extra: "856 KB", color: "bg-emerald-500" },
  { name: "Contrato CTR-2026-040 MRV.pdf", author: "Amanda Torres", time: "há 5 horas", extra: "1.8 MB", color: "bg-purple-500" },
  { name: "CNH João Carlos Silva.pdf", author: "Helena Ribas", time: "ontem", extra: "2.1 MB", color: "bg-blue-500" },
  { name: "Laudo técnico Manitowoc.pdf", author: "Helena Ribas", time: "há 2 dias", extra: "3.4 MB", color: "bg-red-500" },
  { name: "NR-11 Pedro Almeida.pdf", author: "Amanda Torres", time: "há 3 dias", extra: "640 KB", color: "bg-amber-500" },
];
