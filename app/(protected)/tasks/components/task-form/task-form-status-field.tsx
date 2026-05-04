"use client";

import React from 'react';
import { TextField, MenuItem } from '@mui/material';

interface TaskFormStatusFieldProps {
  formData: {
    status: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  canUpdateStatusOnly: boolean;
}

export const TaskFormStatusField: React.FC<TaskFormStatusFieldProps> = ({
  formData,
  handleChange,
  canUpdateStatusOnly,
}) => {
  return (
    <TextField
      select
      fullWidth
      label="Status"
      name="status"
      value={formData.status}
      onChange={handleChange}
      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: canUpdateStatusOnly ? 'primary.50' : 'transparent' } }}
    >
      <MenuItem value="todo">To Do</MenuItem>
      <MenuItem value="in_progress">In Progress</MenuItem>
      <MenuItem value="on_hold">On Hold</MenuItem>
      <MenuItem value="done">Done</MenuItem>
    </TextField>
  );
};
