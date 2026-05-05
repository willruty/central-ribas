// Tipos compartilhados dos serviços

export type Funcionario = {
  id: string;
  profile_id?: string;
  nome: string;
  cpf?: string;
  rg?: string;
  cargo: string;
  email?: string;
  telefone?: string;
  celular?: string;
  cnh_numero?: string;
  cnh_validade?: string;
  data_admissao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoriaEquipamento = {
  id: string;
  nome: string;
  descricao?: string;
};

export type Equipamento = {
  id: string;
  categoria_id: string;
  categorias_equipamento?: CategoriaEquipamento;
  nome: string;
  modelo?: string;
  fabricante?: string;
  numero_serie?: string;
  placa?: string;
  capacidade_kg?: number;
  altura_max_metros?: number;
  alcance_max_metros?: number;
  valor_locacao_diaria?: number;
  status: 'disponivel' | 'locado' | 'em_manutencao' | 'inativo';
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type Documento = {
  id: string;
  contrato_id?: string;
  funcionario_id?: string;
  equipamento_id?: string;
  cliente_id?: string;
  tipo: 'contrato' | 'laudo' | 'nota_fiscal' | 'certificado' | 'cnh' | 'aso' | 'art' | 'outro';
  nome_arquivo: string;
  descricao?: string;
  storage_path: string;
  validade?: string;
  created_at: string;
  updated_at: string;
};

export type Cliente = {
  id: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  razao_social?: string;
  nome_fantasia?: string;
  cnpj?: string;
  nome_completo?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  celular?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type Contrato = {
  id: string;
  cliente_id: string;
  criado_por_id?: string;
  numero: string;
  data_inicio: string;
  data_fim_previsto?: string;
  data_fim_real?: string;
  local_servico?: string;
  valor_total?: number;
  status: 'rascunho' | 'aprovado' | 'em_execucao' | 'concluido' | 'cancelado';
  descricao?: string;
  created_at: string;
  updated_at: string;
};
