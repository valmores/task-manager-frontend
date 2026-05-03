"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FlagIcon from '@mui/icons-material/Flag';
import EventIcon from '@mui/icons-material/Event';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import { Task } from '@/types/task';
import { useDeleteTask } from '@/hooks/use-tasks';

interface TaskCardProps {
  task: Task;
  isAdminOrOwner: boolean;
  onEdit: (task: Task) => void;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isAdminOrOwner,
  onEdit,
  getStatusLabel,
  getStatusColor,
  getPriorityColor
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const deleteMutation = useDeleteTask();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(task.id, {
      onSuccess: () => setDeleteDialogOpen(false),
    });
  };

  return (
    <>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            borderColor: 'primary.light',
          },
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent sx={{ p: '12px 20px !important' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}
          >
            {/* Status & Title */}
            <Stack direction="row" spacing={2} sx={{ flexGrow: 1, minWidth: 0, alignItems: 'center' }}>
              <Chip
                label={getStatusLabel(task.status)}
                color={getStatusColor(task.status) as any}
                size="small"
                sx={{
                  fontWeight: 600,
                  borderRadius: 1.5,
                  minWidth: 90,
                  fontSize: '0.75rem',
                }}
              />
              <Typography
                variant="subtitle1"
                noWrap
                sx={{
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block'
                }}
              >
                {task.title}
              </Typography>
            </Stack>

            {/* Details */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'space-between', sm: 'flex-end' },
                alignItems: 'center'
              }}
            >
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', minWidth: 80 }}>
                <FlagIcon fontSize="small" color={getPriorityColor(task.priority) as any} />
                <Typography variant="caption" sx={{ textTransform: 'capitalize', fontWeight: 600 }}>
                  {task.priority}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', minWidth: 100 }}>
                <EventIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {task.due_date || 'No date'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', minWidth: 120, display: { xs: 'none', lg: 'flex' } }}>
                <FolderIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 120 }}>
                  {task.project_name || 'No Project'}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', minWidth: 150, display: { xs: 'none', md: 'flex' } }}>
                <PersonIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary" noWrap>
                  {task.assigned_to_email || 'Unassigned'}
                </Typography>
              </Stack>

              {/* Actions */}
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Edit">
                  <IconButton size="small" color="primary" onClick={() => onEdit(task)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                {isAdminOrOwner && (
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={handleDeleteClick}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Task?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{task.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

