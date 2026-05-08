'use client';

import React from 'react';
import { Grid, Box, Typography, Skeleton, Stack } from '@mui/material';
import { Forum as ForumIcon } from '@mui/icons-material';
import { NoteRoom, RoomVisibility } from '../../types/internal-notes';
import RoomCard from './RoomCard';

interface RoomListProps {
  rooms: NoteRoom[];
  loading?: boolean;
  onRoomSelect?: (roomId: number) => void;
}

/**
 * Stub data as specified in the implementation plan.
 * This will be moved to a service or store in later commits.
 */
export const STUB_ROOMS: NoteRoom[] = [
  {
    id: 1,
    name: "General Discussion",
    is_default: true,
    visibility: RoomVisibility.INTERNAL,
    created_by: 1,
    created_by_email: "admin@example.com",
    project: null,
    project_name: null,
    members: [1, 2, 3, 4, 5],
    created_at: "2026-05-07T10:00:00Z",
  },
  {
    id: 2,
    name: "Project Alpha Notes",
    is_default: false,
    visibility: RoomVisibility.PROJECT_SPECIFIC,
    created_by: 2,
    created_by_email: "owner@example.com",
    project: 1,
    project_name: "Project Alpha",
    members: [1, 2],
    created_at: "2026-05-07T10:15:00Z",
  },
  {
    id: 3,
    name: "Leadership Team",
    is_default: false,
    visibility: RoomVisibility.PRIVATE,
    created_by: 1,
    created_by_email: "admin@example.com",
    project: null,
    project_name: null,
    members: [1, 2, 3],
    created_at: "2026-05-07T10:30:00Z",
  },
  {
    id: 4,
    name: "Admin Only System Log",
    is_default: false,
    visibility: RoomVisibility.ADMIN_ONLY,
    created_by: 1,
    created_by_email: "admin@example.com",
    project: null,
    project_name: null,
    members: [1],
    created_at: "2026-05-07T10:45:00Z",
  }
];

const RoomList: React.FC<RoomListProps> = ({ rooms, loading = false, onRoomSelect }) => {
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
        />
      ))}
    </Stack>
  );
};

export default RoomList;
