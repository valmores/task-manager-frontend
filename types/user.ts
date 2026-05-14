/**
 * Core user identity — returned by the auth endpoint and persisted in Zustand.
 */
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'project_owner' | 'user';
}

/**
 * Lightweight user reference used in dropdowns and assignment selectors.
 */
export interface UserOption {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

/**
 * Full user record used by the admin management panel.
 */
export interface AdminUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'project_owner' | 'user';
  is_active: boolean;
  date_joined: string;
}
