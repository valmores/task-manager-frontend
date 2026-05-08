import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternalNotesStore } from '../../store/useInternalNotesStore';
import { NoteRoom } from '../../types/internal-notes';
import { internalNotesService } from '@/lib/internal-notes/internalNotesService';

export const useInternalNotes = () => {
  const queryClient = useQueryClient();
  const { 
    selectedRoomId, 
    setSelectedRoomId, 
    getSelectedRoom,
    setRooms
  } = useInternalNotesStore();

  // Fetch Rooms with React Query
  const { 
    data: rooms = [], 
    isLoading: loadingRooms, 
    isError: isRoomsError,
    error: roomsError,
    refetch: getRooms
  } = useQuery({
    queryKey: ['internal-notes-rooms'],
    queryFn: async () => {
      const response = await internalNotesService.getRooms();
      // Sync with store for components still relying on it
      setRooms(response.data);
      return response.data;
    }
  });

  // Create Room Mutation
  const createRoomMutation = useMutation({
    mutationFn: (data: Partial<NoteRoom>) => internalNotesService.createRoom(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['internal-notes-rooms'] });
      return response.data;
    }
  });

  // Delete Room Mutation
  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: number) => internalNotesService.deleteRoom(roomId),
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: ['internal-notes-rooms'] });
      if (selectedRoomId === roomId) {
        setSelectedRoomId(null);
      }
    }
  });

  const selectRoom = useCallback((roomId: number | null) => {
    setSelectedRoomId(roomId);
  }, [setSelectedRoomId]);

  return {
    rooms,
    selectedRoom: getSelectedRoom(),
    loading: loadingRooms || createRoomMutation.isPending || deleteRoomMutation.isPending,
    error: isRoomsError ? (roomsError as Error).message : null,
    getRooms,
    selectRoom,
    createRoom: (data: Partial<NoteRoom>) => createRoomMutation.mutateAsync(data),
    deleteRoom: (roomId: number) => deleteRoomMutation.mutateAsync(roomId)
  };
};
