import { api } from './api';

export type UserProfile = {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  phone?: string;
  createdAt: string;
};

export async function getProfile(token: string): Promise<{ data: UserProfile | null; error: string | null }> {
  const { data, error } = await api.get<UserProfile>('/users/profile', {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function updateProfile(
  token: string,
  profile: Partial<UserProfile>
): Promise<{ data: UserProfile | null; error: string | null }> {
  const { data, error } = await api.patch<UserProfile>('/users/profile', profile, {
    Authorization: `Bearer ${token}`,
  });

  return { data, error };
}

export async function logout(token: string): Promise<{ error: string | null }> {
  const { error } = await api.post('/auth/logout', {}, {
    Authorization: `Bearer ${token}`,
  });

  return { error };
}
