import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

export type { User };

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setAuth: (user: User, access: string, refresh: string) => void;
  setHydrated: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isHydrated: false,
      setAuth: (user, access, refresh) => {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        set({ user, accessToken: access, refreshToken: refresh });
      },
      setHydrated: () => set({ isHydrated: true }),
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({ user: null, accessToken: null, refreshToken: null, isHydrated: true });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
