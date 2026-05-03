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
  Divider,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import { Task } from '@/types/task';
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks';
import { useProjects } from '@/hooks/use-projects';
import { useUsers } from '@/hooks/use-users';
import { useAuthStore } from '@/store/useAuthStore';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (taskData: any) => void;
  task?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ open, onClose, onSubmit, task }) => {
  const theme = useTheme();
  const { user } = useAuthStore();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const { data: projects } = useProjects();
  const { data: users } = useUsers();

  const isAdmin = user?.role === 'admin';
  const isOwner = user?.role === 'project_owner';
  const isRegularUser = user?.role === 'user';

  // Strict RBAC: Project Owners can Create/Assign but NOT Edit
  const canEditAllFields = isAdmin;
  const canUpdateStatusOnly = isRegularUser;
  const isEditMode = !!task;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assigned_to: '',
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
        assigned_to: task.assigned_to?.toString() || '',
        priority: task.priority,
        due_date: task.due_date || '',
        status: task.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        project: '',
        assigned_to: '',
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
      assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null,
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

  const renderReadOnlyField = (label: string, value: string | null | undefined, Icon: any) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Icon sx={{ fontSize: 16, mr: 0.5 }} /> {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500, ml: 2.5 }}>
        {value || 'Not specified'}
      </Typography>
    </Box>
  );

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
            {isEditMode ? (canUpdateStatusOnly ? 'Update Task Status' : 'Edit Task') : 'Create New Task'}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* --- READ ONLY VIEW FOR REGULAR USERS --- */}
            {canUpdateStatusOnly && isEditMode && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>{formData.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>{formData.description || 'No description provided.'}</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 6 }}>
                    {renderReadOnlyField('Project', task?.project_name, FolderIcon)}
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    {renderReadOnlyField('Priority', formData.priority.toUpperCase(), FlagIcon)}
                  </Grid>
                  <Grid size={{ xs: 6, md: 6 }}>
                    {renderReadOnlyField('Due Date', formData.due_date, EventIcon)}
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* --- FULL EDIT VIEW FOR ADMINS / CREATE VIEW FOR OWNERS --- */}
            {(!canUpdateStatusOnly || !isEditMode) && (
              <>
                <TextField
                  required
                  fullWidth
                  disabled={!canEditAllFields && isEditMode}
                  label="Task Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  variant="outlined"
                  autoFocus={!isEditMode}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  disabled={!canEditAllFields && isEditMode}
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    select
                    fullWidth
                    disabled={!canEditAllFields && isEditMode}
                    label="Project (Optional)"
                    name="project"
                    value={formData.project}
                    onChange={handleChange}
                    slotProps={{ input: { startAdornment: <FolderIcon sx={{ mr: 1, color: 'primary.main' }} /> } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {projects?.map((p) => <MenuItem key={p.id} value={p.id.toString()}>{p.name}</MenuItem>)}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    disabled={!canEditAllFields && isEditMode}
                    label="Assign To"
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleChange}
                    slotProps={{ input: { startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} /> } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {users?.map((u) => (
                      <MenuItem key={u.id} value={u.id.toString()}>
                        {u.first_name} {u.last_name} ({u.email})
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    select
                    fullWidth
                    disabled={!canEditAllFields && isEditMode}
                    label="Priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    disabled={!canEditAllFields && isEditMode}
                    label="Due Date"
                    name="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleChange}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Stack>
              </>
            )}

            {/* --- STATUS FIELD (ALWAYS EDITABLE IN EDIT MODE) --- */}
            {isEditMode && (
              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: canUpdateStatusOnly ? 'primary.50' : 'transparent' } }}
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
          <Button onClick={onClose} sx={{ color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!formData.title || isLoading}
            sx={{ px: 4, py: 1, borderRadius: 2, fontWeight: 700, minWidth: 140 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? 'Update Task' : 'Create Task')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

