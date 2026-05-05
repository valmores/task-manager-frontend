"use client";

import React from 'react';
import NextLink from 'next/link';
import { Box, IconButton, Typography, Link as MuiLink } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface NavLogoProps {
  onToggle: () => void;
}

export const NavLogo = ({ onToggle }: NavLogoProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <IconButton
      color="inherit"
      aria-label="open drawer"
      edge="start"
      onClick={onToggle}
      sx={{ mr: 1, display: { md: 'none' } }}
    >
      <MenuIcon />
    </IconButton>
    <MuiLink
      component={NextLink}
      href="/dashboard"
      sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit' }}
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
          display: { xs: 'none', sm: 'block' }
        }}
      >
        TaskMaster
      </Typography>
    </MuiLink>
  </Box>
);
