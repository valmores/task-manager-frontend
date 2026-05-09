import api from '@/lib/api';
import { NoteRoom, InternalNote } from '@/types/internal-notes';

class InternalNotesService {
  /**
   * Fetch all rooms accessible by the user.
   */
  async getRooms(): Promise<NoteRoom[]> {
    const response = await api.get<NoteRoom[]>('/internal/rooms/');
    return response.data || [];
  }

  /**
   * Create a new internal note room.
   */
  async createRoom(data: Partial<NoteRoom>): Promise<NoteRoom> {
    const response = await api.post<NoteRoom>('/internal/rooms/create/', data);
    return response.data;
  }

  /**
   * Delete an internal note room.
   */
  async deleteRoom(roomId: number): Promise<void> {
    await api.delete(`/internal/rooms/${roomId}/delete/`);
  }

  /**
   * Fetch messages for a specific room.
   */
  async getMessages(roomId: number): Promise<InternalNote[]> {
    const response = await api.get<InternalNote[]>(`/internal/rooms/${roomId}/messages/`);
    return response.data || [];
  }

  /**
   * Post a new message to a room.
   */
  async createMessage(roomId: number, content: string): Promise<InternalNote> {
    const response = await api.post<InternalNote>(`/internal/rooms/${roomId}/messages/`, { 
      content,
      room: roomId 
    });
    return response.data;
  }

  /**
   * Update an existing message.
   */
  async updateMessage(messageId: number, content: string): Promise<InternalNote> {
    const response = await api.patch<InternalNote>(`/internal/messages/${messageId}/`, { content });
    return response.data;
  }

  /**
   * Delete a message.
   */
  async deleteMessage(messageId: number): Promise<void> {
    await api.delete(`/internal/messages/${messageId}/`);
  }
}

export const internalNotesService = new InternalNotesService();
