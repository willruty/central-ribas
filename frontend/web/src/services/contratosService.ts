import { api } from './api';
import { Contrato } from './types';

export async function getContratos(
  token: string,
  skip?: number,
  take?: number
): Promise<{ data: Contrato[] | null; error: string | null }> {
  const query = new URLSearchParams();
  if (skip !== undefined) query.append('skip', skip.toString());
  if (take !== undefined) query.append('take', take.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const { data, error } = await api.get<Contrato[]>(
    `/contratos${queryString}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getContratoById(
  id: string,
  token: string
): Promise<{ data: Contrato | null; error: string | null }> {
  const { data, error } = await api.get<Contrato>(`/contratos/${id}`, {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function getContratosByCliente(
  clienteId: string,
  token: string
): Promise<{ data: Contrato[] | null; error: string | null }> {
  const { data, error } = await api.get<Contrato[]>(
    `/contratos/cliente/${clienteId}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getContratosByStatus(
  status: string,
  token: string
): Promise<{ data: Contrato[] | null; error: string | null }> {
  const { data, error } = await api.get<Contrato[]>(
    `/contratos/status/${status}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getContratosAtivos(
  token: string
): Promise<{ data: Contrato[] | null; error: string | null }> {
  const { data, error } = await api.get<Contrato[]>(
    `/contratos/ativos`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getContratosProximoVencimento(
  dias: number = 30,
  token: string
): Promise<{ data: Contrato[] | null; error: string | null }> {
  const { data, error } = await api.get<Contrato[]>(
    `/contratos/status/proximo-vencimento?dias=${dias}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function createContrato(
  contrato: Partial<Contrato>,
  token: string
): Promise<{ data: Contrato | null; error: string | null }> {
  const { data, error } = await api.post<Contrato>(
    '/contratos',
    contrato,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function updateContrato(
  id: string,
  contrato: Partial<Contrato>,
  token: string
): Promise<{ data: Contrato | null; error: string | null }> {
  const { data, error } = await api.patch<Contrato>(
    `/contratos/${id}`,
    contrato,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function deleteContrato(
  id: string,
  token: string
): Promise<{ error: string | null }> {
  const { error } = await api.delete(`/contratos/${id}`, {
    Authorization: `Bearer ${token}`,
  });

  return { error };
}
