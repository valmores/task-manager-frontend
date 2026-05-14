'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, CreateTaskData } from '@/types/task';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/services/task-service';

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateTaskData> }) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
