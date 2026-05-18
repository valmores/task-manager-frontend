'use client';

import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '@/lib/services/user-service';
import { useAuthStore } from '@/store/use-auth-store';
import { User } from '@/types/user';

interface UpdateProfilePayload {
  signature?: string | null;
  first_name?: string;
  last_name?: string;
}

export function useUpdateProfile() {
  return useMutation<User, Error, UpdateProfilePayload>({
    mutationFn: (data) => updateProfile(data),
    onSuccess: (updatedUser) => {
      // Direct Zustand mutation to sync local state immediately without full re-login
      useAuthStore.setState((state) => {
        if (!state.user) return state;
        return {
          user: {
            ...state.user,
            ...updatedUser,
          },
        };
      });
    },
  });
}
