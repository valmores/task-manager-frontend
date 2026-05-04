"use client";

import React from 'react';
import { DialogTitle, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface TaskFormHeaderProps {
  isEditMode: boolean;
  canUpdateStatusOnly: boolean;
  canUpdateAssignmentOnly: boolean;
  onClose: () => void;
}

export const TaskFormHeader: React.FC<TaskFormHeaderProps> = ({
  isEditMode,
  canUpdateStatusOnly,
  canUpdateAssignmentOnly,
  onClose,
}) => {
  return (
    <DialogTitle sx={{ m: 0, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
        {isEditMode
          ? (canUpdateStatusOnly ? 'Update Task Status' : canUpdateAssignmentOnly ? 'Reassign Task' : 'Edit Task')
          : 'Create New Task'
        }
      </Typography>
      <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};
