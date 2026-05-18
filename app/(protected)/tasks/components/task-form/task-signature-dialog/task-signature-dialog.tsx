"use client";

import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Divider,
} from '@mui/material';
import GestureIcon from '@mui/icons-material/Gesture';
import SaveIcon from '@mui/icons-material/Save';

// Shared UI components
import { SignatureCanvasRef } from '@/components/ui/signature-canvas';

// Sub-components
import { SignatureSavedPreview } from './signature-saved-preview';
import { SignatureDrawingPad } from './signature-drawing-pad';

interface TaskSignatureDialogProps {
  open: boolean;
  taskTitle: string;
  savedSignature: string | null;
  onConfirm: (signatureDataUrl: string, saveToProfile: boolean) => void;
  onCancel: () => void;
}

export const TaskSignatureDialog: React.FC<TaskSignatureDialogProps> = ({
  open,
  taskTitle,
  savedSignature,
  onConfirm,
  onCancel,
}) => {
  const canvasRef = useRef<SignatureCanvasRef | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [saveToProfile, setSaveToProfile] = useState(false);

  const handleConfirm = () => {
    const dataUrl = canvasRef.current?.getDataUrl();
    if (!dataUrl) return;
    onConfirm(dataUrl, saveToProfile);
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: '0 24px 48px -12px rgba(0,0,0,0.2)',
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
        <GestureIcon color="primary" /> Sign Task Completion
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Task Title:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {taskTitle}
            </Typography>
          </Box>

          {/* Option 1: Saved signature from profile */}
          {savedSignature && (
            <SignatureSavedPreview
              savedSignature={savedSignature}
              onApply={() => onConfirm(savedSignature, false)}
            />
          )}

          {savedSignature && (
            <Divider>
              <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
                OR DRAW NEW ONE
              </Typography>
            </Divider>
          )}

          {/* Option 2: Draw new signature using shared canvas */}
          <SignatureDrawingPad
            canvasRef={canvasRef}
            isEmpty={isEmpty}
            clearCanvas={() => canvasRef.current?.clear()}
            saveToProfile={saveToProfile}
            onSaveToProfileChange={setSaveToProfile}
            onStrokeChange={setIsEmpty}
            hasSavedSignature={!!savedSignature}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit" sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isEmpty}
          startIcon={<SaveIcon />}
          sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
        >
          Confirm Signature
        </Button>
      </DialogActions>
    </Dialog>
  );
};
