'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, CreateTaskData } from '@/types/task';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/services/task-service';
import { getProjectTasks } from '@/lib/services/project-service';

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });
}

export function useProjectTasks(projectId: number, enabled = true) {
  return useQuery<Task[]>({
    queryKey: ['tasks', 'project', projectId],
    queryFn: () => getProjectTasks(projectId),
    enabled,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTaskData) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
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
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
