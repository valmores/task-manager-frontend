'use client';

import React, { useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import InfoIcon from '@mui/icons-material/Info';
import { RoomVisibility, NoteRoom } from '@/types/internal-notes';

import { useRoomCreateForm } from '@/hooks/internal-notes/useRoomCreateForm';
import { VisibilitySelector } from './room-create/VisibilitySelector';
import { ProjectSelector } from './room-create/ProjectSelector';
import { VisibilityInfo } from './room-create/VisibilityInfo';

interface RoomCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    name: string;
    visibility: RoomVisibility;
    project?: number | null;
  }) => void | Promise<void>;
  loading?: boolean;
  error?: string;
  canCreate?: boolean;
  projects?: Array<{ id: number; name: string }>;
  room?: NoteRoom | null; // Added room prop for editing
}

/**
 * RoomCreateDialog component for creating and editing internal note rooms
 */
export const RoomCreateDialog: React.FC<RoomCreateDialogProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  error,
  canCreate = true,
  projects = [],
  room = null,
}) => {
  const isEditing = !!room;

  // Memoize initial data for the hook
  const initialData = useMemo(() => {
    if (!room) return undefined;
    return {
      name: room.name,
      visibility: room.visibility,
      project: room.project || null,
    };
  }, [room]);

  const {
    form,
    errors,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    showProjectField,
  } = useRoomCreateForm(onSubmit, initialData);

  /**
   * Handle close
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Permission warning (only relevant for creating new rooms usually, 
  // but we'll keep it for now or adjust if edit has different permissions)
  if (!canCreate && !isEditing) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Room</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="warning" icon={<LockIcon />}>
            You don't have permission to create rooms. Only Admins and Project Owners can create
            internal note rooms.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? 'Edit Room' : 'Create New Room'}</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2.5}>
          {/* Error Alert from API */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Feature Information */}
          <Alert severity="info" icon={<InfoIcon />}>
            {isEditing
              ? `You are editing "${room.name}". Updates will apply immediately.`
              : 'Create a room to organize internal notes by topic or project. Choose visibility level to control who can access this room.'
            }
          </Alert>

          {/* Room Name Input */}
          <TextField
            fullWidth
            label="Room Name"
            placeholder="e.g., Project Planning, Team Updates"
            value={form.name}
            onChange={handleChange('name')}
            onBlur={handleBlur('name')}
            error={form.touched.name && !!errors.name}
            helperText={form.touched.name ? errors.name : isEditing ? 'Update your room name' : 'Give your room a descriptive name'}
            disabled={loading}
          />

          {/* Visibility Selection */}
          <VisibilitySelector
            value={form.visibility}
            onChange={handleChange('visibility')}
            onBlur={handleBlur('visibility')}
            error={errors.visibility}
            touched={form.touched.visibility}
            disabled={loading}
          />

          {/* Project Selection (Conditional) */}
          {showProjectField && (
            <ProjectSelector
              value={form.project}
              projects={projects}
              onChange={handleChange('project')}
              onBlur={handleBlur('project')}
              error={errors.project}
              touched={form.touched.project}
              disabled={loading}
            />
          )}

          {/* Visibility Policy Summary */}
          <VisibilityInfo visibility={form.visibility} />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !isValid}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Room')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoomCreateDialog;
