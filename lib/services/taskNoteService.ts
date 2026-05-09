import api from '@/lib/api';
import { TaskNote } from '@/types/task';

export interface CreateNotePayload {
  task: number;
  content: string;
}

/**
 * Create a new note on a task.
 */
export async function createNote(data: CreateNotePayload): Promise<TaskNote> {
  const response = await api.post<TaskNote>('/tasks/notes/', data);
  return response.data;
}
