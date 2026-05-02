"use client";

import React from 'react';
import {
  Paper,
  Typography,
  Box,
} from '@mui/material';

interface TaskStatusCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function TaskStatusCard({ title, description, children }: TaskStatusCardProps) {
  return (
    <Paper 
      sx={{ 
        p: 3, 
        borderRadius: 3, 
        border: '1px solid', 
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      
      <Box 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        {children || (
          <Box 
            sx={{ 
              mt: 2, 
              p: 3, 
              bgcolor: 'action.hover', 
              borderRadius: 2, 
              border: '1px dashed', 
              borderColor: 'divider', 
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 100
            }}
          >
            <Typography variant="caption" color="text.secondary">
              No tasks yet
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
