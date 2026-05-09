'use client';

import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Typography, 
  FormHelperText 
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { RoomVisibility } from '@/types/internal-notes';

interface VisibilitySelectorProps {
  value: RoomVisibility;
  onChange: (e: SelectChangeEvent<any>) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

const VISIBILITY_OPTIONS = [
  { 
    value: RoomVisibility.INTERNAL, 
    label: 'Internal', 
    caption: 'All authenticated users', 
    icon: '🌍' 
  },
  { 
    value: RoomVisibility.PROJECT_SPECIFIC, 
    label: 'Project Specific', 
    caption: 'Project members only', 
    icon: '📁' 
  },
  { 
    value: RoomVisibility.PRIVATE, 
    label: 'Private', 
    caption: 'Invited members only', 
    icon: '👥' 
  },
  { 
    value: RoomVisibility.ADMIN_ONLY, 
    label: 'Admin Only', 
    caption: 'Admins only', 
    icon: '🔒' 
  },
];

export const VisibilitySelector: React.FC<VisibilitySelectorProps> = ({
  value,
  onChange,
  onBlur,
  error,
  touched,
  disabled,
}) => {
  return (
    <FormControl fullWidth error={touched && !!error}>
      <InputLabel>Visibility Level</InputLabel>
      <Select
        label="Visibility Level"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
      >
        {VISIBILITY_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{option.icon}</span>
              <div>
                <Typography variant="body2">{option.label}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {option.caption}
                </Typography>
              </div>
            </Box>
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>
        {(touched && error) || 'Select who should have access to this room'}
      </FormHelperText>
    </FormControl>
  );
};
