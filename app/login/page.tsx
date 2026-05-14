"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
} from '@mui/material';
import { ThemeToggle } from '@/components/theme-toggle';
import { LoginForm } from '@/components/auth/login-form';
import { useAuthStore } from '@/store/use-auth-store';

export default function LoginPage() {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();

  // If already authenticated, send straight to dashboard
  useEffect(() => {
    if (isHydrated && user) {
      router.replace('/dashboard');
    }
  }, [isHydrated, user, router]);

  // Don't flash the login form while determining auth state
  if (!isHydrated || user) return null;

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <ThemeToggle />
        </Box>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography component="h1" variant="h4" color="primary" sx={{ mb: 1 }}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please enter your details to sign in to your account
              </Typography>
            </Box>

            <LoginForm />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

