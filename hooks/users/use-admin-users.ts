'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminUser } from '@/types/task';
import { getAdminUsers, createAdminUser, updateAdminUser, deactivateUser } from '@/lib/services/user-service';

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ['admin-users'],
    queryFn: getAdminUsers,
  });
}

export function useAdminCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdminUser>) => createAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useUpdateAdminUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AdminUser> }) =>
      updateAdminUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}

export function useDeactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });
}
