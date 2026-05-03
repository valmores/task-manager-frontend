"use client";

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AdminUser } from '@/types/task';

interface AdminUserModalProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

export const AdminUserModal: React.FC<AdminUserModalProps> = ({ open, onClose, user }) => {
  const isEdit = !!user;

  const [formData, setFormData] = React.useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'user',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        password: '', // Password not needed for edit
      });
    } else {
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        role: 'user',
        password: '',
      });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI Only: Just close the modal
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isEdit ? 'Edit User' : 'Create New User'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              disabled={isEdit}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {!isEdit && (
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            )}
            <Stack direction="row" spacing={2}>
              <TextField
                label="First Name"
                fullWidth
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
              <TextField
                label="Last Name"
                fullWidth
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </Stack>
            <TextField
              select
              label="System Role"
              fullWidth
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="user">User (Task Execution)</MenuItem>
              <MenuItem value="project_owner">Project Owner (Management)</MenuItem>
              <MenuItem value="admin">Admin (System Access)</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
          >
            {isEdit ? 'Update User' : 'Create User'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
