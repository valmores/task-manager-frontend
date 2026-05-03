"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { Navbar } from '@/components/layout/navbar';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated) {
      if (!user) {
        router.replace('/login');
      } else if (pathname.startsWith('/admin') && user.role !== 'admin') {
        router.replace('/dashboard');
      }
    }
  }, [isHydrated, user, router, pathname]);

  // While Zustand is rehydrating from localStorage, show a spinner
  // to avoid a flash-redirect for users who ARE authenticated.
  if (!isHydrated) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Not authenticated — render nothing while the redirect fires
  if (!user) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          transition: 'background-color 0.3s ease',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
