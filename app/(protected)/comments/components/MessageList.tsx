'use client';

import React, { useEffect, useRef } from 'react';
import {
  Box,
  Skeleton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import { MessageItem } from './MessageItem';
import { InternalNote } from '@/types/internal-notes';

interface MessageListProps {
  messages: InternalNote[];
  loading?: boolean;
  onEdit?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  currentUserEmail?: string;
  currentUserRole?: 'admin' | 'project_owner' | 'user';
}

/**
 * MessageList component displays all messages in a room with auto-scroll
 * to the latest message. Shows loading skeleton and empty state.
 */
export const MessageList: React.FC<MessageListProps> = ({
  messages,
  loading = false,
  onEdit,
  onDelete,
  currentUserEmail,
  currentUserRole,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Auto-scroll to latest message
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll on mount
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Loading skeleton
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: 2,
          flex: 1,
          overflow: 'auto',
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1, width: '100%' }}>
              <Skeleton variant="text" width="30%" height={20} />
              <Skeleton variant="text" width="100%" height={60} sx={{ mt: 1 }} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  // Empty state
  if (messages.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          gap: 2,
          p: 3,
          color: 'text.secondary',
        }}
      >
        <ChatBubbleOutlineIcon
          sx={{
            fontSize: 80,
            opacity: 0.3,
          }}
        />
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          No messages in this room yet
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center' }}>
          Be the first to share an internal note!
        </Typography>
      </Box>
    );
  }

  // Check if current user is admin
  const isAdmin = currentUserRole === 'admin';

  return (
    <Box
      ref={containerRef}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        overflow: 'auto',
        p: isMobile ? 1.5 : 2,
        gap: 1,
        backgroundColor: 'background.default',
        borderRadius: 1,
      }}
    >
      {/* Messages */}
      {messages.map((message) => {
        const isAuthor = currentUserEmail === message.author_email;

        return (
          <MessageItem
            key={message.id}
            message={message}
            onEdit={onEdit}
            onDelete={onDelete}
            isAuthor={isAuthor}
            isAdmin={isAdmin}
          />
        );
      })}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList;
