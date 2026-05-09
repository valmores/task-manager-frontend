'use client';

import React from 'react';
import { Box } from '@mui/material';
import { InternalNotesLayout } from '@/components/internal-notes/InternalNotesLayout';


export default function InternalNotesPage() {
    return (
        <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <InternalNotesLayout />
        </Box>
    );
}