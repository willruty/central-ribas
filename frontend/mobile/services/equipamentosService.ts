import { api } from './api';

export type Equipamento = {
  id: string;
  categoria_id: string;
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

export async function getEquipamentos(
  token: string,
  skip?: number,
  take?: number
): Promise<{ data: Equipamento[] | null; error: string | null }> {
  const query = new URLSearchParams();
  if (skip !== undefined) query.append('skip', skip.toString());
  if (take !== undefined) query.append('take', take.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const { data, error } = await api.get<Equipamento[]>(
    `/equipamentos${queryString}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getEquipamentoById(
  id: string,
  token: string
): Promise<{ data: Equipamento | null; error: string | null }> {
  const { data, error } = await api.get<Equipamento>(`/equipamentos/${id}`, {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function getEquipamentosAtivos(
  token: string
): Promise<{ data: Equipamento[] | null; error: string | null }> {
  const { data, error } = await api.get<Equipamento[]>(
    `/equipamentos/ativos`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getEquipamentosByStatus(
  status: string,
  token: string
): Promise<{ data: Equipamento[] | null; error: string | null }> {
  const { data, error } = await api.get<Equipamento[]>(
    `/equipamentos/status/${status}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function createEquipamento(
  equipamento: Partial<Equipamento>,
  token: string
): Promise<{ data: Equipamento | null; error: string | null }> {
  const { data, error } = await api.post<Equipamento>(
    '/equipamentos',
    equipamento,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function updateEquipamento(
  id: string,
  equipamento: Partial<Equipamento>,
  token: string
): Promise<{ data: Equipamento | null; error: string | null }> {
  const { data, error } = await api.patch<Equipamento>(
    `/equipamentos/${id}`,
    equipamento,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function deleteEquipamento(
  id: string,
  token: string
): Promise<{ error: string | null }> {
  const { error } = await api.delete(`/equipamentos/${id}`, {
    Authorization: `Bearer ${token}`,
  });

  return { error };
}
