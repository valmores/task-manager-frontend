import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInternalNotesStore } from '../../store/useInternalNotesStore';
import { internalNotesService } from '@/lib/services/internalNotesService';

export const useMessages = () => {
  const queryClient = useQueryClient();
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

  // Create Message Mutation
  const createMessageMutation = useMutation({
    mutationFn: ({ roomId, content }: { roomId: number; content: string }) => 
      internalNotesService.createMessage(roomId, content),
    onSuccess: () => {
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
    loading: loadingMessages || createMessageMutation.isPending || updateMessageMutation.isPending || deleteMessageMutation.isPending,
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
