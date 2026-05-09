import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskNote } from '@/types/task';
import { createNote, CreateNotePayload } from '@/lib/services/taskNoteService';

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation<TaskNote, Error, CreateNotePayload>({
    mutationFn: (data) => createNote(data),
    onSuccess: (_, variables) => {
      // Invalidate both tasks and any specific note queries
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task', variables.task] });
    },
  });
};
