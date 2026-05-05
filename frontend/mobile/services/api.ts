const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

type ApiResponse<T = unknown> = {
  data: T | null;
  error: string | null;
  status: number;
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  headers?: Record<string, string>,
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: json.message ?? 'Erro inesperado. Tente novamente.',
        status: response.status,
      };
    }

    return { data: json as T, error: null, status: response.status };
  } catch {
    return {
      data: null,
      error: 'Não foi possível conectar ao servidor.',
      status: 0,
    };
  }
}

export const api = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>('GET', path, undefined, headers),

  post: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>('POST', path, body, headers),

  put: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>('PUT', path, body, headers),

  patch: <T>(path: string, body: unknown, headers?: Record<string, string>) =>
    request<T>('PATCH', path, body, headers),

  delete: <T>(path: string, headers?: Record<string, string>) =>
    request<T>('DELETE', path, undefined, headers),
};
