import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NoteRoom, InternalNote, LoadingState } from '../types/internal-notes';

interface InternalNotesState {
  rooms: NoteRoom[];
  selectedRoomId: number | null;
  messages: InternalNote[];
  loading: LoadingState;
  error: string | null;
  
  setRooms: (rooms: NoteRoom[]) => void;
  setSelectedRoomId: (id: number | null) => void;
  setMessages: (messages: InternalNote[]) => void;
  setLoading: (loading: LoadingState) => void;
  setError: (error: string | null) => void;
  
  // Helpers
  getSelectedRoom: () => NoteRoom | undefined;
}

export const useInternalNotesStore = create<InternalNotesState>()(
  persist(
    (set, get) => ({
      rooms: [],
      selectedRoomId: null,
      messages: [],
      loading: 'idle',
      error: null,
      
      setRooms: (rooms) => set({ rooms }),
      setSelectedRoomId: (selectedRoomId) => set({ selectedRoomId }),
      setMessages: (messages) => set({ messages }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      getSelectedRoom: () => {
        const { rooms, selectedRoomId } = get();
        return rooms.find((r) => r.id === selectedRoomId);
      },
    }),
    {
      name: 'internal-notes-storage',
      partialize: (state) => ({ selectedRoomId: state.selectedRoomId }),
    }
  )
);
