import { api } from './api';
import { API_CONFIG } from './config';

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

export async function getFuncionarios(
  token: string,
  skip?: number,
  take?: number
): Promise<{ data: Funcionario[] | null; error: string | null }> {
  const query = new URLSearchParams();
  if (skip !== undefined) query.append('skip', skip.toString());
  if (take !== undefined) query.append('take', take.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const { data, error } = await api.get<Funcionario[]>(
    `/funcionarios${queryString}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getFuncionarioById(
  id: string,
  token: string
): Promise<{ data: Funcionario | null; error: string | null }> {
  const { data, error } = await api.get<Funcionario>(`/funcionarios/${id}`, {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function getFuncionariosAtivos(
  token: string
): Promise<{ data: Funcionario[] | null; error: string | null }> {
  const { data, error } = await api.get<Funcionario[]>(`/funcionarios/ativos`, {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function createFuncionario(
  funcionario: Partial<Funcionario>,
  token: string
): Promise<{ data: Funcionario | null; error: string | null }> {
  const { data, error } = await api.post<Funcionario>(
    '/funcionarios',
    funcionario,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function updateFuncionario(
  id: string,
  funcionario: Partial<Funcionario>,
  token: string
): Promise<{ data: Funcionario | null; error: string | null }> {
  const { data, error } = await api.patch<Funcionario>(
    `/funcionarios/${id}`,
    funcionario,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function deleteFuncionario(
  id: string,
  token: string
): Promise<{ error: string | null }> {
  const { error } = await api.delete(`/funcionarios/${id}`, {
    Authorization: `Bearer ${token}`,
  });

  return { error };
}
