import { useCallback } from 'react';
import { useInternalNotesStore } from '../../store/useInternalNotesStore';
import { NoteRoom, RoomVisibility } from '../../types/internal-notes';
import { STUB_ROOMS } from '@/lib/stub-internal-notes';

export const useInternalNotes = () => {
  const { 
    rooms, 
    selectedRoomId, 
    loading, 
    error, 
    setRooms, 
    setSelectedRoomId, 
    setLoading, 
    setError,
    getSelectedRoom
  } = useInternalNotesStore();

  const getRooms = useCallback(async () => {
    setLoading('loading');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRooms(STUB_ROOMS);
      setLoading('success');
    } catch (err) {
      setError('Failed to fetch rooms');
      setLoading('error');
    }
  }, [setRooms, setLoading, setError]);

  const selectRoom = useCallback((roomId: number | null) => {
    setSelectedRoomId(roomId);
  }, [setSelectedRoomId]);

  const createRoom = useCallback(async (data: Partial<NoteRoom>) => {
    setLoading('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
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
      setRooms([...rooms, newRoom]);
      setLoading('success');
      return newRoom;
    } catch (err) {
      setError('Failed to create room');
      setLoading('error');
    }
  }, [rooms, setRooms, setLoading, setError]);

  const deleteRoom = useCallback(async (roomId: number) => {
    setLoading('loading');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setRooms(rooms.filter((r) => r.id !== roomId));
      if (selectedRoomId === roomId) {
        setSelectedRoomId(null);
      }
      setLoading('success');
    } catch (err) {
      setError('Failed to delete room');
      setLoading('error');
    }
  }, [rooms, selectedRoomId, setRooms, setSelectedRoomId, setLoading, setError]);

  return {
    rooms,
    selectedRoom: getSelectedRoom(),
    loading,
    error,
    getRooms,
    selectRoom,
    createRoom,
    deleteRoom
  };
};
