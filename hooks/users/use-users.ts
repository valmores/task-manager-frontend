'use client';

import { useQuery } from '@tanstack/react-query';
import { UserOption } from '@/types/task';
import { useAuthStore } from '@/store/useAuthStore';
import { getUsers } from '@/lib/services/userService';

export function useUsers() {
  const { user } = useAuthStore();
  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'project_owner';

  return useQuery<UserOption[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: !!user && isAdminOrOwner,
  });
}
