"use client";

import React from 'react';
import NextLink from 'next/link';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface NavLink {
  name: string;
  href: string;
}

interface MobileDrawerProps {
  open: boolean;
  onToggle: () => void;
  links: NavLink[];
  isActive: (path: string) => boolean;
}

export const MobileDrawer = ({ open, onToggle, links, isActive }: MobileDrawerProps) => (
  <Drawer
    variant="temporary"
    open={open}
    onClose={onToggle}
    ModalProps={{ keepMounted: true }}
    sx={{
      display: { xs: 'block', md: 'none' },
      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, bgcolor: 'background.paper' },
    }}
  >
    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
        TaskMaster
      </Typography>
      <IconButton onClick={onToggle}>
        <CloseIcon />
      </IconButton>
    </Box>
    <Divider />
    <List sx={{ px: 2, py: 2 }}>
      {links.map((link) => (
        <ListItem key={link.href} disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={NextLink}
            href={link.href}
            onClick={onToggle}
            sx={{
              borderRadius: 2,
              bgcolor: isActive(link.href) ? 'primary.light' : 'transparent',
              color: isActive(link.href) ? 'primary.main' : 'text.primary',
              '&:hover': { bgcolor: isActive(link.href) ? 'primary.light' : 'action.hover' }
            }}
          >
            <ListItemText
              primary={link.name}
              slotProps={{
                primary: {
                  sx: { fontWeight: isActive(link.href) ? 700 : 500 },
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Drawer>
);
