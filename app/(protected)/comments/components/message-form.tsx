'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import LockIcon from '@mui/icons-material/Lock';

interface MessageFormProps {
  onSubmit?: (content: string) => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  canPost?: boolean;
  isAdmin?: boolean;
  roomVisibility?: 'admin_only' | 'internal' | 'project_specific' | 'private';
}

const MAX_CHARACTERS = 5000;

/**
 * MessageForm component for composing and submitting messages
 */
export const MessageForm: React.FC<MessageFormProps> = ({
  onSubmit,
  loading = false,
  disabled = false,
  error,
  canPost = true,
  isAdmin = false,
  roomVisibility = 'internal',
}) => {
  const [content, setContent] = useState('');
  const [touched, setTouched] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Form is disabled if explicitly disabled, loading, or user cannot post.
  // If room is admin_only, non-admins are disabled.
  const isFormDisabled =
    disabled ||
    loading ||
    !canPost ||
    (roomVisibility === 'admin_only' && !isAdmin);

  const isSubmitDisabled =
    !content.trim() || loading || isFormDisabled;
  const characterCount = content.length;
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const remainingCharacters = MAX_CHARACTERS - characterCount;

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || isOverLimit || isFormDisabled) {
      return;
    }

    try {
      await onSubmit?.(content.trim());
      setContent(''); // Clear form on success
    } catch (err) {
      console.error('Error submitting message:', err);
    }
  };

  /**
   * Handle text change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  /**
   * Handle blur
   */
  const handleBlur = () => {
    setTouched(true);
  };

  // Permission warning
  if (!canPost) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="warning" icon={<LockIcon />}>
          You don't have permission to post messages in this room.
        </Alert>
      </Box>
    );
  }

  // Admin only warning - Only show to non-admins
  if (roomVisibility === 'admin_only' && !isAdmin) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info" icon={<LockIcon />}>
          This room is admin-only. Only administrators can post messages here.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: isMobile ? 1.5 : 2,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Error Alert */}
      {error && touched && (
        <Alert severity="error" sx={{ mb: 1.5 }}>
          {error}
        </Alert>
      )}

      {/* Message Input */}
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Write an internal note..."
        value={content}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isFormDisabled}
        error={isOverLimit && touched}
        sx={{
          mb: 1,
          '& .MuiOutlinedInput-root': {
            fontSize: '0.95rem',
            fontFamily: 'inherit',
          },
        }}
      />

      {/* Character Count and Controls */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={1}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
        }}
      >
        {/* Character Counter */}
        <Typography
          variant="caption"
          sx={{
            color: isOverLimit ? 'error.main' : 'text.secondary',
            fontWeight: isOverLimit ? 600 : 400,
          }}
        >
          {characterCount} / {MAX_CHARACTERS}
          {remainingCharacters <= 100 && remainingCharacters > 0 && (
            <span style={{ marginLeft: '8px', color: 'orange' }}>
              ({remainingCharacters} remaining)
            </span>
          )}
          {isOverLimit && (
            <span style={{ marginLeft: '8px', color: 'red' }}>
              (Over limit by {characterCount - MAX_CHARACTERS} characters)
            </span>
          )}
        </Typography>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitDisabled}
          endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          sx={{
            minWidth: 120,
          }}
        >
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </Stack>

      {/* Helper Text */}
      {!error && touched && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            color: 'text.secondary',
          }}
        >
        </Typography>
      )}
    </Box>
  );
};

export default MessageForm;
