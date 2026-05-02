"use client";

import React from 'react';
import {
  Container,
  Box,
  Typography,
} from '@mui/material';
import { ThemeToggle } from '@/components/theme-toggle';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
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
                Create account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join us to start managing your tasks more effectively
              </Typography>
            </Box>

            <RegisterForm />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
