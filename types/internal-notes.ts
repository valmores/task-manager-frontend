export enum RoomVisibility {
  ADMIN_ONLY = 'admin_only',
  INTERNAL = 'internal',
  PROJECT_SPECIFIC = 'project_specific',
  PRIVATE = 'private',
}

export interface UserInfo {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
}

export interface NoteRoom {
  id: number;
  name: string;
  visibility: RoomVisibility;
  created_by: number;
  created_by_email?: string;
  project: number | null;
  project_name?: string | null;
  members: number[];
  members_detail: UserInfo[];
  created_at: string;
  is_default: boolean;
}

export interface InternalNote {
  id: number;
  room: number;
  author: number;
  author_email?: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
}

export interface ErrorResponse {
  error: string;
  details?: Record<string, string[]>;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ErrorState {
  message: string;
  code?: string;
}
