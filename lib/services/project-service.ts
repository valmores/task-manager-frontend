import api from '@/lib/api';
import { Project, CreateProjectData } from '@/types/task';

/**
 * Fetch all projects accessible by the current user.
 */
export async function getProjects(): Promise<Project[]> {
  const response = await api.get<Project[]>('/tasks/projects/');
  return response.data;
}

/**
 * Create a new project.
 */
export async function createProject(data: CreateProjectData): Promise<Project> {
  const response = await api.post<Project>('/tasks/projects/', data);
  return response.data;
}

/**
 * Partially update an existing project.
 */
export async function updateProject(id: number, data: Partial<CreateProjectData>): Promise<Project> {
  const response = await api.patch<Project>(`/tasks/projects/${id}/`, data);
  return response.data;
}

/**
 * Delete a project by ID.
 */
export async function deleteProject(id: number): Promise<void> {
  await api.delete(`/tasks/projects/${id}/`);
}
