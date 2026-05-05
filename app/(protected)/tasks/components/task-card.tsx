"use client";

import React, { useState } from 'react';
import { Card, CardContent, Stack } from '@mui/material';
import { Task } from '@/types/task';
import { useDeleteTask } from '@/hooks/tasks/use-tasks';
import { TaskCommentsModal } from './task-comments-modal';
import { isOverdue } from '../utils/task-helpers';

// Sub-components
import { TaskStatusTitle } from './task-card/task-status-title';
import { TaskMetadata } from './task-card/task-metadata';
import { TaskActionButtons } from './task-card/task-action-buttons';
import { TaskDeleteDialog } from './task-card/task-delete-dialog';

interface TaskCardProps {
  task: Task;
  userRole?: string;
  onEdit: (task: Task) => void;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
  getPriorityColor: (priority: string) => string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  userRole,
  onEdit,
  getStatusLabel,
  getStatusColor,
  getPriorityColor
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const deleteMutation = useDeleteTask();

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(task.id, {
      onSuccess: () => setDeleteDialogOpen(false),
    });
  };

  const overdue = isOverdue(task.due_date, task.status);

  return (
    <>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
            borderColor: overdue ? 'error.main' : 'primary.light',
          },
          border: '1px solid',
          borderColor: overdue ? 'error.main' : 'divider',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: '12px 20px !important' }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between' }}
          >
            <TaskStatusTitle
              title={task.title}
              status={task.status}
              getStatusLabel={getStatusLabel}
              getStatusColor={getStatusColor}
            />

            <Stack
              direction="row"
              spacing={3}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                justifyContent: { xs: 'space-between', sm: 'flex-end' },
                alignItems: 'center'
              }}
            >
              <TaskMetadata
                priority={task.priority}
                due_date={task.due_date}
                status={task.status}
                project_name={task.project_name}
                assigned_to_email={task.assigned_to_email}
                getPriorityColor={getPriorityColor}
              />

              <TaskActionButtons
                userRole={userRole}
                onCommentsClick={() => setCommentsModalOpen(true)}
                onEditClick={() => onEdit(task)}
                onDeleteClick={() => setDeleteDialogOpen(true)}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <TaskDeleteDialog
        open={deleteDialogOpen}
        taskTitle={task.title}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <TaskCommentsModal
        open={commentsModalOpen}
        onClose={() => setCommentsModalOpen(false)}
        task={task}
      />
    </>
  );
};
