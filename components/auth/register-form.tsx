"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
// import api from '@/lib/api';

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
import PersonIcon from '@mui/icons-material/Person';

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    // try {
    //   await api.post('/users/register/', { name, email, password });
    //   router.push('/login?registered=true');
    // } catch (err: any) {
    //   setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    // } finally {
    setIsLoading(false);
    // }
  };

  return (
    <Box component="form" onSubmit={handleRegister} sx={{ width: '100%', mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          id="name"
          label="Full Name"
          name="name"
          type="text"
          autoComplete="name"
          required
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          id="email"
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
          autoComplete="new-password"
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

        <TextField
          id="confirm-password"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          fullWidth
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          'Sign up'
        )}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <MuiLink
            component={NextLink}
            href="/login"
            underline="hover"
            color="primary"
            sx={{ fontWeight: 600 }}
          >
            Sign in
          </MuiLink>
        </Typography>
      </Box>
    </Box>
  );
}
