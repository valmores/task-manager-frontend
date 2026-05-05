"use client";

import React from 'react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';
import { Box, Link as MuiLink } from '@mui/material';

interface NavLink {
  name: string;
  href: string;
}

interface DesktopNavProps {
  links: NavLink[];
  isActive: (path: string) => boolean;
}

export const DesktopNav = ({ links, isActive }: DesktopNavProps) => (
  <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, ml: 'auto', mr: 4 }}>
    {links.map((link) => (
      <MuiLink
        key={link.href}
        component={NextLink}
        href={link.href}
        sx={{
          color: isActive(link.href) ? 'primary.main' : 'text.secondary',
          textDecoration: 'none',
          fontWeight: isActive(link.href) ? 600 : 500,
          position: 'relative',
          pb: 0.5,
          transition: 'color 0.2s',
          '&:hover': { color: 'primary.main' }
        }}
      >
        {link.name}
        {isActive(link.href) && (
          <Box
            component={motion.div}
            layoutId="activeTab"
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 2,
              bgcolor: 'primary.main',
              borderRadius: '1px',
            }}
            transition={{
              type: "spring",
              stiffness: 380,
              damping: 30
            }}
          />
        )}
      </MuiLink>
    ))}
  </Box>
);
