import { useState } from "react";
import {
  User, Bell, Shield, Palette, Mail, Lock, LogOut, Save, Moon, Sun,
  Camera, ChevronRight, Key, Globe, Check, AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { useTheme } from "@/components/theme-provider.tsx";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

type Section = "profile" | "notifications" | "appearance" | "security";

const NAV: { key: Section; label: string; icon: typeof User; desc: string }[] = [
  { key: "profile",       label: "Perfil",        icon: User,    desc: "Informações pessoais e contato" },
  { key: "notifications", label: "Notificações",  icon: Bell,    desc: "Preferências de alertas e e-mails" },
  { key: "appearance",    label: "Aparência",     icon: Palette, desc: "Tema e personalização visual" },
  { key: "security",      label: "Segurança",     icon: Shield,  desc: "Senha, sessões e dispositivos" },
];

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const [active, setActive] = useState<Section>("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    firstName: "Helena",
    lastName: "Ribas",
    email: "helena@guindastesribas.com.br",
    phone: "(41) 99123-4500",
    bio: "Administradora operacional, responsável pela gestão de frota e compliance documental.",
  });

  const [notifs, setNotifs] = useState({
    email: true, vencimentos: true, mensagens: true, reports: false, marketing: false,
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Configurações salvas com sucesso!");
    }, 600);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary/70 mb-1">
            Preferências · Conta
          </p>
          <h1 className="text-2xl font-extrabold font-display text-foreground tracking-tight">
            Configurações
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Personalize o comportamento do sistema para o seu fluxo de trabalho
          </p>
        </div>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2 rounded shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
        >
          <Save size={15} /> {isSaving ? "Salvando…" : "Salvar alterações"}
        </Button>
      </div>

      {/* ── Layout: nav lateral (1/4) + conteúdo (3/4) ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <aside className="section-card p-2 h-fit">
          {NAV.map((item) => {
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`relative w-full text-left flex items-start gap-3 p-3 rounded transition-all ${
                  isActive
                    ? "bg-primary/5 text-primary"
                    : "hover:bg-muted/40 text-card-foreground"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="settings-active"
                    className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-r bg-primary"
                  />
                )}
                <div className={`w-9 h-9 shrink-0 rounded flex items-center justify-center ${
                  isActive ? "bg-primary/10" : "bg-muted/50"
                }`}>
                  <item.icon size={16} className={isActive ? "text-primary" : "text-muted-foreground"} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className={`text-sm font-bold truncate ${isActive ? "text-primary" : ""}`}>
                    {item.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>
                <ChevronRight size={14} className={`shrink-0 mt-2 transition-transform ${
                  isActive ? "text-primary translate-x-0.5" : "text-muted-foreground/40"
                }`} />
              </button>
            );
          })}
          <div className="mt-2 pt-2 border-t border-border/60">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-3 rounded text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
            >
              <div className="w-9 h-9 shrink-0 rounded flex items-center justify-center bg-muted/50">
                <LogOut size={16} className="text-muted-foreground" />
              </div>
              <span>Sair do sistema</span>
            </button>
          </div>
        </aside>

        <AnimatePresence mode="wait">
          <motion.section
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {active === "profile" && (
              <div className="space-y-6">
                <Card title="Identidade" desc="Essas informações aparecem no seu perfil e assinatura de e-mail.">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 rounded bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/30">
                        {form.firstName[0]}{form.lastName[0]}
                      </div>
                      <button
                        onClick={() => toast.info("Seletor de imagem em breve.")}
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border-2 border-background shadow-md flex items-center justify-center text-muted-foreground hover:text-primary hover:scale-110 transition-all"
                      >
                        <Camera size={13} />
                      </button>
                    </div>
                    <div>
                      <p className="text-base font-bold text-card-foreground">{form.firstName} {form.lastName}</p>
                      <p className="text-xs text-muted-foreground">Administradora · Ativa há 2 anos</p>
                      <Button variant="outline" size="sm" className="mt-2 gap-1.5 text-xs">
                        <Camera size={12} /> Alterar avatar
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Nome">
                      <Input
                        value={form.firstName}
                        onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))}
                        className="h-11 rounded"
                      />
                    </Field>
                    <Field label="Sobrenome">
                      <Input
                        value={form.lastName}
                        onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))}
                        className="h-11 rounded"
                      />
                    </Field>
                    <Field label="E-mail">
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <Input
                          value={form.email}
                          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                          type="email"
                          className="h-11 pl-10 rounded"
                        />
                      </div>
                    </Field>
                    <Field label="Telefone">
                      <Input
                        value={form.phone}
                        onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="h-11 rounded"
                      />
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field label="Biografia">
                      <textarea
                        value={form.bio}
                        onChange={(e) => setForm(f => ({ ...f, bio: e.target.value }))}
                        className="w-full min-h-[88px] bg-muted/30 border border-border rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-background transition-colors"
                        placeholder="Conte um pouco sobre você..."
                      />
                    </Field>
                  </div>
                </Card>

                <Card title="Idioma & Região" desc="Personalize formatos de data, moeda e fuso horário.">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Idioma">
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <Input defaultValue="Português (Brasil)" className="h-11 pl-10 rounded" readOnly />
                      </div>
                    </Field>
                    <Field label="Fuso horário">
                      <Input defaultValue="GMT-03:00 · Brasília" className="h-11 rounded" readOnly />
                    </Field>
                  </div>
                </Card>
              </div>
            )}

            {active === "notifications" && (
              <Card title="Preferências de notificação" desc="Escolha quando e como você quer ser avisado.">
                <div className="space-y-2">
                  {[
                    { key: "vencimentos", label: "Alertas de vencimento",  desc: "Avisos sobre contratos e documentos próximos do prazo.", critical: true },
                    { key: "mensagens",   label: "Novas mensagens",         desc: "Notifica quando alguém da equipe envia mensagem." },
                    { key: "email",       label: "E-mails de sistema",      desc: "Relatórios de uso e confirmações importantes." },
                    { key: "reports",     label: "Resumo semanal",          desc: "Resumo das métricas principais toda segunda-feira." },
                    { key: "marketing",   label: "E-mail marketing",        desc: "Novidades e atualizações do produto." },
                  ].map((n) => (
                    <div
                      key={n.key}
                      className="flex items-center justify-between gap-4 p-4 rounded border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-card-foreground flex items-center gap-2">
                          {n.label}
                          {n.critical && (
                            <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              Crítico
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                      </div>
                      <Switch
                        checked={notifs[n.key as keyof typeof notifs]}
                        onCheckedChange={(v) => setNotifs(p => ({ ...p, [n.key]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {active === "appearance" && (
              <Card title="Tema visual" desc="Altera o modo de cores e contraste da interface.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { key: "light" as const, label: "Claro",  icon: Sun,  preview: "bg-white",        desc: "Melhor para o dia" },
                    { key: "dark"  as const, label: "Escuro", icon: Moon, preview: "bg-slate-900",    desc: "Menor cansaço visual" },
                  ].map((t) => {
                    const isActive = theme === t.key;
                    return (
                      <button
                        key={t.key}
                        onClick={() => {
                          setTheme(t.key);
                          toast.success(`Tema ${t.label.toLowerCase()} ativado.`);
                        }}
                        className={`relative p-4 rounded border-2 cursor-pointer transition-all text-left ${
                          isActive
                            ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                            : "border-border hover:border-primary/40 bg-card"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </span>
                        )}
                        <div className={`w-full h-24 rounded mb-3 flex items-center justify-center border border-border/40 ${t.preview}`}>
                          <t.icon size={24} className={t.key === "dark" ? "text-white" : "text-amber-500"} />
                        </div>
                        <p className="text-sm font-bold text-card-foreground">{t.label}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{t.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </Card>
            )}

            {active === "security" && (
              <div className="space-y-6">
                <Card title="Senha" desc="Use uma senha forte com no mínimo 8 caracteres.">
                  <div className="grid gap-4 max-w-md">
                    <Field label="Senha atual">
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <Input type="password" placeholder="••••••••" className="h-11 pl-10 rounded" />
                      </div>
                    </Field>
                    <Field label="Nova senha">
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <Input type="password" placeholder="Mínimo 8 caracteres" className="h-11 pl-10 rounded" />
                      </div>
                    </Field>
                    <Button variant="outline" className="gap-2 h-11 rounded w-fit">
                      <Lock size={14} /> Atualizar senha
                    </Button>
                  </div>
                </Card> 

                <Card
                  title="Zona de perigo"
                  desc="Ações sensíveis. Use com cautela."
                  variant="danger"
                >
                  <div className="flex items-center justify-between gap-4 p-4 rounded border border-destructive/30 bg-destructive/5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 shrink-0 rounded bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle size={15} className="text-destructive" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-card-foreground">Encerrar todas as sessões</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Você será deslogado de todos os dispositivos imediatamente.
                        </p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" className="gap-2 shrink-0">
                      <LogOut size={13} /> Sair de tudo
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </div>
    </>
  );
};

/* ── Building blocks ─────────────────────────────────────── */

const Card = ({
  title, desc, children, variant = "default",
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
  variant?: "default" | "danger";
}) => (
  <div className={`section-card p-6 ${variant === "danger" ? "border-destructive/20" : ""}`}>
    <div className="mb-5">
      <h3 className={`text-base font-bold ${variant === "danger" ? "text-destructive" : "text-card-foreground"}`}>
        {title}
      </h3>
      {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
    </div>
    {children}
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{label}</Label>
    {children}
  </div>
);

export default Settings;
