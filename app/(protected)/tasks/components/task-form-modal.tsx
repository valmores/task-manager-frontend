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
import { useAuthStore } from '@/store/use-auth-store';
import { useCreateNote } from '@/hooks/tasks/use-notes';

// Sub-components
import { TaskFormHeader } from './task-form/task-form-header';
import { TaskFormReadOnlyView } from './task-form/task-form-read-only-view';
import { TaskFormCoreFields } from './task-form/task-form-core-fields';
import { TaskFormMetadataFields } from './task-form/task-form-metadata-fields';
import { TaskFormStatusField } from './task-form/task-form-status-field';
import { TaskFormActions } from './task-form/task-form-actions';
import { Typography } from '@mui/material';
import { TaskSignatureDialog } from './task-form/task-signature-dialog/task-signature-dialog';
import { useUpdateProfile } from '@/hooks/users/use-update-profile';
import { SignatureImagePreview } from '@/components/ui/signature-image-preview';

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
  const updateProfileMutation = useUpdateProfile();

  const [signatureDialogOpen, setSignatureDialogOpen] = useState(false);
  const [pendingSubmitData, setPendingSubmitData] = useState<any>(null);

  const isLoading = createTaskMutation.isPending || updateTaskMutation.isPending || updateProfileMutation.isPending;

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

  const handleSignatureConfirm = async (signatureDataUrl: string, saveToProfile: boolean) => {
    setSignatureDialogOpen(false);

    if (saveToProfile) {
      try {
        await updateProfileMutation.mutateAsync({ signature: signatureDataUrl });
      } catch (err) {
        console.error('Failed to save signature to profile:', err);
      }
    }

    const finalSubmissionData = {
      ...pendingSubmitData,
      signature: signatureDataUrl,
      signed_at: new Date().toISOString(),
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
      updateTaskMutation.mutate({ id: task.id, data: finalSubmissionData }, mutationOptions);
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

    if (isRegularUser && isEditMode && formData.status === 'done') {
      setPendingSubmitData(submissionData);
      setSignatureDialogOpen(true);
      return;
    }

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

            {isEditMode && task?.signature && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  border: `1px dashed ${theme.palette.divider}`,
                  backgroundColor: theme.palette.action.hover,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                  Completion Signature
                </Typography>
                
                <SignatureImagePreview
                  src={task.signature}
                  maxHeight={80}
                />

                {task.signed_at && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                    Signed on {new Date(task.signed_at).toLocaleString()}
                  </Typography>
                )}
              </Box>
            )}

          </Stack>
        </DialogContent>

        <TaskFormActions
          onClose={onClose}
          isLoading={isLoading}
          isEditMode={isEditMode}
          isSubmitDisabled={!formData.title}
          submitLabel={isRegularUser && isEditMode && formData.status === 'done' ? 'Sign & Update' : undefined}
        />
      </Box>
      <TaskSignatureDialog
        open={signatureDialogOpen}
        taskTitle={formData.title}
        savedSignature={user?.signature || null}
        onConfirm={handleSignatureConfirm}
        onCancel={() => setSignatureDialogOpen(false)}
      />
    </Dialog>
  );
};

