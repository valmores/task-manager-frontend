"use client";

import React from 'react';
import { Stack, Tooltip, IconButton, Badge } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface TaskActionButtonsProps {
  userRole?: string;
  onCommentsClick: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export const TaskActionButtons = ({
  userRole,
  onCommentsClick,
  onEditClick,
  onDeleteClick
}: TaskActionButtonsProps) => {
  const isAdmin = userRole === 'admin';
  const isOwner = userRole === 'project_owner';
  const isUser = userRole === 'user';

  return (
    <Stack direction="row" spacing={0.5}>
      {/* Internal Notes (Admin/Owner only) */}
      {(isAdmin || isOwner) && (
        <Tooltip title="Internal Notes">
          <IconButton size="small" color="primary" onClick={onCommentsClick}>
            <Badge
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.65rem',
                  height: 16,
                  minWidth: 16,
                  top: 2,
                  right: 2
                }
              }}
            >
              <CommentIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>
      )}

      {/* Edit/Update Actions */}
      {(isAdmin || isUser || isOwner) && (
        <Tooltip title={
          isAdmin ? "Edit Task" :
          isOwner ? "Manage Task" : "Update Status"
        }>
          <IconButton size="small" color="primary" onClick={onEditClick}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Delete Action (Strict Admin Only) */}
      {isAdmin && (
        <Tooltip title="Delete Task">
          <IconButton size="small" color="error" onClick={onDeleteClick}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};
