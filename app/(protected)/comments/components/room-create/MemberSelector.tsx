'use client';

import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

interface UserOption {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface MemberSelectorProps {
  /** IDs of currently selected members */
  value: number[];
  /** All available users to select from */
  users: UserOption[];
  /** IDs that should be locked (cannot be removed — e.g., room creator) */
  lockedIds?: number[];
  onChange: (newMemberIds: number[]) => void;
  disabled?: boolean;
}

const getRoleColor = (role: string): 'default' | 'primary' | 'secondary' => {
  if (role === 'admin') return 'secondary';
  if (role === 'project_owner') return 'primary';
  return 'default';
};

const getInitials = (firstName: string, lastName: string) =>
  `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || '?';

export const MemberSelector: React.FC<MemberSelectorProps> = ({
  value,
  users,
  lockedIds = [],
  onChange,
  disabled = false,
}) => {
  const selectedUsers = users.filter((u) => value.includes(u.id));
  const unselectedUsers = users.filter((u) => !value.includes(u.id));

  const handleAdd = (_: React.SyntheticEvent, user: UserOption | null) => {
    if (!user) return;
    if (!value.includes(user.id)) {
      onChange([...value, user.id]);
    }
  };

  const handleRemove = (userId: number) => {
    if (lockedIds.includes(userId)) return;
    onChange(value.filter((id) => id !== userId));
  };

  return (
    <Box>
      <Typography
        variant="body2"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >
        Initial Members
      </Typography>

      {/* Selected members as chips */}
      {selectedUsers.length > 0 && (
        <Stack
          sx={{ flexWrap: 'wrap', mb: 1.5, direction: "row", gap: 1 }}
        >
          {selectedUsers.map((user) => {
            const isLocked = lockedIds.includes(user.id);
            return (
              <Chip
                key={user.id}
                avatar={
                  <Avatar sx={{ width: 24, height: 24, fontSize: '0.65rem' }}>
                    {getInitials(user.first_name, user.last_name)}
                  </Avatar>
                }
                label={`${user.first_name} ${user.last_name}`}
                color={getRoleColor(user.role)}
                variant={isLocked ? 'filled' : 'outlined'}
                onDelete={isLocked ? undefined : () => handleRemove(user.id)}
                size="small"
                title={isLocked ? 'Room creator (cannot be removed)' : user.email}
                sx={{ maxWidth: 200 }}
              />
            );
          })}
        </Stack>
      )}

      {/* Autocomplete search to add members */}
      <Autocomplete<UserOption>
        options={unselectedUsers}
        getOptionLabel={(option) =>
          `${option.first_name} ${option.last_name} (${option.email})`
        }
        onChange={handleAdd}
        value={null}
        disabled={disabled}
        clearOnEscape
        blurOnSelect
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder="Search and add members…"
            slotProps={{
              input: {
                ...params.slotProps?.input,
                startAdornment: (
                  <>
                    <PersonAddIcon
                      fontSize="small"
                      sx={{ mr: 0.5, color: 'text.disabled' }}
                    />
                    {params.slotProps?.input?.startAdornment}
                  </>
                ),
              },
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            <Avatar sx={{ width: 28, height: 28, mr: 1.5, fontSize: '0.7rem' }}>
              {getInitials(option.first_name, option.last_name)}
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
        )}
        noOptionsText={
          unselectedUsers.length === 0
            ? 'All users already added'
            : 'No users found'
        }
      />
    </Box>
  );
};

export default MemberSelector;
