"use client";

import React, { useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import GestureIcon from '@mui/icons-material/Gesture';
import SaveIcon from '@mui/icons-material/Save';
import { useAuthStore } from '@/store/use-auth-store';
import { useUpdateProfile } from '@/hooks/users/use-update-profile';

// Shared UI components
import { SignatureCanvas, SignatureCanvasRef } from '@/components/ui/signature-canvas';

// Sub-components
import { SignaturePreview } from './signature-preview';

export default function ProfileSignature() {
  const { user } = useAuthStore();
  const { mutate: updateProfile, isPending, isError, isSuccess } = useUpdateProfile();

  const canvasRef = useRef<SignatureCanvasRef | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isRedrawing, setIsRedrawing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const savedSignature = user?.signature || null;

  const handleSave = () => {
    const dataUrl = canvasRef.current?.getDataUrl();
    if (!dataUrl) return;

    updateProfile(
      { signature: dataUrl },
      {
        onSuccess: () => {
          setIsRedrawing(false);
          setFeedbackMsg('Default signature saved successfully!');
        },
        onError: () => {
          setFeedbackMsg('Failed to save signature. Please try again.');
        },
      }
    );
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setDeleteDialogOpen(false);
    updateProfile(
      { signature: '' }, // Sends empty string to remove on backend
      {
        onSuccess: () => {
          setIsRedrawing(false);
          setIsEmpty(true);
          setFeedbackMsg('Saved signature removed.');
        },
        onError: () => {
          setFeedbackMsg('Failed to remove signature. Please try again.');
        },
      }
    );
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.06)', overflow: 'visible' }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GestureIcon color="primary" sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                My Saved Signature
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pre-save your signature here to sign off task completions with a single click.
              </Typography>
            </Box>
          </Box>

          {/* Option 1: Saved signature preview */}
          {savedSignature && !isRedrawing ? (
            <SignaturePreview
              savedSignature={savedSignature}
              onRedraw={() => setIsRedrawing(true)}
              onDelete={handleDelete}
            />
          ) : (
            /* Option 2: Reusable signature drawing pad component */
            <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
              <SignatureCanvas
                ref={canvasRef}
                onStrokeChange={setIsEmpty}
                placeholder="Sign Inside This Box"
              />

              <Stack direction="row" spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
                <Button
                  variant="text"
                  onClick={() => canvasRef.current?.clear()}
                  disabled={isEmpty}
                  sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                  Clear Pad
                </Button>

                {savedSignature && (
                  <Button
                    variant="text"
                    color="inherit"
                    onClick={() => setIsRedrawing(false)}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                  >
                    Cancel Redraw
                  </Button>
                )}

                <Box sx={{ flexGrow: 1 }} />

                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isEmpty || isPending}
                  startIcon={isPending ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                  sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
                >
                  {isPending ? 'Saving...' : 'Save Signature'}
                </Button>
              </Stack>
            </Stack>
          )}

          {feedbackMsg && (
            <Alert
              severity={isSuccess ? "success" : "error"}
              onClose={() => setFeedbackMsg('')}
              sx={{ borderRadius: 2, maxWidth: 400, mx: 'auto', width: '100%' }}
            >
              {feedbackMsg}
            </Alert>
          )}
        </Stack>
      </CardContent>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-signature-dialog-title"
        aria-describedby="delete-signature-dialog-description"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: '0 24px 48px -12px rgba(0,0,0,0.18)',
              p: 1,
            },
          },
        }}
      >
        <DialogTitle id="delete-signature-dialog-title" sx={{ fontWeight: 700 }}>
          Delete Saved Signature?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-signature-dialog-description">
            Are you sure you want to delete your default saved signature? You will need to draw a new one to sign future task completions.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            color="error"
            variant="contained"
            autoFocus
            sx={{ borderRadius: 2, fontWeight: 700 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
