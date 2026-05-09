'use client';

import React from 'react';
import { Grid, Box, Typography, Skeleton, Stack } from '@mui/material';
import { Forum as ForumIcon } from '@mui/icons-material';
import { NoteRoom, RoomVisibility } from '@/types/internal-notes';
import RoomCard from './RoomCard';

interface RoomListProps {
  rooms: NoteRoom[];
  loading?: boolean;
  onRoomSelect?: (roomId: number) => void;
  selectedRoomId?: number | null;
  onRoomEdit?: (room: NoteRoom) => void;
  onRoomDelete?: (room: NoteRoom) => void;
}

const RoomList: React.FC<RoomListProps> = ({ 
  rooms, 
  loading = false, 
  onRoomSelect,
  selectedRoomId,
  onRoomEdit,
  onRoomDelete
}) => {
  if (loading) {
    return (
      <Stack spacing={2} sx={{ width: '100%', p: 2 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
            <Skeleton
              variant="rectangular"
              height={180}
              sx={{ borderRadius: '12px' }}
            />
          </Grid>
        ))}
      </Stack>
    );
  }

  if (rooms.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
          textAlign: 'center',
        }}
      >
        <ForumIcon sx={{ fontSize: '4rem', color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No rooms available
        </Typography>
        <Typography variant="body2" color="text.disabled">
          You don't have access to any internal note rooms yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} sx={{ width: '100%', p: 2 }}>
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onClick={onRoomSelect}
          isActive={room.id === selectedRoomId}
          onEdit={onRoomEdit}
          onDelete={onRoomDelete}
        />
      ))}
    </Stack>
  );
};

export default RoomList;
