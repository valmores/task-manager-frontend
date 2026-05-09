'use client';

import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText 
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

interface ProjectSelectorProps {
  value: number | null;
  projects: Array<{ id: number; name: string }>;
  onChange: (e: SelectChangeEvent<any>) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

export const ProjectSelector: React.FC<ProjectSelectorProps> = ({
  value,
  projects,
  onChange,
  onBlur,
  error,
  touched,
  disabled,
}) => {
  return (
    <FormControl fullWidth error={touched && !!error}>
      <InputLabel>Select Project</InputLabel>
      <Select
        label="Select Project"
        value={value || ''}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled || projects.length === 0}
      >
        {projects.length === 0 ? (
          <MenuItem value="" disabled>
            No projects available
          </MenuItem>
        ) : (
          projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))
        )}
      </Select>
      <FormHelperText>
        {(touched && error) || 'Choose the project this room is for'}
      </FormHelperText>
    </FormControl>
  );
};
