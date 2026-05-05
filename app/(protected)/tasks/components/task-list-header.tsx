"use client";

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface TaskListHeaderProps {
  isAdminOrOwner: boolean;
  onCreateClick: () => void;
}

export function TaskListHeader({ isAdminOrOwner, onCreateClick }: TaskListHeaderProps) {
  return (
    <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          Task List
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage and track all your project tasks in one place.
        </Typography>
      </Box>
      {isAdminOrOwner && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateClick}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
          }}
        >
          Create Task
        </Button>
      )}
    </Box>
  );
}
