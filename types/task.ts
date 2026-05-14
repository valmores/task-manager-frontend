// ── Re-exports for backward compatibility ──────────────────────────────
// Types that were moved to their own domain files.
// Existing imports from '@/types/task' will continue to work.
export type { Project, CreateProjectData } from './project';
export type { UserOption, AdminUser } from './user';

// ── Task domain types ──────────────────────────────────────────────────

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

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: string;
  due_date: string | null;
  status?: string;
}
