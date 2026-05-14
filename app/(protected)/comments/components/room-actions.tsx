'use client';

import React, { useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  WarningAmber as WarningIcon
} from '@mui/icons-material';
import { NoteRoom } from '@/types/internal-notes';

interface RoomActionsProps {
  room: NoteRoom;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (room: NoteRoom) => void;
  onDelete?: (room: NoteRoom) => void;
}

export const RoomActions: React.FC<RoomActionsProps> = ({ 
  room, 
  canEdit = false, 
  canDelete = false, 
  onEdit, 
  onDelete 
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleEdit = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    if (onEdit) onEdit(room);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    if (onDelete) onDelete(room);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  // If user can't do anything, don't show the menu at all
  if (!canEdit && !canDelete) return null;

  return (
    <>
      <IconButton
        aria-label="room-actions"
        aria-controls={open ? 'room-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleMenuClick}
        sx={{
          position: 'absolute',
          top: 12,
          right: 8,
          zIndex: 1,
          color: 'text.secondary',
          '&:hover': { bgcolor: 'action.hover' }
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <Menu
        id="room-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '8px',
              minWidth: 150,
              boxShadow: (theme) => theme.shadows[10],
            }
          }
        }}
      >
        {canEdit && (
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText primary="Edit Room" />
          </MenuItem>
        )}
        
        {canDelete && (
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primary="Delete Room" />
          </MenuItem>
        )}
      </Menu>

      {/* Deletion Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onClick={(e) => e.stopPropagation()} // Prevent click through to the card
        aria-labelledby="delete-room-dialog-title"
        aria-describedby="delete-room-dialog-description"
        slotProps={{
          paper: {
            sx: { borderRadius: '12px', p: 1 }
          }
        }}
      >
        <DialogTitle id="delete-room-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          Delete Room?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-room-dialog-description">
            Are you sure you want to delete <strong>"{room.name}"</strong>? This action cannot be undone and all notes in this room will be permanently lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 3 }}>
          <Button onClick={handleDeleteCancel} color="inherit" variant="text">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained" 
            autoFocus
            sx={{ borderRadius: '8px', px: 3 }}
          >
            Delete Room
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomActions;
