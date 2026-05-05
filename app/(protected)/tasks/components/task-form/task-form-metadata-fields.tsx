"use client";

import React from 'react';
import { Stack, TextField, MenuItem } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';

interface TaskFormMetadataFieldsProps {
  formData: {
    project: string;
    assigned_to: string;
    priority: string;
    due_date: string;
  };
  errors: Record<string, string[]>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditMode: boolean;
  canEditAllFields: boolean;
  canUpdateAssignmentOnly: boolean;
  projects?: any[];
  users?: any[];
}

export const TaskFormMetadataFields: React.FC<TaskFormMetadataFieldsProps> = ({
  formData,
  errors,
  handleChange,
  isEditMode,
  canEditAllFields,
  canUpdateAssignmentOnly,
  projects,
  users,
}) => {
  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {!canUpdateAssignmentOnly && (
          <TextField
            select
            fullWidth
            disabled={!canEditAllFields && isEditMode}
            label="Project (Optional)"
            name="project"
            value={formData.project}
            onChange={handleChange}
            error={!!errors.project}
            helperText={errors.project?.[0]}
            slotProps={{ input: { startAdornment: <FolderIcon sx={{ mr: 1, color: 'primary.main' }} /> } }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            <MenuItem value="">None</MenuItem>
            {projects?.map((p) => <MenuItem key={p.id} value={p.id.toString()}>{p.name}</MenuItem>)}
          </TextField>
        )}

        <TextField
          select
          fullWidth
          disabled={!canEditAllFields && isEditMode && !canUpdateAssignmentOnly}
          label="Assign To"
          name="assigned_to"
          value={formData.assigned_to}
          onChange={handleChange}
          error={!!errors.assigned_to}
          helperText={errors.assigned_to?.[0]}
          slotProps={{ input: { startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} /> } }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: canUpdateAssignmentOnly ? 'primary.50' : 'transparent' } }}
        >
          <MenuItem value="">Unassigned</MenuItem>
          {users?.map((u) => (
            <MenuItem key={u.id} value={u.id.toString()}>
              {u.first_name} {u.last_name} ({u.email})
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {!canUpdateAssignmentOnly && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            select
            fullWidth
            disabled={!canEditAllFields && isEditMode}
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>

          <TextField
            fullWidth
            disabled={!canEditAllFields && isEditMode}
            label="Due Date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            error={!!errors.due_date}
            helperText={errors.due_date?.[0]}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: {
                min: new Date().toISOString().split('T')[0],
              },
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </Stack>
      )}
    </>
  );
};
