import React, { createContext, useContext, useState, ReactNode } from 'react';
import { router } from 'expo-router';
import { login as authLogin } from '../services/authService';
import { getFuncionarioMe, Funcionario } from '../services/funcionariosService';

type AuthContextData = {
  token: string | null;
  userEmail: string | null;
  funcionario: Funcionario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);

  async function login(email: string, password: string) {
    const result = await authLogin(email, password);

    if (!result.success || !result.data) {
      return { success: false, message: result.message };
    }

    const accessToken = result.data.session.access_token;
    const emailValue = result.data.user.email ?? email;

    setToken(accessToken);
    setUserEmail(emailValue);

    const { data: func } = await getFuncionarioMe(accessToken);
    if (func) {
      setFuncionario(func);
    }

    return { success: true, message: 'Login realizado com sucesso!' };
  }

  function logout() {
    setToken(null);
    setUserEmail(null);
    setFuncionario(null);
    router.replace('/auth');
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        userEmail,
        funcionario,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
