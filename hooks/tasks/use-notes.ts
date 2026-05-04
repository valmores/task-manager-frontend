import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { TaskNote } from '@/types/task';

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { task: number; content: string }) => {
      const response = await api.post<TaskNote>('/tasks/notes/', data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate both tasks and any specific note queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.task] });
    },
  });
};
