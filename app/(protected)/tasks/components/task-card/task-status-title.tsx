"use client";

import React from 'react';
import { Stack, Chip, Typography } from '@mui/material';

interface TaskStatusTitleProps {
  title: string;
  status: string;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
}

export const TaskStatusTitle = ({ title, status, getStatusLabel, getStatusColor }: TaskStatusTitleProps) => (
  <Stack direction="row" spacing={2} sx={{ flexGrow: 1, minWidth: 0, alignItems: 'center' }}>
    <Chip
      label={getStatusLabel(status)}
      color={getStatusColor(status) as any}
      size="small"
      sx={{
        fontWeight: 600,
        borderRadius: 1.5,
        minWidth: 90,
        fontSize: '0.75rem',
      }}
    />
    <Typography
      variant="subtitle1"
      noWrap
      sx={{
        fontWeight: 600,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block'
      }}
    >
      {title}
    </Typography>
  </Stack>
);
