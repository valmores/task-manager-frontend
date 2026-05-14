'use client';

import React, { useState } from 'react';
import {
  Paper,
  Avatar,
  Typography,
  Box,
  IconButton,
  Chip,
  Tooltip,
  Stack,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import { InternalNote } from '@/types/internal-notes';

interface MessageItemProps {
  message: InternalNote;
  onEdit?: (messageId: number) => void;
  onDelete?: (messageId: number) => void;
  isAuthor?: boolean;
  isAdmin?: boolean;
}

/**
 * Get initials from email (first letter of email)
 */
const getInitials = (email: string): string => {
  return email.charAt(0).toUpperCase();
};

/**
 * Convert ISO date to relative time (e.g., "2 minutes ago")
 */
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return date.toLocaleDateString();
};

/**
 * Get color for avatar based on email
 */
const getAvatarColor = (email: string): string => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#FFA07A',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E2',
  ];
  const index = email.charCodeAt(0) % colors.length;
  return colors[index];
};

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  onEdit,
  onDelete,
  isAuthor = false,
  isAdmin = false,
}) => {
  const [showActions, setShowActions] = useState(false);
  const canEdit = isAuthor || isAdmin;
  const canDelete = isAuthor || isAdmin;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Paper
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        sx={{
          p: 2,
          mb: 2,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          {/* Avatar */}
          <Tooltip title={message.author_email}>
            <Avatar
              sx={{
                bgcolor: getAvatarColor(message.author_email || "N/A"),
                width: 40,
                height: 40,
                flexShrink: 0,
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              {getInitials(message?.author_email || "N/A")}
            </Avatar>
          </Tooltip>

          {/* Message Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Header: Author, Time, Edited Badge */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {message.author_email?.split('@')[0]}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                }}
              >
                {getRelativeTime(message.created_at)}
              </Typography>

              {/* Edited Badge */}
              {message.is_edited && (
                <Chip
                  label="edited"
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                  }}
                />
              )}
            </Box>

            {/* Full Email (smaller) */}
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block',
                mb: 1,
              }}
            >
              {message.author_email}
            </Typography>

            {/* Message Content */}
            <Typography
              variant="body2"
              sx={{
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap',
                color: 'text.primary',
                lineHeight: 1.5,
              }}
            >
              {message.content}
            </Typography>
          </Box>

          {/* Action Buttons - Hidden until hover */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: showActions ? 1 : 0, x: showActions ? 0 : 10 }}
            transition={{ duration: 0.15 }}
          >
            <Stack direction="row" spacing={0.5}>
              {canEdit && (
                <Tooltip title="Edit message">
                  <IconButton
                    size="small"
                    onClick={() => onEdit?.(message.id)}
                    disabled={!onEdit}
                    sx={{
                      opacity: 0.6,
                      '&:hover': { opacity: 1 },
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {canDelete && (
                <Tooltip title="Delete message">
                  <IconButton
                    size="small"
                    onClick={() => onDelete?.(message.id)}
                    disabled={!onDelete}
                    sx={{
                      opacity: 0.6,
                      '&:hover': { opacity: 1, color: 'error.main' },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default MessageItem;
