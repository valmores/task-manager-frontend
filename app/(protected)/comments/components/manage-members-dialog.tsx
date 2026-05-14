'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Typography,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import {
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { Autocomplete, TextField } from '@mui/material';
import { NoteRoom, UserInfo } from '@/types/internal-notes';
import { UserOption } from '@/types/task';

interface ManageMembersDialogProps {
  open: boolean;
  onClose: () => void;
  room: NoteRoom;
  allUsers: UserOption[];
  /** IDs that cannot be removed (e.g., room creator) */
  lockedIds?: number[];
  onUpdateMembers: (payload: { add?: number[]; remove?: number[] }) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const getInitials = (u: UserInfo | UserOption) =>
  `${(u as UserOption).first_name?.[0] ?? ''}${(u as UserOption).last_name?.[0] ?? ''}`.toUpperCase() || '?';

const getRoleChipColor = (role: string): 'default' | 'primary' | 'secondary' =>
  role === 'admin' ? 'secondary' : role === 'project_owner' ? 'primary' : 'default';

export const ManageMembersDialog: React.FC<ManageMembersDialogProps> = ({
  open,
  onClose,
  room,
  allUsers,
  lockedIds = [],
  onUpdateMembers,
  isLoading = false,
  error = null,
}) => {
  const [pendingAdd, setPendingAdd] = useState<number[]>([]);
  const [pendingRemove, setPendingRemove] = useState<number[]>([]);

  // Compute effective members list for display:
  // start from room.members_detail, apply pendingRemove/pendingAdd
  const currentMemberIds = new Set([
    ...room.members.filter((id) => !pendingRemove.includes(id)),
    ...pendingAdd,
  ]);
  const currentMembers = allUsers.filter((u) => currentMemberIds.has(u.id));
  const availableToAdd = allUsers.filter((u) => !currentMemberIds.has(u.id));

  const hasPendingChanges = pendingAdd.length > 0 || pendingRemove.length > 0;

  const handleAddUser = (_: React.SyntheticEvent, user: UserOption | null) => {
    if (!user) return;
    // If the user was in pendingRemove, un-remove them
    if (pendingRemove.includes(user.id)) {
      setPendingRemove((prev) => prev.filter((id) => id !== user.id));
    } else if (!room.members.includes(user.id)) {
      // New addition
      setPendingAdd((prev) => [...prev, user.id]);
    }
  };

  const handleRemoveUser = (userId: number) => {
    if (lockedIds.includes(userId)) return;
    if (pendingAdd.includes(userId)) {
      // Revert a pending add
      setPendingAdd((prev) => prev.filter((id) => id !== userId));
    } else {
      // Mark existing member for removal
      setPendingRemove((prev) => [...prev, userId]);
    }
  };

  const handleSave = async () => {
    const payload: { add?: number[]; remove?: number[] } = {};
    if (pendingAdd.length > 0) payload.add = pendingAdd;
    if (pendingRemove.length > 0) payload.remove = pendingRemove;
    await onUpdateMembers(payload);
    handleClose();
  };

  const handleClose = () => {
    setPendingAdd([]);
    setPendingRemove([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Manage Members
            </Typography>
          </Box>
          <IconButton size="small" onClick={handleClose} disabled={isLoading}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="caption" color="text.secondary">
          Room: <strong>{room.name}</strong> · {room.visibility.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5}>
          {/* Error */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Pending changes indicator */}
          {hasPendingChanges && (
            <Alert severity="info" sx={{ py: 0.5 }}>
              {pendingAdd.length > 0 && `${pendingAdd.length} to add`}
              {pendingAdd.length > 0 && pendingRemove.length > 0 && ' · '}
              {pendingRemove.length > 0 && `${pendingRemove.length} to remove`}
              {' — click Save to apply.'}
            </Alert>
          )}

          {/* Add member autocomplete */}
          <Autocomplete<UserOption>
            options={availableToAdd}
            getOptionLabel={(u) =>
              `${u.first_name} ${u.last_name} (${u.email})`
            }
            onChange={handleAddUser}
            value={null}
            disabled={isLoading}
            clearOnEscape
            blurOnSelect
            renderInput={(params) => {
              const { slotProps, ...rest } = params;

              return (
                <TextField
                  {...rest}
                  size="small"
                  label="Add a member"
                  placeholder="Search by name or email…"
                  slotProps={{
                    ...slotProps,
                    input: {
                      ...slotProps?.input,
                      startAdornment: (
                        <>
                          <PersonAddIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              color: 'text.disabled',
                            }}
                          />
                          {slotProps?.input?.startAdornment}
                        </>
                      ),
                    },
                  }}
                />
              );
            }}
            renderOption={(props, option) => {
              const { key, ...liProps } = props as any;

              return (
                <Box
                  component="li"
                  key={option.id}
                  {...liProps}
                >
                  <Avatar sx={{ width: 28, height: 28, mr: 1.5, fontSize: '0.7rem' }}>
                    {getInitials(option)}
                  </Avatar>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {option.first_name} {option.last_name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {option.email} · {option.role.replace('_', ' ')}
                    </Typography>
                  </Box>
                </Box>
              );
            }}
            noOptionsText={
              availableToAdd.length === 0
                ? 'All users are already members'
                : 'No matching users'
            }
          />

          <Divider />

          {/* Current members list */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }} gutterBottom color="text.secondary">
              Current Members ({currentMembers.length})
            </Typography>

            {currentMembers.length === 0 ? (
              <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                No members yet.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {currentMembers.map((user) => {
                  const isLocked = lockedIds.includes(user.id);
                  const isPendingRemove = pendingRemove.includes(user.id);
                  const isPendingAdd = pendingAdd.includes(user.id);
                  return (
                    <Box
                      key={user.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        px: 1.5,
                        py: 1,
                        borderRadius: 2,
                        bgcolor: isPendingRemove
                          ? 'error.light'
                          : isPendingAdd
                            ? 'success.light'
                            : 'action.hover',
                        opacity: isPendingRemove ? 0.6 : 1,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                        {getInitials(user)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.first_name} {user.last_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Box>
                      <Chip
                        label={user.role.replace('_', ' ')}
                        size="small"
                        color={getRoleChipColor(user.role)}
                        variant="outlined"
                        sx={{ fontSize: '0.65rem' }}
                      />
                      {isLocked ? (
                        <Tooltip title="Room creator — cannot be removed">
                          <Chip label="Creator" size="small" color="default" />
                        </Tooltip>
                      ) : (
                        <Tooltip title={isPendingRemove ? 'Undo remove' : 'Remove from room'}>
                          <IconButton
                            size="small"
                            color={isPendingRemove ? 'primary' : 'error'}
                            onClick={() => handleRemoveUser(user.id)}
                            disabled={isLoading}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isLoading || !hasPendingChanges}
          startIcon={isLoading ? <CircularProgress size={16} /> : undefined}
        >
          {isLoading ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageMembersDialog;
