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

  const errorData = (mutation.error as AxiosError<Record<string, string[] | string>>)?.response?.data;

  return {
    ...mutation,
    errorMsg,
    errorData,
  };
}

export function useRegister() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async ({ first_name, last_name, email, password }: Record<string, string>) => {
      await api.post('/users/register/', { first_name, last_name, email, password });
    },
    onSuccess: () => {
      router.push('/login?registered=true');
    },
  });

  const errorMsg = mutation.error 
    ? (mutation.error as AxiosError<{ detail?: string }>).response?.data?.detail || 'Registration failed. Please try again.'
    : null;

  const errorData = (mutation.error as AxiosError<Record<string, string[] | string>>)?.response?.data;

  return {
    ...mutation,
    errorMsg,
    errorData,
  };
}
