'use client';

import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useInternalNotesStore } from '@/store/useInternalNotesStore';
import { InternalNotesLayout } from '@/components/internal-notes/InternalNotesLayout';
import { STUB_ROOMS, STUB_MESSAGES } from '@/lib/stub-internal-notes';

/**
 * Internal Notes Page (replaces old CommentsPage)
 * 
 * Initializes the Zustand store with stub data and renders the
 * full split-panel InternalNotesLayout. API integration in later commits.
 */
export default function InternalNotesPage() {
    const { setRooms, setMessages, setLoading } = useInternalNotesStore();

    useEffect(() => {
        const loadStubData = async () => {
            setLoading('loading');
            // Simulate network latency
            await new Promise(resolve => setTimeout(resolve, 600));
            setRooms(STUB_ROOMS);
            setMessages(STUB_MESSAGES);
            setLoading('idle');
        };

        loadStubData();
    }, [setRooms, setMessages, setLoading]);

    return (
        <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <InternalNotesLayout />
        </Box>
    );
}