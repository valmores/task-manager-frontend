import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@/lib/services/user-service';
import { UserOption } from '@/types/task';

export const useAllUsers = () => {
  const { data, isLoading, isError, error } = useQuery<UserOption[]>({
    queryKey: ['all-users'],
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes — user list changes rarely
  });

  return {
    users: data ?? [],
    isLoading,
    isError,
    error: isError ? (error as Error).message : null,
  };
};
