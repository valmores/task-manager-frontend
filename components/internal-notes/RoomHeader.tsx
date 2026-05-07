'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Stack, Divider } from '@mui/material';
import {
  Settings as SettingsIcon,
  People as PeopleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { NoteRoom } from '../../types/internal-notes';
import VisibilityBadge from './VisibilityBadge';

interface RoomHeaderProps {
  room: NoteRoom;
  onBack?: () => void;
}

const RoomHeader: React.FC<RoomHeaderProps> = ({ room, onBack }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        borderRadius: { xs: 0, sm: '12px 12px 0 0' },
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {onBack && (
          <IconButton
            edge="start"
            onClick={onBack}
            sx={{ mr: 1, display: { sm: 'none' } }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        <Stack direction="row" sx={{ alignItems: 'center', flexGrow: 1 }} spacing={2}>
          <Box>
            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {room.name}
              </Typography>
              <VisibilityBadge visibility={room.visibility} />
            </Stack>

            <Stack
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 2,
                mt: 0.5,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <PeopleIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} />
                <Typography variant="caption">
                  {room.members.length} members
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto', display: { xs: 'none', md: 'block' } }} />

              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' } }}>
                Created by {room.created_by_email} on {formatDate(room.created_at)}
              </Typography>

              {room.project_name && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto' }} />
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
                    Project: {room.project_name}
                  </Typography>
                </>
              )}
            </Stack>
          </Box>
        </Stack>

        <IconButton disabled title="Room settings (Coming soon)">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default RoomHeader;
