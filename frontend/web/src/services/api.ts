const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Headers = Record<string, string>;

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

async function request<T>(
  method: string,
  endpoint: string,
  headers?: Headers,
  body?: unknown
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      return {
        data: null,
        error: `${response.status} ${response.statusText}${errorBody ? `: ${errorBody}` : ""}`,
      };
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      return { data, error: null };
    }

    return { data: null, error: null };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err.message : "Erro desconhecido",
    };
  }
}

export const api = {
  get<T>(endpoint: string, headers?: Headers) {
    return request<T>("GET", endpoint, headers);
  },

  post<T>(endpoint: string, data: unknown, headers?: Headers) {
    return request<T>("POST", endpoint, headers, data);
  },

  put<T>(endpoint: string, data: unknown, headers?: Headers) {
    return request<T>("PUT", endpoint, headers, data);
  },

  patch<T>(endpoint: string, data: unknown, headers?: Headers) {
    return request<T>("PATCH", endpoint, headers, data);
  },

  delete<T>(endpoint: string, headers?: Headers) {
    return request<T>("DELETE", endpoint, headers);
  },
};
