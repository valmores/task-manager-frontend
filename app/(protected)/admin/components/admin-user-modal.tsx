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
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AdminUser } from '@/types/task';

type AdminUserRole = AdminUser['role'];

interface AdminUserFormData {
  email: string;
  first_name: string;
  last_name: string;
  role: AdminUserRole;
  password: string;
  is_active: boolean;
}
import { useAdminCreateUser, useUpdateAdminUser } from '@/hooks/users/use-admin-users';
import { Alert } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

interface AdminUserModalProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

export const AdminUserModal: React.FC<AdminUserModalProps> = ({ open, onClose, user }) => {
  const isEdit = !!user;
  const createMutation = useAdminCreateUser();
  const updateMutation = useUpdateAdminUser();
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const [formData, setFormData] = React.useState<AdminUserFormData>({
    email: '',
    first_name: '',
    last_name: '',
    role: 'user',
    password: '',
    is_active: true,
  });

  useEffect(() => {
    setError(null);
    if (user) {
      setFormData({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        password: '',
        is_active: user.is_active,
      });
    } else {
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        role: 'user',
        password: '',
        is_active: true,
      });
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validation
    if (!isEdit && formData.password.length < 8) {
      return;
    }

    if (isEdit && user) {
      updateMutation.mutate({ id: user.id, data: formData }, {
        onSuccess: () => onClose(),
        onError: (err: any) => {
          const detail = err.response?.data?.detail || "Failed to update user.";
          setError(detail);
        }
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => onClose(),
        onError: (err: any) => {
          const data = err.response?.data;
          // Flatten errors if they come in object form (e.g. {email: ["..."]})
          const detail = typeof data === 'object'
            ? Object.values(data).flat().join(' ')
            : "Failed to create user.";
          setError(detail);
        }
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle component="div">
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
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

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
              <>
                <TextField
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  error={formData.password.length > 0 && formData.password.length < 8}
                  helperText={formData.password.length > 0 && formData.password.length < 8 ? "Password must be at least 8 characters" : ""}
                  placeholder="••••••••"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                            {formData.password.length >= 8 && (
                              <CheckCircleIcon fontSize="small" color="success" />
                            )}
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                              size="small"
                            >
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </Stack>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: -1.5, display: 'block' }}>
                  Password must be at least 8 characters long.
                </Typography>
              </>
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
              onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminUserRole })}
            >
              <MenuItem value="user">User (Task Execution)</MenuItem>
              <MenuItem value="project_owner">Project Owner (Management)</MenuItem>
              <MenuItem value="admin">Admin (System Access)</MenuItem>
            </TextField>

            {isEdit && (
              <TextField
                select
                label="Account Status"
                fullWidth
                required
                value={formData.is_active ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEdit ? (updateMutation.isPending ? 'Updating...' : 'Update User') : (createMutation.isPending ? 'Creating...' : 'Create User')}
          </Button>
        </DialogActions>
      </form>
    </Dialog >
  );
};
