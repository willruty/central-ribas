import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, ArrowRight, Mail, Lock, FileText, Truck, Users } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

const highlights = [
  { icon: FileText, label: "Gestão de Contratos", desc: "41 ativos monitorados em tempo real" },
  { icon: Truck, label: "Frota & Equipamentos", desc: "87% de taxa de ocupação operacional" },
  { icon: ShieldCheck, label: "Compliance Documental", desc: "Alertas inteligentes de vencimento" },
];

const Login = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error: loginError } = await login(email, password);
    if (loginError) setError(loginError);
  };

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-[1.1fr_1fr]">
      {/* ── Left: painel visual (3/5 na proporção áurea aproximada) ── */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[hsl(222,47%,9%)] via-[hsl(222,47%,6%)] to-[hsl(222,47%,4%)] p-12 flex-col justify-between"
      >
        {/* Orbes decorativos */}
        <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-blue-300/40 animate-pulse" />
        <div className="absolute top-2/3 left-1/3 w-1.5 h-1.5 rounded-full bg-blue-200/30 animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 flex items-center gap-3">
          <Logo className="w-32 h-auto" animate />
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40 mt-2">
            Sistema de Gestão
          </span>
        </div>

        <div className="relative z-10 space-y-10 max-w-md">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-300/80 mb-4">
              Painel Administrativo · 2026
            </p>
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.05] tracking-tight">
              Gestão completa da sua frota de guindastes.
            </h2>
            <p className="mt-5 text-white/60 text-[15px] leading-relaxed">
              Contratos, equipamentos, operadores e documentos críticos em um só lugar —
              com compliance automatizado.
            </p>
          </div>

          <div className="space-y-3">
            {highlights.map((h, i) => (
              <motion.div
                key={h.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3.5 p-3.5 rounded bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 shrink-0 rounded bg-gradient-to-br from-blue-400/20 to-blue-600/20 border border-blue-300/20 flex items-center justify-center">
                  <h.icon size={16} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{h.label}</p>
                  <p className="text-xs text-white/50">{h.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-[11px] text-white/40 font-medium">
          <ShieldCheck size={12} className="text-blue-300/60" />
          <span>Conexão criptografada · LGPD compliant</span>
        </div>
      </motion.aside>

      {/* ── Right: formulário (2/5) ──────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center justify-center px-6 py-12 sm:px-10"
      >
        <div className="w-full max-w-[400px]">
          <div className="flex lg:hidden justify-center mb-10">
            <Logo />
          </div>

          <div className="mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600/80 mb-2">
              Bem-vinda de volta
            </p>
            <h1 className="text-3xl font-black font-display text-foreground tracking-tight">
              Acesse sua conta
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Entre com suas credenciais para continuar gerenciando sua operação.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                E-mail corporativo
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
                <Input
                  id="email"
                  type="email"
                  placeholder="helena@guindastesribas.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="h-12 pl-10 rounded border-border/80 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Senha
                </Label>
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-[11px] font-bold text-primary hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" size={15} />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="h-12 pl-10 rounded border-border/80 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-4 py-3 flex items-start gap-2"
              >
                <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded font-bold text-[13px] tracking-wide shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" /> Autenticando...
                </>
              ) : (
                <>
                  Entrar no painel <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border/60">
            <p className="text-xs text-muted-foreground text-center">
              Problemas para acessar?{" "}
              <button
                type="button"
                onClick={() => {}}
                className="font-bold text-primary hover:underline"
              >
                Fale com o suporte
              </button>
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Login;
