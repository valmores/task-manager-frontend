import api from '@/lib/api';
import { User } from '@/types/user';

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

/**
 * Authenticate a user and return their profile + tokens.
 */
export async function login(email: string, password: string): Promise<{ profile: User; access: string; refresh: string }> {
  const loginRes = await api.post<AuthTokens>('/users/login/', { email, password });
  const { access, refresh } = loginRes.data;

  const profileRes = await api.get<User>('/users/user-profile/', {
    headers: { Authorization: `Bearer ${access}` },
  });

  return { profile: profileRes.data, access, refresh };
}

/**
 * Register a new user account.
 */
export async function register(payload: RegisterPayload): Promise<void> {
  await api.post('/users/register/', payload);
}
