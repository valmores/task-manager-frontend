import api from '../api';
import { NoteRoom, InternalNote, APIResponse, RoomVisibility } from '../../types/internal-notes';
import { STUB_ROOMS, STUB_MESSAGES } from '../stub-internal-notes';


class InternalNotesService {
  async getRooms(): Promise<APIResponse<NoteRoom[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: STUB_ROOMS };
  }

  async createRoom(data: Partial<NoteRoom>): Promise<APIResponse<NoteRoom>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRoom: NoteRoom = {
      id: Math.floor(Math.random() * 10000),
      name: data.name || 'New Room',
      visibility: data.visibility || RoomVisibility.INTERNAL,
      created_by: 1,
      created_by_email: 'admin@example.com',
      project: data.project || null,
      project_name: data.project ? 'Project Alpha' : null,
      members: [1],
      created_at: new Date().toISOString(),
      is_default: false,
    };
    return { data: newRoom };
  }

  async deleteRoom(roomId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getMessages(roomId: number): Promise<APIResponse<InternalNote[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = STUB_MESSAGES.filter(m => m.room === roomId);
    return { data: filtered };
  }

  async createMessage(roomId: number, content: string): Promise<APIResponse<InternalNote>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMessage: InternalNote = {
      id: Math.floor(Math.random() * 10000),
      room: roomId,
      author: 1,
      author_email: 'admin@example.com',
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_edited: false,
    };
    return { data: newMessage };
  }

  async updateMessage(messageId: number, content: string): Promise<APIResponse<InternalNote>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = STUB_MESSAGES.find(m => m.id === messageId);
    return {
      data: {
        ...(existing || STUB_MESSAGES[0]),
        id: messageId,
        content,
        is_edited: true,
        updated_at: new Date().toISOString()
      }
    };
  }

  async deleteMessage(messageId: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

export const internalNotesService = new InternalNotesService();
