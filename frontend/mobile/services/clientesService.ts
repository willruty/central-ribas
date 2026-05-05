import { api } from './api';

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

export async function getClientes(
  token: string,
  skip?: number,
  take?: number
): Promise<{ data: Cliente[] | null; error: string | null }> {
  const query = new URLSearchParams();
  if (skip !== undefined) query.append('skip', skip.toString());
  if (take !== undefined) query.append('take', take.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const { data, error } = await api.get<Cliente[]>(
    `/clientes${queryString}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getClienteById(
  id: string,
  token: string
): Promise<{ data: Cliente | null; error: string | null }> {
  const { data, error } = await api.get<Cliente>(`/clientes/${id}`, {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function getClientesAtivos(
  token: string
): Promise<{ data: Cliente[] | null; error: string | null }> {
  const { data, error } = await api.get<Cliente[]>(`/clientes/ativos`, {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function getClienteByCNPJ(
  cnpj: string,
  token: string
): Promise<{ data: Cliente | null; error: string | null }> {
  const { data, error } = await api.get<Cliente>(
    `/clientes/by-cnpj/${cnpj}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getClienteByCPF(
  cpf: string,
  token: string
): Promise<{ data: Cliente | null; error: string | null }> {
  const { data, error } = await api.get<Cliente>(
    `/clientes/by-cpf/${cpf}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function createCliente(
  cliente: Partial<Cliente>,
  token: string
): Promise<{ data: Cliente | null; error: string | null }> {
  const { data, error } = await api.post<Cliente>('/clientes', cliente, {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function updateCliente(
  id: string,
  cliente: Partial<Cliente>,
  token: string
): Promise<{ data: Cliente | null; error: string | null }> {
  const { data, error } = await api.patch<Cliente>(
    `/clientes/${id}`,
    cliente,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function deleteCliente(
  id: string,
  token: string
): Promise<{ error: string | null }> {
  const { error } = await api.delete(`/clientes/${id}`, {
    Authorization: `Bearer ${token}`,
  });

  return { error };
}
