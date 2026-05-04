"use client";

import React from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import { Task } from '@/types/task';

interface TaskFormReadOnlyViewProps {
  task: Task | null;
  formData: {
    title: string;
    description: string;
    priority: string;
    due_date: string;
    status: string;
  };
  canUpdateAssignmentOnly: boolean;
}

const renderReadOnlyField = (label: string, value: string | null | undefined, Icon: any) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
      <Icon sx={{ fontSize: 16, mr: 0.5 }} /> {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 500, ml: 2.5 }}>
      {value || 'Not specified'}
    </Typography>
  </Box>
);

export const TaskFormReadOnlyView: React.FC<TaskFormReadOnlyViewProps> = ({
  task,
  formData,
  canUpdateAssignmentOnly,
}) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>{formData.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{formData.description || 'No description provided.'}</Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 6 }}>
          {renderReadOnlyField('Project', task?.project_name, FolderIcon)}
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          {renderReadOnlyField('Priority', formData.priority.toUpperCase(), FlagIcon)}
        </Grid>
        <Grid size={{ xs: 6, md: 6 }}>
          {renderReadOnlyField('Due Date', formData.due_date, EventIcon)}
        </Grid>
        {canUpdateAssignmentOnly && (
          <Grid size={{ xs: 6, md: 6 }}>
            {renderReadOnlyField('Status', formData.status.toUpperCase(), FlagIcon)}
          </Grid>
        )}
      </Grid>

    </Box>
  );
};
