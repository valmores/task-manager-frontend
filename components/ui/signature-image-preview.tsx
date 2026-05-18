"use client";

import React from 'react';
import { Box } from '@mui/material';

interface SignatureImagePreviewProps {
  src: string;
  maxHeight?: number;
  borderStyle?: 'solid' | 'dashed' | 'none';
  width?: string | number;
}

export const SignatureImagePreview: React.FC<SignatureImagePreviewProps> = ({
  src,
  maxHeight = 80,
  borderStyle = 'solid',
  width = 'auto',
}) => {
  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: 2,
        p: 2,
        display: 'inline-flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: borderStyle === 'none' ? 'none' : `1px ${borderStyle} #e0e0e0`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.03), inset 0 2px 4px rgba(0,0,0,0.015)',
        maxWidth: '100%',
        width,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <img
        src={src}
        alt="Signature preview"
        style={{
          maxHeight,
          display: 'block',
          maxWidth: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
};
