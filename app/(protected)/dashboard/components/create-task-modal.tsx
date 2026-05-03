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
  MenuItem,
  Stack,
  useTheme,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import FolderIcon from '@mui/icons-material/Folder';
import { Task } from '@/types/task';
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks';
import { useProjects } from '@/hooks/use-projects';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (taskData: any) => void;
  task?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ open, onClose, onSubmit, task }) => {
  const theme = useTheme();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const { data: projects } = useProjects();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'medium',
    due_date: '',
    status: 'todo',
  });

  const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        project: task.project?.toString() || '',
        priority: task.priority,
        due_date: task.due_date || '',
        status: task.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        project: '',
        priority: 'medium',
        due_date: '',
        status: 'todo',
      });
    }
  }, [task, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      project: formData.project ? parseInt(formData.project) : null,
    };

    const mutationOptions = {
      onSuccess: (data: any) => {
        if (onSubmit) onSubmit(data);
        onClose();
      }
    };

    if (task) {
      updateTaskMutation.mutate({ id: task.id, data: submissionData }, mutationOptions);
    } else {
      createTaskMutation.mutate(submissionData, mutationOptions);
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
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
          },
        },
      }}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ m: 0, p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
            {task ? 'Edit Task' : 'Create New Task'}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: (theme) => theme.palette.grey[500],
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3, borderTop: '1px solid rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Stack spacing={3}>
            <TextField
              required
              fullWidth
              label="Task Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              variant="outlined"
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details about this task..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <TextField
              select
              fullWidth
              label="Project (Optional)"
              name="project"
              value={formData.project}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: <FolderIcon sx={{ mr: 1, color: 'primary.main' }} />,
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            >
              <MenuItem value="">None</MenuItem>
              {projects?.map((project) => (
                <MenuItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
                fullWidth
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                slotProps={{
                  input: {
                    startAdornment: <FlagIcon sx={{ mr: 1, color: formData.priority === 'high' ? 'error.main' : formData.priority === 'medium' ? 'warning.main' : 'info.main' }} />,
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>

              <TextField
                fullWidth
                label="Due Date"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    startAdornment: <EventIcon sx={{ mr: 1, color: 'action.active' }} />,
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Stack>

            {task && (
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="on_hold">On Hold</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </TextField>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formData.title || isLoading}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              fontWeight: 700,
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(0,118,255,0.23)',
              },
              minWidth: 140
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              task ? 'Update Task' : 'Create Task'
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

