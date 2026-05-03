"use client";

import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuthStore } from '@/store/useAuthStore';
import { AdminUser } from '@/types/task';
import { AdminUserModal } from './components/admin-user-modal';

import { useAdminUsers, useUpdateAdminUser, useDeactivateUser } from '@/hooks/use-admin-users';

const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'error';
    case 'project_owner': return 'warning';
    case 'user': return 'primary';
    default: return 'default';
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'Admin';
    case 'project_owner': return 'Owner';
    case 'user': return 'User';
    default: return role;
  }
};

export default function AdminPanelPage() {
  const { user: currentUser } = useAuthStore();
  const { data: users, isLoading, isError } = useAdminUsers();
  const updateMutation = useUpdateAdminUser();
  const deactivateMutation = useDeactivateUser();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    return users?.filter((u) => {
      const name = `${u.first_name} ${u.last_name}`.toLowerCase();
      const matchesSearch = name.includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? u.is_active : !u.is_active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleEditClick = (user: AdminUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleStatusClick = (user: AdminUser) => {
    setUserToUpdate(user);
    setConfirmDialogOpen(true);
  };

  const handleStatusConfirm = () => {
    if (userToUpdate) {
      if (userToUpdate.is_active) {
        // Deactivate
        deactivateMutation.mutate(userToUpdate.id, {
          onSuccess: () => setConfirmDialogOpen(false),
        });
      } else {
        // Activate
        updateMutation.mutate({ id: userToUpdate.id, data: { is_active: true } }, {
          onSuccess: () => setConfirmDialogOpen(false),
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Error loading users. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            Admin Panel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system users, roles, and account statuses.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          sx={{ px: 3, py: 1, borderRadius: 2 }}
        >
          Create User
        </Button>
      </Box>

      {/* Filters Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            placeholder="Search by name or email..."
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }
            }}
          />
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Role Filter</InputLabel>
            <Select
              value={roleFilter}
              label="Role Filter"
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="admin">Admins</MenuItem>
              <MenuItem value="project_owner">Project Owners</MenuItem>
              <MenuItem value="user">Users</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.default' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Joined</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers?.map((u) => {
              const isSelf = u.id === currentUser?.id;
              return (
                <TableRow key={u.id} hover sx={{ opacity: u.is_active ? 1 : 0.6 }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: getRoleColor(u.role) + '.light', color: getRoleColor(u.role) + '.main', fontWeight: 700 }}>
                        {u.first_name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {u.first_name} {u.last_name} {isSelf && "(You)"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {u.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(u.role)}
                      color={getRoleColor(u.role) as any}
                      size="small"
                      sx={{ fontWeight: 600, borderRadius: 1.5, minWidth: 80 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.is_active ? 'Active' : 'Inactive'}
                      color={u.is_active ? 'success' : 'default'}
                      size="small"
                      variant={u.is_active ? 'filled' : 'outlined'}
                      sx={{ fontWeight: 600, borderRadius: 1.5 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(u.date_joined).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                      <Tooltip title={isSelf ? "Cannot edit your own role" : "Edit User"}>
                        <span>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditClick(u)}
                            disabled={isSelf}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title={u.is_active ? (isSelf ? "Cannot deactivate yourself" : "Deactivate") : "Reactivate"}>
                        <span>
                          <IconButton
                            size="small"
                            color={u.is_active ? "error" : "success"}
                            onClick={() => handleStatusClick(u)}
                            disabled={isSelf}
                          >
                            {u.is_active ? <BlockIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modals */}
      <AdminUserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
      />

      {/* Status Change Confirmation */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle component="div">
          {userToUpdate?.is_active ? 'Deactivate User?' : 'Reactivate User?'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {userToUpdate?.is_active ? (
              <>Are you sure you want to deactivate <strong>{userToUpdate?.first_name} {userToUpdate?.last_name}</strong>? They will no longer be able to log in.</>
            ) : (
              <>Are you sure you want to reactivate <strong>{userToUpdate?.first_name} {userToUpdate?.last_name}</strong>? They will regain access to the system.</>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusConfirm}
            color={userToUpdate?.is_active ? 'error' : 'success'}
            variant="contained"
            disabled={deactivateMutation.isPending || updateMutation.isPending}
          >
            {deactivateMutation.isPending || updateMutation.isPending ? 'Processing...' : (userToUpdate?.is_active ? 'Deactivate' : 'Reactivate')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
