"use client";

import React from 'react';
import { Button, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { SignatureImagePreview } from '@/components/ui/signature-image-preview';

interface SignaturePreviewProps {
  savedSignature: string;
  onRedraw: () => void;
  onDelete: () => void;
}

export const SignaturePreview: React.FC<SignaturePreviewProps> = ({
  savedSignature,
  onRedraw,
  onDelete,
}) => {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      <SignatureImagePreview
        src={savedSignature}
        maxHeight={100}
        width={320}
      />

      <Stack direction="row" spacing={2} sx={{ width: '100%', maxWidth: 320 }}>
        <Button
          variant="outlined"
          fullWidth
          onClick={onRedraw}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Redraw
        </Button>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={onDelete}
          startIcon={<DeleteIcon />}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
};
