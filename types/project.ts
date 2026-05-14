export interface Project {
  id: number;
  name: string;
  description?: string;
  task_count?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
}
