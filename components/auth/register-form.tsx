"use client";

import React, { useState } from 'react';
import NextLink from 'next/link';

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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useRegister } from '@/hooks/use-auth';

export function RegisterForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const { mutate, isPending, errorMsg, errorData } = useRegister();

  const getFieldError = (field: string) => {
    if (errorData && typeof errorData === 'object' && errorData[field]) {
      const fieldError = errorData[field];
      return Array.isArray(fieldError) ? fieldError.join(' ') : fieldError;
    }
    return null;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    mutate({
      first_name: firstName,
      last_name: lastName,
      email,
      password
    });
  };

  // Only show the top Alert for local errors or if there's no specific field error data
  const showTopError = localError || (errorMsg && (!errorData || typeof errorData !== 'object' || errorData.detail));

  return (
    <Box component="form" onSubmit={handleRegister} sx={{ width: '100%', mt: 1 }}>
      {showTopError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {localError || errorMsg}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          id="first-name"
          label="First Name"
          name="firstName"
          type="text"
          autoComplete="given-name"
          required
          fullWidth
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={!!getFieldError('first_name')}
          helperText={getFieldError('first_name')}
          placeholder="John"
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
          id="last-name"
          label="Last Name"
          name="lastName"
          type="text"
          autoComplete="family-name"
          required
          fullWidth
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={!!getFieldError('last_name')}
          helperText={getFieldError('last_name')}
          placeholder="Doe"
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
          error={!!getFieldError('email')}
          helperText={getFieldError('email')}
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
          error={!!getFieldError('password') || (password.length > 0 && password.length < 8)}
          helperText={getFieldError('password')}
          placeholder="••••••••"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: password.length >= 8 && (
                <InputAdornment position="end">
                  <CheckCircleIcon fontSize="small" color="success" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ mt: -1, display: 'block' }}>
          Password must be at least 8 characters long and not be a common password.
        </Typography>

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
              endAdornment: (password === confirmPassword) && (
                <InputAdornment position="end">
                  <CheckCircleIcon fontSize="small" color="success" />
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
        disabled={isPending}
        sx={{
          mt: 4,
          mb: 3,
          py: 1.5,
          fontSize: '1rem',
        }}
      >
        {isPending ? (
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
