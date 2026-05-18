"use client";

import React from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { SignatureImagePreview } from '@/components/ui/signature-image-preview';

interface SignatureSavedPreviewProps {
  savedSignature: string;
  onApply: () => void;
}

export const SignatureSavedPreview: React.FC<SignatureSavedPreviewProps> = ({
  savedSignature,
  onApply,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        border: `1px dashed ${theme.palette.divider}`,
        backgroundColor: theme.palette.action.hover,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
          fontWeight: 600,
        }}
      >
        <HistoryIcon fontSize="small" /> Use Saved Signature
      </Typography>
      
      <Box sx={{ mb: 1.5 }}>
        <SignatureImagePreview
          src={savedSignature}
          maxHeight={60}
        />
      </Box>

      <Button
        variant="outlined"
        color="primary"
        fullWidth
        size="small"
        onClick={onApply}
        sx={{ borderRadius: 1.5, textTransform: 'none', fontWeight: 600 }}
      >
        Apply Saved Signature
      </Button>
    </Box>
  );
};
