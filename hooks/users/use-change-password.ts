'use client';

import { useMutation } from '@tanstack/react-query';
import { changePassword, ChangePasswordPayload } from '@/lib/services/userService';

export function useChangePassword() {
  return useMutation<void, Error, ChangePasswordPayload>({
    mutationFn: (data) => changePassword(data),
  });
}
