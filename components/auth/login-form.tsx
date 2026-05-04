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
  IconButton,
} from '@mui/material';

// MUI Icons
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useLogin } from '@/hooks/auth/use-auth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState<number>(0);

  const { mutate, isPending, errorMsg, error } = useLogin();

  // Handle Lockout Timer (Persistence and Countdown)
  React.useEffect(() => {
    const lockoutUntil = localStorage.getItem('login_lockout_until');
    if (lockoutUntil) {
      const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000);
      if (remaining > 0) {
        setLockoutTimer(remaining);
      } else {
        localStorage.removeItem('login_lockout_until');
      }
    }
  }, []);

  React.useEffect(() => {
    if (lockoutTimer <= 0) return;

    const interval = setInterval(() => {
      setLockoutTimer((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('login_lockout_until');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutTimer]);

  // Catch 429 Lockout Error
  React.useEffect(() => {
    if ((error as any)?.response?.status === 429) {
      // const duration = 60 * 60; // 1 hour
      const duration = 30; // 30 seconds
      const until = Date.now() + duration * 1000;
      localStorage.setItem('login_lockout_until', until.toString());
      setLockoutTimer(duration);
    }
  }, [error]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;
    mutate({ email, password });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ width: '100%', mt: 1 }}>
      {lockoutTimer > 0 ? (
        <Alert severity="warning" sx={{ mb: 3, fontWeight: 600 }}>
          Too many attempts. <br />
          Try again in: {formatTime(lockoutTimer)}
        </Alert>
      ) : errorMsg ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      ) : null}

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
          type={showPassword ? 'text' : 'password'}
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
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
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
        disabled={isPending || lockoutTimer > 0}
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
          'Sign in'
        )}
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don&apos;t have an account?{' '}
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
