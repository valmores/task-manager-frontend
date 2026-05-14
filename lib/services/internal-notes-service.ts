import api from '@/lib/api';
import { NoteRoom, InternalNote } from '@/types/internal-notes';

/**
 * Fetch all rooms accessible by the user.
 */
export async function getRooms(): Promise<NoteRoom[]> {
  const response = await api.get<NoteRoom[]>('/internal/rooms/');
  return response.data || [];
}

/**
 * Create a new internal note room.
 */
export async function createRoom(data: Partial<NoteRoom>): Promise<NoteRoom> {
  const response = await api.post<NoteRoom>('/internal/rooms/create/', data);
  return response.data;
}

/**
 * Update an existing internal note room.
 */
export async function updateRoom(roomId: number, data: Partial<NoteRoom>): Promise<NoteRoom> {
  const response = await api.patch<NoteRoom>(`/internal/rooms/${roomId}/update/`, data);
  return response.data;
}

/**
 * Delete an internal note room.
 */
export async function deleteRoom(roomId: number): Promise<void> {
  await api.delete(`/internal/rooms/${roomId}/delete/`);
}

/**
 * Fetch messages for a specific room.
 */
export async function getMessages(roomId: number): Promise<InternalNote[]> {
  const response = await api.get<InternalNote[]>(`/internal/rooms/${roomId}/messages/`);
  return response.data || [];
}

/**
 * Post a new message to a room.
 */
export async function createMessage(roomId: number, content: string): Promise<InternalNote> {
  const response = await api.post<InternalNote>(`/internal/rooms/${roomId}/messages/`, { 
    content,
    room: roomId 
  });
  return response.data;
}

/**
 * Update an existing message.
 */
export async function updateMessage(messageId: number, content: string): Promise<InternalNote> {
  const response = await api.patch<InternalNote>(`/internal/messages/${messageId}/`, { content });
  return response.data;
}

/**
 * Update room members (add/remove). Private rooms only.
 * Admin or room creator can call this.
 */
export async function updateMembers(
  roomId: number,
  payload: { add?: number[]; remove?: number[] }
): Promise<NoteRoom> {
  const response = await api.patch<NoteRoom>(`/internal/rooms/${roomId}/members/`, payload);
  return response.data;
}

/**
 * Delete a message.
 */
export async function deleteMessage(messageId: number): Promise<void> {
  await api.delete(`/internal/messages/${messageId}/`);
}

