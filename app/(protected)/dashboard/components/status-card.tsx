"use client";

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SyncIcon from '@mui/icons-material/Sync';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';

interface TaskStatusCardProps {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done' | 'on_hold' | string;
  count?: number;
  children?: React.ReactNode;
}

const getStatusConfig = (status: string, theme: any) => {
  switch (status) {
    case 'todo':
      return {
        color: theme.palette.info.main,
        bgColor: alpha(theme.palette.info.main, 0.08),
        borderColor: alpha(theme.palette.info.main, 0.2),
        icon: <ListAltIcon sx={{ fontSize: 28 }} />
      };
    case 'in_progress':
      return {
        color: theme.palette.primary.main,
        bgColor: alpha(theme.palette.primary.main, 0.08),
        borderColor: alpha(theme.palette.primary.main, 0.2),
        icon: <SyncIcon sx={{ fontSize: 28 }} />
      };
    case 'done':
      return {
        color: theme.palette.success.main,
        bgColor: alpha(theme.palette.success.main, 0.08),
        borderColor: alpha(theme.palette.success.main, 0.2),
        icon: <CheckCircleIcon sx={{ fontSize: 28 }} />
      };
    case 'on_hold':
      return {
        color: theme.palette.warning.main,
        bgColor: alpha(theme.palette.warning.main, 0.08),
        borderColor: alpha(theme.palette.warning.main, 0.2),
        icon: <PendingIcon sx={{ fontSize: 28 }} />
      };
    default:
      return {
        color: theme.palette.grey[500],
        bgColor: alpha(theme.palette.grey[500], 0.08),
        borderColor: alpha(theme.palette.grey[500], 0.2),
        icon: <ListAltIcon sx={{ fontSize: 28 }} />
      };
  }
};

export function TaskStatusCard({ title, description, status, count = 0, children }: TaskStatusCardProps) {
  const theme = useTheme();
  const config = getStatusConfig(status, theme);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`
          : `linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)`,
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
          borderColor: config.color,
          '& .status-icon': {
            transform: 'scale(1.1) rotate(5deg)',
            color: config.color
          }
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box
          className="status-icon"
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: config.bgColor,
            color: config.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          {config.icon}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: -0.5 }}>
          {title}
        </Typography>
      </Box>
      {/* <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
        {description}
      </Typography> */}

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children || (
          <Box
            sx={{
              p: 3,
              bgcolor: config.bgColor,
              borderRadius: 4,
              border: '1px dashed',
              borderColor: config.borderColor,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 120,
              transition: 'all 0.3s ease'
            }}
          >

            <>
              <Typography variant="h2" sx={{ fontWeight: 900, color: config.color, mb: 0.5, letterSpacing: -2 }}>
                {count}
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: config.color, textTransform: 'uppercase', letterSpacing: 2, opacity: 0.8 }}>
                {title} Tasks
              </Typography>
            </>

          </Box>
        )}
      </Box>
    </Paper>
  );
}
