import api from '@/lib/api';

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

// Must match the User interface in useAuthStore to satisfy setAuth's type
export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'project_owner' | 'user';
}

/**
 * Authenticate a user and return their profile + tokens.
 */
export async function login(email: string, password: string): Promise<{ profile: UserProfile; access: string; refresh: string }> {
  const loginRes = await api.post<AuthTokens>('/users/login/', { email, password });
  const { access, refresh } = loginRes.data;

  const profileRes = await api.get<UserProfile>('/users/user-profile/', {
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
