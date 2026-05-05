"use client";

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface TaskDeleteDialogProps {
  open: boolean;
  taskTitle: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const TaskDeleteDialog = ({
  open,
  taskTitle,
  isPending,
  onClose,
  onConfirm
}: TaskDeleteDialogProps) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Delete Task?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete "{taskTitle}"? This action cannot be undone.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button 
        onClick={onConfirm} 
        color="error" 
        variant="contained" 
        disabled={isPending}
      >
        {isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </DialogActions>
  </Dialog>
);
