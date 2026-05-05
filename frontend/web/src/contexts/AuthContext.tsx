import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = 'gr:access_token';
const USER_KEY = 'gr:user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        return { error: body.message || 'Credenciais inválidas' };
      }

      const data = await res.json();
      const accessToken: string = data.session.access_token;
      const userInfo: AuthUser = data.user;

      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
      setToken(accessToken);
      setUser(userInfo);
      return { error: null };
    } catch {
      return { error: 'Erro de conexão com o servidor' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const currentToken = token;
    try {
      if (currentToken) {
        await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/logout`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${currentToken}` },
          }
        );
      }
    } catch {
      // logout server-side é best-effort — o cliente sempre limpa a sessão local
    }
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
