"use client";

import React from 'react';
import { Box } from '@mui/material';
import { Navbar } from '@/components/layout/navbar';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          bgcolor: 'background.default',
          transition: 'background-color 0.3s ease'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
