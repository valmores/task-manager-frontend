export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'on_hold' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  assigned_to: number | null;
  assigned_to_email: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: string;
  due_date: string | null;
  status?: string;
}
