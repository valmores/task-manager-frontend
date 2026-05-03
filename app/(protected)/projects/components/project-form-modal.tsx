"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Stack,
  useTheme,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Project } from '@/types/task';
import { useCreateProject, useUpdateProject } from '@/hooks/use-projects';

interface ProjectFormModalProps {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ open, onClose, project }) => {
  const theme = useTheme();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [project, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const options = {
      onSuccess: () => {
        onClose();
      }
    };

    if (project) {
      updateMutation.mutate({ id: project.id, data: formData }, options);
    } else {
      createMutation.mutate(formData, options);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
          },
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ m: 0, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography
            variant="h5"
            component="span"
            sx={{ fontWeight: 700, color: 'primary.main' }}
          >
            {project ? 'Edit Project' : 'Create New Project'}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'grey.500' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              label="Project Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              autoFocus
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formData.name || isLoading}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              minWidth: 140
            }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : (project ? 'Update Project' : 'Create Project')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
