"use client";

import React from 'react';
import { TextField } from '@mui/material';

interface TaskFormCoreFieldsProps {
  formData: {
    title: string;
    description: string;
  };
  errors: Record<string, string[]>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditMode: boolean;
  canEditAllFields: boolean;
}

export const TaskFormCoreFields: React.FC<TaskFormCoreFieldsProps> = ({
  formData,
  errors,
  handleChange,
  isEditMode,
  canEditAllFields,
}) => {
  return (
    <>
      <TextField
        required
        fullWidth
        disabled={!canEditAllFields && isEditMode}
        label="Task Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title?.[0] || `${(formData.title || '').length}/60`}
        variant="outlined"
        autoFocus={!isEditMode}
        slotProps={{
          input: {
            inputProps: { maxLength: 60 }
          }
        }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        disabled={!canEditAllFields && isEditMode}
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        error={!!errors.description}
        helperText={errors.description?.[0] || `${(formData.description || '').length}/150`}
        variant="outlined"
        slotProps={{
          input: {
            inputProps: { maxLength: 150 }
          }
        }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
      />
    </>
  );
};
