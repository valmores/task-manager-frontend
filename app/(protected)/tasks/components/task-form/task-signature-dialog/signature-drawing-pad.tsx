"use client";

import React from 'react';
import { Box, Typography, Stack, FormControlLabel, Checkbox, Button } from '@mui/material';

// Shared UI components
import { SignatureCanvas, SignatureCanvasRef } from '@/components/ui/signature-canvas';

interface SignatureDrawingPadProps {
  canvasRef: React.RefObject<SignatureCanvasRef | null>;
  isEmpty: boolean;
  clearCanvas: () => void;
  saveToProfile: boolean;
  onSaveToProfileChange: (checked: boolean) => void;
  onStrokeChange: (isEmpty: boolean) => void;
  hasSavedSignature: boolean;
}

export const SignatureDrawingPad: React.FC<SignatureDrawingPadProps> = ({
  canvasRef,
  isEmpty,
  clearCanvas,
  saveToProfile,
  onSaveToProfileChange,
  onStrokeChange,
  hasSavedSignature,
}) => {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
        {hasSavedSignature ? 'Draw Signature' : 'Draw your signature in the box below:'}
      </Typography>

      <SignatureCanvas
        ref={canvasRef}
        onStrokeChange={onStrokeChange}
        placeholder="Sign Here"
      />

      <Stack direction="row" sx={{ mt: 1, justifyContent: "space-between", alignItems: "center" }}>
        <Button
          size="small"
          onClick={clearCanvas}
          disabled={isEmpty}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Clear Pad
        </Button>

        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={saveToProfile}
              onChange={(e) => onSaveToProfileChange(e.target.checked)}
            />
          }
          label={
            <Typography variant="caption" color="text.secondary">
              Save as my default signature
            </Typography>
          }
        />
      </Stack>
    </Box>
  );
};
