"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { UserOption } from '@/types/task';

export function useUsers() {
  return useQuery<UserOption[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users/list/');
      return response.data;
    },
  });
}
