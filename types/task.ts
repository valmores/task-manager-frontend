export interface Project {
  id: number;
  name: string;
  description?: string;
  task_count?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'on_hold' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  assigned_to: number | null;
  assigned_to_email: string | null;
  project: number | null;
  project_name: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  notes?: TaskNote[];
}

export interface TaskNote {
  id: number;
  task: number;
  author: number;
  author_email: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: string;
  due_date: string | null;
  status?: string;
}

export interface UserOption {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'project_owner' | 'user';
  is_active: boolean;
  date_joined: string;
}
