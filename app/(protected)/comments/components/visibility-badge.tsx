import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import {
  Lock as LockIcon,
  Public as GlobeIcon,
  Folder as FolderIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { RoomVisibility } from '@/types/internal-notes';

interface VisibilityBadgeProps {
  visibility: RoomVisibility;
  size?: 'small' | 'medium';
  className?: string;
}

const visibilityConfig = {
  [RoomVisibility.ADMIN_ONLY]: {
    label: 'Admin Only',
    color: 'error' as const,
    icon: <LockIcon />,
    description: 'Only administrators can see and post in this room.',
  },
  [RoomVisibility.INTERNAL]: {
    label: 'Internal',
    color: 'info' as const,
    icon: <GlobeIcon />,
    description: 'Accessible to all internal team members.',
  },
  [RoomVisibility.PROJECT_SPECIFIC]: {
    label: 'Project Specific',
    color: 'warning' as const,
    icon: <FolderIcon />,
    description: 'Only members assigned to the related project can access.',
  },
  [RoomVisibility.PRIVATE]: {
    label: 'Private',
    color: 'secondary' as const,
    icon: <PeopleIcon />,
    description: 'Only specific invited members can access.',
  },
};

const VisibilityBadge: React.FC<VisibilityBadgeProps> = ({ visibility, size = 'small', className }) => {
  const config = visibilityConfig[visibility];

  if (!config) return null;

  return (
    <Tooltip title={config.description} arrow placement="top">
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size={size}
        variant="outlined"
        className={className}
        sx={{
          fontWeight: 600,
          borderRadius: '6px',
          '& .MuiChip-icon': {
            fontSize: size === 'small' ? '1rem' : '1.25rem'
          }
        }}
      />
    </Tooltip>
  );
};

export default VisibilityBadge;
