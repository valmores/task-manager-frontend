"use client";

import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await api.post('/users/change-password/', data);
      return response.data;
    },
  });
}
