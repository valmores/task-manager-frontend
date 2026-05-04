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
  Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import NotesIcon from '@mui/icons-material/Notes';
import { Task, TaskNote } from '@/types/task';
import { useCreateTask, useUpdateTask } from '@/hooks/tasks/use-tasks';
import { useProjects } from '@/hooks/projects/use-projects';
import { useUsers } from '@/hooks/users/use-users';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateNote } from '@/hooks/tasks/use-notes';

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

  const isEditMode = !!task;

  // Strict RBAC: Project Owners can Create/Assign but NOT Edit everything
  const canEditAllFields = isAdmin || (isOwner && !isEditMode);
  const canUpdateStatusOnly = isRegularUser;
  const canUpdateAssignmentOnly = isOwner && isEditMode;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assigned_to: '',
    priority: 'medium',
    due_date: '',
    status: 'todo',
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [noteContent, setNoteContent] = useState('');
  const createNoteMutation = useCreateNote();

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
      setErrors({});
    }
  }, [task, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
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
      },
      onError: (error: any) => {
        if (error.response?.data) {
          setErrors(error.response.data);
        }
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

  const handleAddNote = async () => {
    if (!task || !noteContent.trim()) return;
    
    try {
      await createNoteMutation.mutateAsync({
        task: task.id,
        content: noteContent.trim()
      });
      setNoteContent('');
    } catch (error) {
      console.error('Failed to add note:', error);
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
            {isEditMode
              ? (canUpdateStatusOnly ? 'Update Task Status' : canUpdateAssignmentOnly ? 'Reassign Task' : 'Edit Task')
              : 'Create New Task'
            }
          </Typography>
          <IconButton onClick={onClose} sx={{ color: (theme) => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* --- READ ONLY VIEW FOR REGULAR USERS / OWNERS (partial) --- */}
            {(canUpdateStatusOnly || canUpdateAssignmentOnly) && isEditMode && (
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
                  {canUpdateAssignmentOnly && (
                    <Grid size={{ xs: 6, md: 6 }}>
                      {renderReadOnlyField('Status', formData.status.toUpperCase(), FlagIcon)}
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

            {/* --- FULL EDIT VIEW FOR ADMINS / CREATE VIEW FOR OWNERS / ASSIGNMENT FOR OWNERS --- */}
            {((!canUpdateStatusOnly && !canUpdateAssignmentOnly) || !isEditMode || canUpdateAssignmentOnly) && (
              <>
                {!canUpdateAssignmentOnly && (
                  <>
                    <TextField
                      required
                      fullWidth
                      disabled={!canEditAllFields && isEditMode}
                      label="Task Title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      error={!!errors.title}
                      helperText={errors.title?.[0] || `${(formData.title || '').length}/60`}
                      variant="outlined"
                      autoFocus={!isEditMode}
                      slotProps={{
                        input: {
                          inputProps: { maxLength: 60 }
                        }
                      }}
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
                      error={!!errors.description}
                      helperText={errors.description?.[0] || `${(formData.description || '').length}/150`}
                      variant="outlined"
                      slotProps={{
                        input: {
                          inputProps: { maxLength: 150 }
                        }
                      }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </>
                )}

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {!canUpdateAssignmentOnly && (
                    <TextField
                      select
                      fullWidth
                      disabled={!canEditAllFields && isEditMode}
                      label="Project (Optional)"
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      error={!!errors.project}
                      helperText={errors.project?.[0]}
                      slotProps={{ input: { startAdornment: <FolderIcon sx={{ mr: 1, color: 'primary.main' }} /> } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    >
                      <MenuItem value="">None</MenuItem>
                      {projects?.map((p) => <MenuItem key={p.id} value={p.id.toString()}>{p.name}</MenuItem>)}
                    </TextField>
                  )}

                  <TextField
                    select
                    fullWidth
                    disabled={!canEditAllFields && isEditMode && !canUpdateAssignmentOnly}
                    label="Assign To"
                    name="assigned_to"
                    value={formData.assigned_to}
                    onChange={handleChange}
                    error={!!errors.assigned_to}
                    helperText={errors.assigned_to?.[0]}
                    slotProps={{ input: { startAdornment: <PersonIcon sx={{ mr: 1, color: 'primary.main' }} /> } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: canUpdateAssignmentOnly ? 'primary.50' : 'transparent' } }}
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {users?.map((u) => (
                      <MenuItem key={u.id} value={u.id.toString()}>
                        {u.first_name} {u.last_name} ({u.email})
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                {!canUpdateAssignmentOnly && (
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
                      error={!!errors.due_date}
                      helperText={errors.due_date?.[0]}
                      slotProps={{ inputLabel: { shrink: true } }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </Stack>
                )}
              </>
            )}

            {/* --- STATUS FIELD (ALWAYS EDITABLE IN EDIT MODE FOR ADMIN/USER, NOT OWNER) --- */}
            {isEditMode && !canUpdateAssignmentOnly && (
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

            {/* --- INTERNAL NOTES SECTION (ADMIN/OWNER ONLY) --- */}
            {isEditMode && (isAdmin || isOwner) && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 3 }}>
                  <Chip 
                    label="Internal Notes" 
                    size="small" 
                    icon={<NotesIcon />} 
                    sx={{ fontWeight: 600, px: 1 }} 
                  />
                </Divider>

                {/* Note Input */}
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add an internal note..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNote())}
                    disabled={createNoteMutation.isPending}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <IconButton 
                    color="primary" 
                    onClick={handleAddNote}
                    disabled={!noteContent.trim() || createNoteMutation.isPending}
                  >
                    {createNoteMutation.isPending ? <CircularProgress size={20} /> : <SendIcon />}
                  </IconButton>
                </Stack>

                {/* Notes List */}
                <Stack spacing={2} sx={{ maxHeight: 250, overflowY: 'auto', pr: 1 }}>
                  {task?.notes && task.notes.length > 0 ? (
                    [...task.notes].reverse().map((note) => (
                      <Box 
                        key={note.id} 
                        sx={{ 
                          p: 1.5, 
                          bgcolor: 'action.hover', 
                          borderRadius: 2,
                          borderLeft: 4,
                          borderColor: 'primary.main'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {note.author_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(note.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{note.content}</Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', textAlign: 'center' }}>
                      No internal notes yet.
                    </Typography>
                  )}
                </Stack>
              </Box>
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
