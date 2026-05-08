import { useCallback } from 'react';
import { useInternalNotesStore } from '../../store/useInternalNotesStore';
import { InternalNote } from '../../types/internal-notes';
import { STUB_MESSAGES } from '@/lib/stub-internal-notes';

export const useMessages = () => {
  const {
    messages,
    loading,
    error,
    setMessages,
    setLoading,
    setError,
  } = useInternalNotesStore();

  const getMessages = useCallback(async (roomId: number) => {
    setLoading('loading');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const filteredMessages = STUB_MESSAGES.filter((m) => m.room === roomId);
      setMessages(filteredMessages);
      setLoading('success');
    } catch (err) {
      setError('Failed to fetch messages');
      setLoading('error');
    }
  }, [setMessages, setLoading, setError]);

  const createMessage = useCallback(async (roomId: number, content: string) => {
    setLoading('loading');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400));
      const newMessage: InternalNote = {
        id: Math.floor(Math.random() * 10000),
        room: roomId,
        author: 1, // Current user stub
        author_email: 'admin@example.com',
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_edited: false,
      };
      setMessages([...messages, newMessage]);
      setLoading('success');
      return newMessage;
    } catch (err) {
      setError('Failed to send message');
      setLoading('error');
    }
  }, [messages, setMessages, setLoading, setError]);

  const updateMessage = useCallback(async (messageId: number, content: string) => {
    setLoading('loading');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      const updatedMessages = messages.map((m) =>
        m.id === messageId
          ? { ...m, content, updated_at: new Date().toISOString(), is_edited: true }
          : m
      );
      setMessages(updatedMessages);
      setLoading('success');
    } catch (err) {
      setError('Failed to update message');
      setLoading('error');
    }
  }, [messages, setMessages, setLoading, setError]);

  const deleteMessage = useCallback(async (messageId: number) => {
    setLoading('loading');
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      const filteredMessages = messages.filter((m) => m.id !== messageId);
      setMessages(filteredMessages);
      setLoading('success');
    } catch (err) {
      setError('Failed to delete message');
      setLoading('error');
    }
  }, [messages, setMessages, setLoading, setError]);

  return {
    messages,
    loading,
    error,
    getMessages,
    createMessage,
    updateMessage,
    deleteMessage,
  };
};
