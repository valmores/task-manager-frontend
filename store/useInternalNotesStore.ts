import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Pure UI state for the Internal Notes feature.
 * Server data (rooms, messages) is owned exclusively by React Query.
 * This store only tracks which room the user has selected.
 */
interface InternalNotesState {
  selectedRoomId: number | null;
  setSelectedRoomId: (id: number | null) => void;
}

export const useInternalNotesStore = create<InternalNotesState>()(
  persist(
    (set) => ({
      selectedRoomId: null,
      setSelectedRoomId: (selectedRoomId) => set({ selectedRoomId }),
    }),
    {
      name: 'internal-notes-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
