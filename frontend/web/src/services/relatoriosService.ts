import { api } from './api';
import { ResumoRelatorio } from './types';

export async function getResumo(
  token: string
): Promise<{ data: ResumoRelatorio | null; error: string | null }> {
  const { data, error } = await api.get<ResumoRelatorio>('/relatorios/resumo', {
    Authorization: `Bearer ${token}`,
  });
  return { data, error };
}
