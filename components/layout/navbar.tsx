"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AppBar, Toolbar, Container, useTheme } from '@mui/material';
import { useAuthStore } from '@/store/use-auth-store';
import { useQueryClient } from '@tanstack/react-query';

// Sub-components
import { NavLogo } from './navbar/nav-logo';
import { DesktopNav } from './navbar/desktop-nav';
import { UserMenu } from './navbar/user-menu';
import { MobileDrawer } from './navbar/mobile-drawer';

export function Navbar() {
  const router = useRouter();
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Helper to check if a route is active
  const isActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    return pathname === path || pathname?.startsWith(path + '/');
  };

  // Centralized navigation links
  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projects', href: '/projects' },
    { name: 'Tasks', href: '/tasks' },
    { name: 'Comments', href: '/comments' },
    ...(user?.role === 'admin' ? [{ name: 'Admin', href: '/admin' }] : []),
  ];

  const handleLogout = () => {
    queryClient.clear();
    logout();
    router.replace('/login');
  };

  return (
    <>
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
            <NavLogo onToggle={() => setIsDrawerOpen(true)} />

            <DesktopNav links={navLinks} isActive={isActive} />

            <UserMenu user={user} onLogout={handleLogout} />
          </Toolbar>
        </Container>
      </AppBar>

      <MobileDrawer
        open={isDrawerOpen}
        onToggle={() => setIsDrawerOpen(false)}
        links={navLinks}
        isActive={isActive}
      />
    </>
  );
}
