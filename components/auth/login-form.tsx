"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
// import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

// MUI Components
import {
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';

// MUI Icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export function LoginForm() {
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
                  <EmailIcon fontSize="small" color="action" />
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
                  <LockIcon fontSize="small" color="action" />
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
          fontSize: '1rem',
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
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Sign up
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
