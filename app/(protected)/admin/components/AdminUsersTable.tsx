import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Avatar,
  Box,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AdminUser } from '@/types/task';

interface AdminUsersTableProps {
  users: AdminUser[];
  currentUserId?: number;
  onEditClick: (user: AdminUser) => void;
  onStatusClick: (user: AdminUser) => void;
}

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

export const AdminUsersTable: React.FC<AdminUsersTableProps> = ({
  users,
  currentUserId,
  onEditClick,
  onStatusClick,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the users to display for the current page
  const paginatedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default' }}>Joined</TableCell>
              <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((u) => {
              const isSelf = u.id === currentUserId;
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
                            onClick={() => onEditClick(u)}
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
                            onClick={() => onStatusClick(u)}
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
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    No users found matching your filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
