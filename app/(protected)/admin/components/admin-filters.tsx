import React from 'react';
import { Paper, Stack, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface AdminFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export const AdminFilters: React.FC<AdminFiltersProps> = ({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}) => {
  return (
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
  );
};
