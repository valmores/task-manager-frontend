"use client";

import React from 'react';
import { DialogActions, Button, CircularProgress } from '@mui/material';

interface TaskFormActionsProps {
  onClose: () => void;
  isLoading: boolean;
  isEditMode: boolean;
  isSubmitDisabled: boolean;
}

export const TaskFormActions: React.FC<TaskFormActionsProps> = ({
  onClose,
  isLoading,
  isEditMode,
  isSubmitDisabled,
}) => {
  return (
    <DialogActions sx={{ p: 3 }}>
      <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitDisabled || isLoading}
        sx={{ px: 4, py: 1, borderRadius: 2, fontWeight: 700, minWidth: 140 }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Update Task' : 'Create Task')}
      </Button>
    </DialogActions>
  );
};
