import { api } from './api';
import { Documento } from './types';

export async function getDocumentos(
  token: string,
  skip?: number,
  take?: number
): Promise<{ data: Documento[] | null; error: string | null }> {
  const query = new URLSearchParams();
  if (skip !== undefined) query.append('skip', skip.toString());
  if (take !== undefined) query.append('take', take.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const { data, error } = await api.get<Documento[]>(
    `/documentos${queryString}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getDocumentoById(
  id: string,
  token: string
): Promise<{ data: Documento | null; error: string | null }> {
  const { data, error } = await api.get<Documento>(`/documentos/${id}`, {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function getDocumentosByFuncionario(
  funcionarioId: string,
  token: string
): Promise<{ data: Documento[] | null; error: string | null }> {
  const { data, error } = await api.get<Documento[]>(
    `/documentos/funcionario/${funcionarioId}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getDocumentosByType(
  tipo: string,
  token: string
): Promise<{ data: Documento[] | null; error: string | null }> {
  const { data, error } = await api.get<Documento[]>(
    `/documentos/type/${tipo}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getDocumentosVencidos(
  token: string
): Promise<{ data: Documento[] | null; error: string | null }> {
  const { data, error } = await api.get<Documento[]>(
    `/documentos/status/vencidos`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function getDocumentosProximoVencimento(
  dias: number = 30,
  token: string
): Promise<{ data: Documento[] | null; error: string | null }> {
  const { data, error } = await api.get<Documento[]>(
    `/documentos/status/proximo-vencimento?dias=${dias}`,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function createDocumento(
  documento: Partial<Documento>,
  token: string
): Promise<{ data: Documento | null; error: string | null }> {
  const { data, error } = await api.post<Documento>(
    '/documentos',
    documento,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function updateDocumento(
  id: string,
  documento: Partial<Documento>,
  token: string
): Promise<{ data: Documento | null; error: string | null }> {
  const { data, error } = await api.patch<Documento>(
    `/documentos/${id}`,
    documento,
    {
      Authorization: `Bearer ${token}`,
    }
  );

  return { data, error };
}

export async function deleteDocumento(
  id: string,
  token: string
): Promise<{ error: string | null }> {
  const { error } = await api.delete(`/documentos/${id}`, {
    Authorization: `Bearer ${token}`,
  });

  return { error };
}
