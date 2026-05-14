'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import { AxiosError } from 'axios';
import { login, register } from '@/lib/services/auth-service';

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const mutation = useMutation({
    mutationFn: ({ email, password }: Record<string, string>) =>
      login(email, password),
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
    mutationFn: ({ first_name, last_name, email, password }: Record<string, string>) =>
      register({ first_name, last_name, email, password }),
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
