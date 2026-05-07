'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { RoomVisibility } from '@/types/internal-notes';

interface VisibilityInfoProps {
  visibility: RoomVisibility;
}

const VISIBILITY_INFO_CONFIG = {
  [RoomVisibility.INTERNAL]: {
    title: '🌍 Internal Room',
    description: 'Everyone in the organization can see and post to this room.',
  },
  [RoomVisibility.PROJECT_SPECIFIC]: {
    title: '📁 Project-Specific Room',
    description: 'Only members of the selected project can see and post to this room.',
  },
  [RoomVisibility.PRIVATE]: {
    title: '👥 Private Room',
    description: 'Only invited members can see and post to this room. You will be added automatically.',
  },
  [RoomVisibility.ADMIN_ONLY]: {
    title: '🔒 Admin-Only Room',
    description: 'Only administrators can see and post to this room.',
  },
};

export const VisibilityInfo: React.FC<VisibilityInfoProps> = ({ visibility }) => {
  const config = VISIBILITY_INFO_CONFIG[visibility];

  if (!config) return null;

  return (
    <Box
      sx={{
        p: 1.5,
        backgroundColor: 'action.hover',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
        {config.title}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {config.description}
      </Typography>
    </Box>
  );
};
