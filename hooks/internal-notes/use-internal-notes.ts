import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternalNotesStore } from '../../store/use-internal-notes-store';
import { NoteRoom } from '../../types/internal-notes';
import { getRooms, createRoom, updateRoom, deleteRoom } from '@/lib/services/internal-notes-service';

export const useInternalNotes = () => {
  const queryClient = useQueryClient();
  const { selectedRoomId, setSelectedRoomId } = useInternalNotesStore();

  // React Query is the single source of truth for room data
  const {
    data: rooms = [],
    isLoading: loadingRooms,
    isError: isRoomsError,
    error: roomsError,
    refetch: refetchRooms,
  } = useQuery({
    queryKey: ['internal-notes-rooms'],
    queryFn: () => getRooms(),
  });

  // Create Room Mutation
  const createRoomMutation = useMutation({
    mutationFn: (data: Partial<NoteRoom>) => createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-notes-rooms'] });
    },
  });

  // Update Room Mutation
  const updateRoomMutation = useMutation({
    mutationFn: ({ roomId, data }: { roomId: number; data: Partial<NoteRoom> }) =>
      updateRoom(roomId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-notes-rooms'] });
    },
  });

  // Delete Room Mutation
  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: number) => deleteRoom(roomId),
    onSuccess: (_, roomId) => {
      queryClient.invalidateQueries({ queryKey: ['internal-notes-rooms'] });
      if (selectedRoomId === roomId) {
        setSelectedRoomId(null);
      }
    },
  });

  const selectRoom = useCallback(
    (roomId: number | null) => {
      setSelectedRoomId(roomId);
    },
    [setSelectedRoomId]
  );

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  return {
    rooms,
    selectedRoom,
    loading:
      loadingRooms ||
      createRoomMutation.isPending ||
      updateRoomMutation.isPending ||
      deleteRoomMutation.isPending,
    error: isRoomsError ? (roomsError as Error).message : null,
    getRooms: refetchRooms,
    selectRoom,
    createRoom: (data: Partial<NoteRoom>) => createRoomMutation.mutateAsync(data),
    updateRoom: (roomId: number, data: Partial<NoteRoom>) =>
      updateRoomMutation.mutateAsync({ roomId, data }),
    deleteRoom: (roomId: number) => deleteRoomMutation.mutateAsync(roomId),
  };
};
