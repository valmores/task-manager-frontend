import api from '@/lib/api';
import { Task, CreateTaskData } from '@/types/task';

/**
 * Fetch all tasks accessible by the current user.
 */
export async function getTasks(): Promise<Task[]> {
  const response = await api.get<Task[]>('/tasks/');
  return response.data;
}

/**
 * Create a new task.
 */
export async function createTask(data: CreateTaskData): Promise<Task> {
  const response = await api.post<Task>('/tasks/', data);
  return response.data;
}

/**
 * Partially update an existing task.
 */
export async function updateTask(id: number, data: Partial<CreateTaskData>): Promise<Task> {
  const response = await api.patch<Task>(`/tasks/${id}/`, data);
  return response.data;
}

/**
 * Delete a task by ID.
 */
export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}/`);
}
