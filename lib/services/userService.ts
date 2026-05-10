import api from '@/lib/api';
import { UserOption, AdminUser } from '@/types/task';

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

/**
 * Fetch the list of users available for assignment (admin/project_owner only).
 */
export async function getUsers(): Promise<UserOption[]> {
  const response = await api.get<UserOption[]>('/users/list/');
  return response.data;
}

/**
 * Fetch ALL active users across all roles (for room member selection).
 * Admin and Project Owner only.
 */
export async function getAllUsers(): Promise<UserOption[]> {
  const response = await api.get<UserOption[]>('/users/all/');
  return response.data;
}

/**
 * Fetch all users for admin management.
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await api.get<AdminUser[]>('/users/admin/');
  return response.data;
}

/**
 * Create a new user as an admin.
 */
export async function createAdminUser(data: Partial<AdminUser>): Promise<AdminUser> {
  const response = await api.post<AdminUser>('/users/admin/', data);
  return response.data;
}

/**
 * Update an existing user as an admin.
 */
export async function updateAdminUser(id: number, data: Partial<AdminUser>): Promise<AdminUser> {
  const response = await api.patch<AdminUser>(`/users/admin/${id}/`, data);
  return response.data;
}

/**
 * Deactivate (soft-delete) a user as an admin.
 */
export async function deactivateUser(id: number): Promise<AdminUser> {
  const response = await api.delete<AdminUser>(`/users/admin/${id}/`);
  return response.data;
}

/**
 * Change the current user's password.
 */
export async function changePassword(data: ChangePasswordPayload): Promise<void> {
  await api.post('/users/change-password/', data);
}
