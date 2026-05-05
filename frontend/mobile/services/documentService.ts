import { api } from './api';

export type Document = {
  id: string;
  name: string;
  type: string;
  employeeId?: string;
  equipmentId?: string;
  expiresAt: string;
  issuedAt: string;
  url?: string;
};

export type DocumentStatus = 'valid' | 'warning' | 'expired';

export async function getDocuments(
  token: string,
  filters?: { type?: string; search?: string }
): Promise<{ data: Document[] | null; error: string | null }> {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.search) params.append('search', filters.search);

  const query = params.toString() ? `?${params.toString()}` : '';
  const { data, error } = await api.get<Document[]>(`/documents${query}`, {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function getDocumentStatus(expiresAt: string): Promise<DocumentStatus> {
  const expireDate = new Date(expiresAt);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expireDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'warning';
  return 'valid';
}

export function getStatusColor(status: DocumentStatus): string {
  switch (status) {
    case 'valid':
      return '#22C55E'; // Verde
    case 'warning':
      return '#F59E0B'; // Amarelo
    case 'expired':
      return '#EF4444'; // Vermelho
  }
}

export function getStatusLabel(status: DocumentStatus): string {
  switch (status) {
    case 'valid':
      return 'Válido';
    case 'warning':
      return 'Próximo ao vencimento';
    case 'expired':
      return 'Vencido';
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
