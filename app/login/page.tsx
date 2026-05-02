"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
// import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

// MUI Components
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Alert,
  CircularProgress,
  InputAdornment,
  useTheme,
} from '@mui/material';

// MUI Icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LoginPage() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // try {
    //   const loginRes = await api.post('/users/login/', { email, password });
    //   const { access, refresh } = loginRes.data;

    //   // Get user profile info
    //   const profileRes = await api.get('/users/user-profile/', {
    //     headers: { Authorization: `Bearer ${access}` }
    //   });

    //   setAuth(profileRes.data, access, refresh);
    //   router.push('/tasks');
    // } catch (err: any) {
    //   setError(err.response?.data?.detail || 'Invalid email or password');
    // } finally {
    setIsLoading(false);
    // }
  };

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
              <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please enter your details to sign in to your account
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', mt: 1 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  id="email-address"
                  label="Email address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 4,
                  mb: 3,
                  py: 1.5,
                  bgcolor: isDarkMode ? 'grey.100' : 'grey.900',
                  color: isDarkMode ? 'grey.900' : 'grey.100',
                  '&:hover': {
                    bgcolor: isDarkMode ? 'grey.300' : 'grey.800',
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign in'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <MuiLink
                    component={NextLink}
                    href="/register"
                    underline="hover"
                    sx={{ fontWeight: 'medium', color: 'text.primary' }}
                  >
                    Sign up
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
