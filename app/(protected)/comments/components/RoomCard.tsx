'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { NoteRoom } from '@/types/internal-notes';
import VisibilityBadge from './VisibilityBadge';

interface RoomCardProps {
  room: NoteRoom;
  onClick?: (roomId: number) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  const handleClick = () => {
    if (onClick) onClick(room.id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        onClick={handleClick}
        sx={{
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: (theme) => theme.shadows[8],
          },
          borderRadius: '12px',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700, lineHeight: 1.2, maxWidth: '70%' }}>
                {room.name}
              </Typography>
              <VisibilityBadge visibility={room.visibility} />
            </Box>

            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                <PeopleIcon sx={{ fontSize: '0.9rem', mr: 1 }} />
                <Typography variant="body2">
                  {room.members.length} member{room.members.length !== 1 ? 's' : ''}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                <EmailIcon sx={{ fontSize: '0.9rem', mr: 1 }} />
                <Typography variant="body2" noWrap sx={{ maxWidth: '200px' }}>
                  {room.created_by_email || 'Unknown Creator'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }} color="text.secondary">
                <CalendarIcon sx={{ fontSize: '0.9rem', mr: 1 }} />
                <Typography variant="body2">
                  Created {formatDate(room.created_at)}
                </Typography>
              </Box>
            </Stack>

            {room.project_name && (
              <Box
                sx={{
                  bgcolor: 'action.hover',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  width: 'fit-content'
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Project: {room.project_name}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoomCard;
