"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Stack,
  useTheme,
} from '@mui/material';
import { Task } from '@/types/task';
import { useCreateTask, useUpdateTask } from '@/hooks/tasks/use-tasks';
import { useProjects } from '@/hooks/projects/use-projects';
import { useUsers } from '@/hooks/users/use-users';
import { useAuthStore } from '@/store/useAuthStore';
import { useCreateNote } from '@/hooks/tasks/use-notes';

// Sub-components
import { TaskFormHeader } from './task-form/task-form-header';
import { TaskFormReadOnlyView } from './task-form/task-form-read-only-view';
import { TaskFormCoreFields } from './task-form/task-form-core-fields';
import { TaskFormMetadataFields } from './task-form/task-form-metadata-fields';
import { TaskFormStatusField } from './task-form/task-form-status-field';
import { TaskFormActions } from './task-form/task-form-actions';

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
      status: isEditMode ? formData.status : 'todo',
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
        <TaskFormHeader
          isEditMode={isEditMode}
          canUpdateStatusOnly={canUpdateStatusOnly}
          canUpdateAssignmentOnly={canUpdateAssignmentOnly}
          onClose={onClose}
        />

        <DialogContent dividers sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* --- READ ONLY VIEW FOR REGULAR USERS / OWNERS (partial) --- */}
            {(canUpdateStatusOnly || canUpdateAssignmentOnly) && isEditMode && (
              <TaskFormReadOnlyView
                task={task}
                formData={formData}
                canUpdateAssignmentOnly={canUpdateAssignmentOnly}
              />
            )}

            {/* --- FULL EDIT VIEW FOR ADMINS / CREATE VIEW FOR OWNERS / ASSIGNMENT FOR OWNERS --- */}
            {((!canUpdateStatusOnly && !canUpdateAssignmentOnly) || !isEditMode || canUpdateAssignmentOnly) && (
              <>
                <TaskFormCoreFields
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  isEditMode={isEditMode}
                  canEditAllFields={canEditAllFields}
                />

                <TaskFormMetadataFields
                  formData={formData}
                  errors={errors}
                  handleChange={handleChange}
                  isEditMode={isEditMode}
                  canEditAllFields={canEditAllFields}
                  canUpdateAssignmentOnly={canUpdateAssignmentOnly}
                  projects={projects}
                  users={users}
                />
              </>
            )}

            {/* --- STATUS FIELD (ALWAYS EDITABLE IN EDIT MODE FOR ADMIN/USER, NOT OWNER, DISABLED IN CREATE) --- */}
            {(!isEditMode || (isEditMode && !canUpdateAssignmentOnly)) && (
              <TaskFormStatusField
                formData={formData}
                handleChange={handleChange}
                canUpdateStatusOnly={canUpdateStatusOnly}
                disabled={!isEditMode}
              />
            )}

          </Stack>
        </DialogContent>

        <TaskFormActions
          onClose={onClose}
          isLoading={isLoading}
          isEditMode={isEditMode}
          isSubmitDisabled={!formData.title}
        />
      </Box>
    </Dialog>
  );
};

