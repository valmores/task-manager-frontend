import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternalNotesStore } from '../../store/use-internal-notes-store';
import { getMessages, createMessage, updateMessage, deleteMessage } from '@/lib/services/internal-notes-service';
import { InternalNote } from '@/types/internal-notes';
import { useAuthStore } from '@/store/use-auth-store';

export const useMessages = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const { selectedRoomId } = useInternalNotesStore();

  // React Query is the single source of truth for message data
  const {
    data: messages = [],
    isLoading: loadingMessages,
    isError: isMessagesError,
    error: messagesError,
    refetch: refetchMessages,
  } = useQuery({
    queryKey: ['internal-notes-messages', selectedRoomId],
    queryFn: () => getMessages(selectedRoomId!),
    enabled: !!selectedRoomId,
  });

  // Create Message Mutation with Optimistic Updates
  const createMessageMutation = useMutation({
    mutationFn: ({ roomId, content }: { roomId: number; content: string }) =>
      createMessage(roomId, content),

    // Cancel any outgoing refetches so they don't overwrite our optimistic update
    onMutate: async (newMessage) => {
      const { roomId, content } = newMessage;
      await queryClient.cancelQueries({ queryKey: ['internal-notes-messages', roomId] });

      const previousMessages = queryClient.getQueryData<InternalNote[]>([
        'internal-notes-messages',
        roomId,
      ]);

      if (previousMessages) {
        const optimisticMessage: InternalNote = {
          id: -Date.now(), // Temporary negative ID
          content: content,
          room: roomId,
          author: currentUser?.id || 0,
          author_email: currentUser?.email || 'You',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_edited: false,
        };

        queryClient.setQueryData(
          ['internal-notes-messages', roomId],
          [...previousMessages, optimisticMessage]
        );
      }

      return { previousMessages, roomId };
    },

    // Roll back on error
    onError: (_err, _newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ['internal-notes-messages', context.roomId],
          context.previousMessages
        );
      }
    },

    // Always sync with server after settle
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['internal-notes-messages', variables.roomId] });
    },
  });

  // Update Message Mutation
  const updateMessageMutation = useMutation({
    mutationFn: ({ messageId, content }: { messageId: number; content: string }) =>
      updateMessage(messageId, content),
    onSuccess: (_data, variables) => {
      // We still need the roomId to invalidate the correct list. 
      // Since we don't have roomId in update variables, we fallback to store but with a check
      queryClient.invalidateQueries({ queryKey: ['internal-notes-messages', selectedRoomId] });
    },
  });

  // Delete Message Mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: number) => deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-notes-messages', selectedRoomId] });
    },
  });

  return {
    messages,
    loading: loadingMessages,
    isSubmitting: createMessageMutation.isPending,
    error: isMessagesError ? (messagesError as Error).message : null,
    getMessages: refetchMessages,
    createMessage: (roomId: number, content: string) =>
      createMessageMutation.mutateAsync({ roomId, content }),
    updateMessage: (messageId: number, content: string) =>
      updateMessageMutation.mutateAsync({ messageId, content }),
    deleteMessage: (messageId: number) => deleteMessageMutation.mutateAsync(messageId),
  };
};
