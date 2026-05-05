"use client";

import React from 'react';
import { Box, Pagination } from '@mui/material';

interface TaskPaginationProps {
  totalPages: number;
  page: number;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

export function TaskPagination({ totalPages, page, onPageChange }: TaskPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Box 
      sx={{ 
        mt: 'auto', 
        pt: 6,
        display: 'flex', 
        justifyContent: 'center',
        p: 2,
        borderRadius: 4,
      }}
    >
      <Pagination 
        count={totalPages} 
        page={page} 
        onChange={onPageChange} 
        color="primary"
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            borderRadius: 2,
            fontWeight: 600,
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            },
            '&.Mui-selected': {
              boxShadow: '0 4px 12px rgba(0,118,255,0.3)',
            }
          }
        }}
      />
    </Box>
  );
}
