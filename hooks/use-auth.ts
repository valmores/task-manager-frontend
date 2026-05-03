"use client";

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { AxiosError } from 'axios';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: async ({ email, password }: Record<string, string>) => {
      const loginRes = await api.post('/users/login/', { email, password });
      const { access, refresh } = loginRes.data;

      // Get user profile info
      const profileRes = await api.get('/users/user-profile/', {
        headers: { Authorization: `Bearer ${access}` }
      });

      return { profile: profileRes.data, access, refresh };
    },
    onSuccess: (data) => {
      setAuth(data.profile, data.access, data.refresh);
      router.push('/dashboard');
    },
  });

  const errorMsg = mutation.error 
    ? (mutation.error as AxiosError<{ detail?: string }>).response?.data?.detail || 'Invalid email or password'
    : null;

  return {
    ...mutation,
    errorMsg
  };
}
