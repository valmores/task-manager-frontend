import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMembers } from '@/lib/services/internal-notes-service';

export interface UpdateMembersPayload {
  add?: number[];
  remove?: number[];
}

export const useRoomMembers = () => {
  const queryClient = useQueryClient();

  const updateMembersMutation = useMutation({
    mutationFn: ({ roomId, payload }: { roomId: number; payload: UpdateMembersPayload }) =>
      updateMembers(roomId, payload),
    onSuccess: () => {
      // Refresh rooms so members_detail stays in sync
      queryClient.invalidateQueries({ queryKey: ['internal-notes-rooms'] });
    },
  });

  return {
    updateMembers: (roomId: number, payload: UpdateMembersPayload) =>
      updateMembersMutation.mutateAsync({ roomId, payload }),
    isLoading: updateMembersMutation.isPending,
    error: updateMembersMutation.error
      ? (updateMembersMutation.error as Error).message
      : null,
  };
};
