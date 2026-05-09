'use client';

import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Fab,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Forum as ForumIcon
} from '@mui/icons-material';
import { useInternalNotes } from '@/hooks/internal-notes/useInternalNotes';
import { useMessages } from '@/hooks/internal-notes/useMessages';
import { useProjects } from '@/hooks/projects/use-projects';
import RoomList from './RoomList';
import RoomHeader from './RoomHeader';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import RoomCreateDialog from './RoomCreateDialog';
import { NoteRoom } from '@/types/internal-notes';

const SIDEBAR_WIDTH = 320;

export const InternalNotesLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<NoteRoom | null>(null);

  const { data: projects = [] } = useProjects();

  const {
    rooms,
    selectedRoom,
    loading: loadingRooms,
    error: roomsError,
    selectRoom,
    createRoom,
    updateRoom,
    deleteRoom
  } = useInternalNotes();

  const {
    messages,
    loading: loadingMessages,
    error: messagesError,
    createMessage
  } = useMessages();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRoomSelect = (roomId: number) => {
    selectRoom(roomId);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleRoomEdit = (room: NoteRoom) => {
    setRoomToEdit(room);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setRoomToEdit(null);
  };

  const handleRoomDelete = async (room: NoteRoom) => {
    if (window.confirm(`Are you sure you want to delete "${room.name}"?`)) {
      try {
        await deleteRoom(room.id);
      } catch (err) {
        console.error('Failed to delete room:', err);
      }
    }
  };

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Internal Notes
        </Typography>
        <Tooltip title="Create New Room">
          <IconButton
            size="small"
            onClick={() => {
              setRoomToEdit(null);
              setDialogOpen(true);
            }}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <RoomList
          rooms={rooms}
          loading={loadingRooms}
          onRoomSelect={handleRoomSelect}
          selectedRoomId={selectedRoom?.id}
          onRoomEdit={handleRoomEdit}
          onRoomDelete={handleRoomDelete}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Mobile Drawer Toggle Button */}
      {isMobile && !selectedRoom && (
        <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ bgcolor: 'background.paper', boxShadow: 2 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Sidebar Component (Desktop) */}
      <Box
        component="nav"
        sx={{
          width: { sm: SIDEBAR_WIDTH },
          flexShrink: { sm: 0 },
          display: { xs: 'none', sm: 'block' },
          borderRight: '1px solid',
          borderColor: 'divider'
        }}
      >
        {sidebarContent}
      </Box>

      {/* Sidebar Component (Mobile Drawer) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: SIDEBAR_WIDTH },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Chat/Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          bgcolor: 'action.hover',
          position: 'relative',
          width: { sm: `calc(100% - ${SIDEBAR_WIDTH}px)` }
        }}
      >
        {selectedRoom ? (
          <>
            <RoomHeader
              room={selectedRoom}
              onBack={isMobile ? () => selectRoom(null) : undefined}
            />
            <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <MessageList
                messages={messages}
                loading={loadingMessages}
              />
              <MessageForm
                roomVisibility={selectedRoom.visibility}
                loading={loadingMessages}
                error={messagesError || undefined}
                onSubmit={async (content) => {
                  await createMessage(selectedRoom.id, content);
                }}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1,
              textAlign: 'center',
              p: 3,
              bgcolor: 'background.default'
            }}
          >
            <ForumIcon sx={{ fontSize: 100, color: 'text.disabled', mb: 2, opacity: 0.2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 700 }}>
              Select a room to start
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 400 }}>
              Choose an internal note room from the sidebar to view discussions,
              updates, and project-specific notes.
            </Typography>
            {isMobile && (
              <Button
                variant="contained"
                onClick={handleDrawerToggle}
                sx={{ mt: 4, borderRadius: '20px', px: 4 }}
              >
                Browse Rooms
              </Button>
            )}
          </Box>
        )}
      </Box>

      {/* Floating Action Button for mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          onClick={() => {
            setRoomToEdit(null);
            setDialogOpen(true);
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Room Dialog (Create/Edit) */}
      <RoomCreateDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        room={roomToEdit}
        onSubmit={async (data) => {
          if (roomToEdit) {
            await updateRoom(roomToEdit.id, data);
          } else {
            await createRoom(data);
          }
          handleDialogClose();
        }}
        loading={loadingRooms}
        error={roomsError || undefined}
        projects={projects}
      />
    </Box>
  );
};

export default InternalNotesLayout;
