import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { AdminUser } from '@/types/task';

interface StatusConfirmDialogProps {
  open: boolean;
  user: AdminUser | null;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export const StatusConfirmDialog: React.FC<StatusConfirmDialogProps> = ({
  open,
  user,
  onClose,
  onConfirm,
  isPending,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle component="div">
        {user?.is_active ? 'Deactivate User?' : 'Reactivate User?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {user?.is_active ? (
            <>Are you sure you want to deactivate <strong>{user?.first_name} {user?.last_name}</strong>? They will no longer be able to log in.</>
          ) : (
            <>Are you sure you want to reactivate <strong>{user?.first_name} {user?.last_name}</strong>? They will regain access to the system.</>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          color={user?.is_active ? 'error' : 'success'}
          variant="contained"
          disabled={isPending}
        >
          {isPending ? 'Processing...' : (user?.is_active ? 'Deactivate' : 'Reactivate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
