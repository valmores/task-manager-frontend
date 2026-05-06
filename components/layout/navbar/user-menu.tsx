"use client";

import React, { useState } from 'react';
import { Box, IconButton, Avatar, Menu, MenuItem, Typography, useTheme, Divider } from '@mui/material';
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
  const theme = useTheme();
  const router = useRouter()

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleProfileClick = () => {
    handleClose();
    //TODO: add profile route
    router.push('/profile');
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
      onClick: () => {
        handleClose();
        onLogout();
      },
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
    </Box>
  );
};
