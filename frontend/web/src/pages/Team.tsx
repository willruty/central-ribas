import { useState, useEffect } from "react";
import {
  Plus, Users, Search, Phone, Mail, MoreVertical, ChevronRight, Eye, EyeOff, ShieldCheck
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { getFuncionarios, registerFuncionario } from "@/services/funcionariosService";
import { Funcionario } from "@/services/types";

const CARGO_SISTEMA_LABELS: Record<string, string> = {
  admin: "Administrador",
  operacional: "Operacional",
  financeiro: "Financeiro",
  tecnico: "Técnico",
  visualizador: "Visualizador",
};

const Team = () => {
  const { token } = useAuth();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    cargo: "",
    email: "",
    senha: "",
    telefone: "",
    cpf: "",
    cargo_sistema: "visualizador" as string,
  });

  useEffect(() => {
    if (!token) return;
    getFuncionarios(token).then(({ data, error }) => {
      if (error) toast.error(`Erro ao carregar equipe: ${error}`);
      else if (data) setFuncionarios(data);
    }).finally(() => setIsLoading(false));
  }, [token]);

  const resetForm = () => {
    setForm({ nome: "", cargo: "", email: "", senha: "", telefone: "", cpf: "", cargo_sistema: "visualizador" });
    setShowPassword(false);
  };

  const handleAddMember = async () => {
    if (!form.nome || !form.cargo) {
      toast.error("Nome e cargo são obrigatórios.");
      return;
    }
    if (!form.email) {
      toast.error("Email é obrigatório para acesso ao sistema.");
      return;
    }
    if (!form.senha || form.senha.length < 6) {
      toast.error("Senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsSaving(true);
    const { data, error } = await registerFuncionario(
      {
        nome: form.nome,
        cargo: form.cargo,
        email: form.email,
        senha: form.senha,
        cargo_sistema: form.cargo_sistema as any,
        telefone: form.telefone || undefined,
        cpf: form.cpf || undefined,
      },
      token!
    );
    setIsSaving(false);

    if (error) {
      toast.error(`Erro ao cadastrar: ${error}`);
      return;
    }

    setFuncionarios(prev => [data!, ...prev]);
    setIsDialogOpen(false);
    resetForm();
    toast.success(`${form.nome} cadastrado com acesso ao sistema!`);
  };

  const filtered = funcionarios.filter(m =>
    m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold font-display text-foreground">Gestão da Equipe</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? "Carregando…" : `${funcionarios.length} colaborador${funcionarios.length !== 1 ? "es" : ""}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Buscar equipe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-muted/30 border border-border rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity font-medium">
                <Plus size={16} /> Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" />
                  Novo Colaborador com Acesso
                </DialogTitle>
                <DialogDescription>
                  Cria o colaborador e libera acesso ao sistema. Apenas usuários autenticados podem cadastrar novos membros.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs">Nome *</Label>
                  <Input
                    value={form.nome}
                    onChange={(e) => setForm(f => ({ ...f, nome: e.target.value }))}
                    className="col-span-3"
                    placeholder="Nome completo"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs">Cargo *</Label>
                  <Input
                    value={form.cargo}
                    onChange={(e) => setForm(f => ({ ...f, cargo: e.target.value }))}
                    className="col-span-3"
                    placeholder="Ex: Operador de Guindaste"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs">CPF</Label>
                  <Input
                    value={form.cpf}
                    onChange={(e) => setForm(f => ({ ...f, cpf: e.target.value }))}
                    className="col-span-3"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs">Telefone</Label>
                  <Input
                    value={form.telefone}
                    onChange={(e) => setForm(f => ({ ...f, telefone: e.target.value }))}
                    className="col-span-3"
                    placeholder="(00) 90000-0000"
                  />
                </div>

                <div className="border-t border-border/40 pt-4 mt-1">
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-primary" />
                    Credenciais de acesso ao sistema
                  </p>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs">E-mail *</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                        className="col-span-3"
                        placeholder="colaborador@empresa.com"
                      />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs">Senha *</Label>
                      <div className="col-span-3 relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={form.senha}
                          onChange={(e) => setForm(f => ({ ...f, senha: e.target.value }))}
                          placeholder="Mínimo 6 caracteres"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right text-xs">Perfil</Label>
                      <Select
                        value={form.cargo_sistema}
                        onValueChange={(v) => setForm(f => ({ ...f, cargo_sistema: v }))}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CARGO_SISTEMA_LABELS).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleAddMember} disabled={isSaving}>
                  {isSaving ? "Cadastrando…" : "Cadastrar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="section-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30">
              <tr className="text-xs text-muted-foreground/70 uppercase tracking-wider">
                <th className="text-left py-4 px-6 font-medium border-b border-border/40">Colaborador</th>
                <th className="text-left py-4 px-6 font-medium border-b border-border/40">Cargo</th>
                <th className="text-left py-4 px-6 font-medium border-b border-border/40">Contato</th>
                <th className="text-left py-4 px-6 font-medium border-b border-border/40">Status</th>
                <th className="text-right py-4 px-6 font-medium border-b border-border/40"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground italic">Carregando equipe…</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground italic">
                    {searchTerm ? "Nenhum colaborador encontrado." : "Nenhum colaborador cadastrado ainda."}
                  </td>
                </tr>
              ) : (
                filtered.map((member, i) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="table-row-hover"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
                          {member.nome.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-card-foreground">{member.nome}</p>
                          <p className="text-[10px] text-muted-foreground">{member.email || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-medium text-card-foreground text-xs">{member.cargo}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        {member.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail size={11} /><span>{member.email}</span>
                          </div>
                        )}
                        {(member.celular || member.telefone) && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone size={11} /><span>{member.celular || member.telefone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={member.ativo ? "badge-active" : "badge-pending"}>
                        {member.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Editar Perfil</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                          <ChevronRight size={18} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Team;
