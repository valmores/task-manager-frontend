"use client";

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { UserOption } from '@/types/task';
import { useAuthStore } from '@/store/useAuthStore';

export function useUsers() {
  const { user } = useAuthStore();
  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'project_owner';

  return useQuery<UserOption[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users/list/');
      return response.data;
    },
    enabled: !!user && isAdminOrOwner,
  });
}
