"use client";

import React, { useState } from 'react';
import { Box, IconButton, Avatar, Menu, MenuItem, Typography, useTheme, Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ThemeToggle } from '@/components/theme-toggle';
import { useRouter } from 'next/navigation';

interface UserMenuProps {
  user: any;
  onLogout: () => void;
}

export const UserMenu = ({ user, onLogout }: UserMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const theme = useTheme();
  const router = useRouter()

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleProfileClick = () => {
    handleClose();
    //TODO: add profile route
    router.push('/profile');
  }
  
  const handleLogoutClick = () => {
    handleClose();
    setConfirmLogoutOpen(true);
  }
  
  const handleConfirmLogout = () => {
    setConfirmLogoutOpen(false);
    onLogout();
  }
  
  const handleCancelLogout = () => {
    setConfirmLogoutOpen(false);
  }

  const menuItems = [
    {
      label: "Profile",
      onClick: handleProfileClick,
      showDivider: true,
    },
    // {
    //   label: "Settings",
    //   onClick: handleClose,
    //   showDivider: false,
    // },
    {
      label: "Logout",
      onClick: handleLogoutClick,
      icon: <LogoutIcon fontSize="small" sx={{ mr: 1 }} />,
      sx: { color: "error.main", mt: 0.5 },
    },
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <ThemeToggle />
      <IconButton onClick={handleOpen} color="inherit">
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
          {user?.first_name?.charAt(0).toUpperCase() || <AccountCircleIcon />}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {user?.first_name + ' ' + user?.last_name || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email || 'user@example.com'}
          </Typography>
        </Box>
        <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, mt: 1 }}>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <MenuItem onClick={item.onClick} sx={item.sx}>
                {item.icon}
                {item.label}
              </MenuItem>
              {item.showDivider && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      </Menu>
      <Dialog open={confirmLogoutOpen} onClose={handleCancelLogout}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout}>Cancel</Button>
          <Button onClick={handleConfirmLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
