"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Container,
  Link as MuiLink,
  useTheme,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuthStore } from '@/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';

export function Navbar() {
  const router = useRouter();
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    queryClient.clear();
    logout();
    router.replace('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: 'text.primary'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <MuiLink
            component={NextLink}
            href="/dashboard"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.contrastText',
                fontWeight: 'bold',
              }}
            >
              T
            </Box>
            <Typography
              variant="h6"
              noWrap
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
              }}
            >
              TaskMaster
            </Typography>
          </MuiLink>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, ml: 4, flexGrow: 1 }}>
            {[
              { name: 'Dashboard', href: '/dashboard' },
              { name: 'Projects', href: '/projects' },
              { name: 'Tasks', href: '/tasks' },
              ...(user?.role === 'admin' ? [{ name: 'Admin', href: '/admin' }] : []),
            ].map((link) => (
              <MuiLink
                key={link.href}
                component={NextLink}
                href={link.href}
                sx={{
                  color: isActive(link.href) ? 'primary.main' : 'text.secondary',
                  textDecoration: 'none',
                  fontWeight: isActive(link.href) ? 600 : 500,
                  position: 'relative',
                  pb: 0.5,
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {link.name}
                {isActive(link.href) && (
                  <Box
                    component={motion.div}
                    layoutId="activeTab"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      bgcolor: 'primary.main',
                      borderRadius: '1px',
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}
              </MuiLink>
            ))}
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem'
                }}
              >
                {user?.first_name?.charAt(0).toUpperCase() || <AccountCircleIcon />}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.first_name + ' ' + user?.last_name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
              {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem> */}
              <Box sx={{ borderTop: `1px solid ${theme.palette.divider}`, mt: 1 }}>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main', mt: 0.5 }}>
                  <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
