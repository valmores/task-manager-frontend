"use client";

import React from 'react';
import { Stack, Typography } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import { isOverdue } from '../../utils/task-helpers';

interface TaskMetadataProps {
  priority: string;
  due_date: string | null;
  status: string;
  project_name: string | null;
  assigned_to_email: string | null;
  getPriorityColor: (priority: string) => string;
}

export const TaskMetadata = ({
  priority,
  due_date,
  status,
  project_name,
  assigned_to_email,
  getPriorityColor
}: TaskMetadataProps) => {
  const overdue = isOverdue(due_date, status);

  return (
    <Stack
      direction="row"
      spacing={3}
      sx={{
        width: { xs: '100%', sm: 'auto' },
        justifyContent: { xs: 'space-between', sm: 'flex-end' },
        alignItems: 'center'
      }}
    >
      {/* Priority */}
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', minWidth: 80 }}>
        <FlagIcon fontSize="small" color={getPriorityColor(priority) as any} />
        <Typography variant="caption" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
          {priority}
        </Typography>
      </Stack>

      {/* Due Date */}
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          alignItems: 'center',
          minWidth: 100,
          color: overdue ? 'error.main' : 'text.secondary'
        }}
      >
        {overdue ? <WarningIcon fontSize="small" /> : <EventIcon fontSize="small" />}
        <Typography variant="caption" sx={{ fontWeight: 700 }}>
          {due_date || 'No date'}
          {overdue && " (Overdue)"}
        </Typography>
      </Stack>

      {/* Project */}
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', minWidth: 120, display: { xs: 'none', lg: 'flex' } }}>
        <FolderIcon fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 120 }}>
          {project_name || 'No Project'}
        </Typography>
      </Stack>

      {/* Assignee */}
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', minWidth: 150, display: { xs: 'none', md: 'flex' } }}>
        <PersonIcon fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary" noWrap>
          {assigned_to_email || 'Unassigned'}
        </Typography>
      </Stack>
    </Stack>
  );
};
