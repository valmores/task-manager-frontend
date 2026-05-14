import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AdminHeaderProps {
  onCreateClick: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onCreateClick }) => {
  return (
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
        onClick={onCreateClick}
        sx={{ px: 3, py: 1, borderRadius: 2 }}
      >
        Create User
      </Button>
    </Box>
  );
};
