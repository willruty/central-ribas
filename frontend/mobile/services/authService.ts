import { api } from './api';

type LoginData = {
  user: {
    id: string;
    email: string | undefined;
  };
  session: {
    access_token: string;
    expires_at: number | undefined;
  };
};

type AuthResult = {
  success: boolean;
  message: string;
  data: LoginData | null;
};

export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  const { data, error } = await api.post<LoginData>('/auth/login', {
    email,
    password,
  });

  if (error || !data) {
    return {
      success: false,
      message: error ?? 'Erro ao realizar login.',
      data: null,
    };
  }

  return {
    success: true,
    message: 'Login realizado com sucesso!',
    data,
  };
}
