"use client";

import React, { useState, useMemo } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuthStore } from '@/store/useAuthStore';
import { AdminUser } from '@/types/task';
import { AdminUserModal } from './components/admin-user-modal';
import { AdminHeader } from './components/AdminHeader';
import { AdminFilters } from './components/AdminFilters';
import { AdminUsersTable } from './components/AdminUsersTable';
import { StatusConfirmDialog } from './components/StatusConfirmDialog';

import { useAdminUsers, useUpdateAdminUser, useDeactivateUser } from '@/hooks/users/use-admin-users';

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
      <AdminHeader onCreateClick={() => {
        setEditingUser(null);
        setIsModalOpen(true);
      }} />

      <AdminFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <AdminUsersTable
        users={filteredUsers || []}
        currentUserId={currentUser?.id}
        onEditClick={handleEditClick}
        onStatusClick={handleStatusClick}
      />

      <AdminUserModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
      />

      <StatusConfirmDialog
        open={confirmDialogOpen}
        user={userToUpdate}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleStatusConfirm}
        isPending={deactivateMutation.isPending || updateMutation.isPending}
      />
    </Container>
  );
}
