import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternalNotesStore } from '../../store/useInternalNotesStore';
import { internalNotesService } from '@/lib/services/internalNotesService';
import { InternalNote } from '@/types/internal-notes';
import { useAuthStore } from '@/store/useAuthStore';

export const useMessages = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const { 
    selectedRoomId,
    setMessages 
  } = useInternalNotesStore();

  // Fetch Messages with React Query
  const { 
    data: messages = [], 
    isLoading: loadingMessages, 
    isError: isMessagesError,
    error: messagesError,
    refetch: getMessages
  } = useQuery({
    queryKey: ['internal-notes-messages', selectedRoomId],
    queryFn: async () => {
      if (!selectedRoomId) return [];
      const response = await internalNotesService.getMessages(selectedRoomId);
      // Sync with store for components still relying on it
      setMessages(response);
      return response;
    },
    enabled: !!selectedRoomId,
  });

  // Create Message Mutation with Optimistic Updates
  const createMessageMutation = useMutation({
    mutationFn: ({ roomId, content }: { roomId: number; content: string }) => 
      internalNotesService.createMessage(roomId, content),
    
    // When mutate is called:
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['internal-notes-messages', selectedRoomId] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<InternalNote[]>(['internal-notes-messages', selectedRoomId]);

      // Optimistically update to the new value
      if (previousMessages) {
        const optimisticMessage: InternalNote = {
          id: -Date.now(), // Temporary ID
          content: newMessage.content,
          room: newMessage.roomId,
          author: currentUser?.id || 0, 
          author_email: currentUser?.email || 'You',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_edited: false,
        };
        
        queryClient.setQueryData(['internal-notes-messages', selectedRoomId], [...previousMessages, optimisticMessage]);
      }

      // Return a context object with the snapshotted value
      return { previousMessages };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['internal-notes-messages', selectedRoomId], context.previousMessages);
      }
    },

    // Always refetch after error or success to keep server in sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-notes-messages', selectedRoomId] });
    }
  });

  // Update Message Mutation
  const updateMessageMutation = useMutation({
    mutationFn: ({ messageId, content }: { messageId: number; content: string }) => 
      internalNotesService.updateMessage(messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-notes-messages', selectedRoomId] });
    }
  });

  // Delete Message Mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: number) => internalNotesService.deleteMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internal-notes-messages', selectedRoomId] });
    }
  });

  return {
    messages,
    loading: loadingMessages, // Don't include mutation pending here for smoother UI
    isSubmitting: createMessageMutation.isPending,
    error: isMessagesError ? (messagesError as Error).message : null,
    getMessages,
    createMessage: (roomId: number, content: string) => 
      createMessageMutation.mutateAsync({ roomId, content }),
    updateMessage: (messageId: number, content: string) => 
      updateMessageMutation.mutateAsync({ messageId, content }),
    deleteMessage: (messageId: number) => 
      deleteMessageMutation.mutateAsync(messageId),
  };
};
