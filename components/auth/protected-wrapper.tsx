"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '@/store/useAuthStore';

export function ProtectedWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isHydrated } = useAuthStore();

    useEffect(() => {
        if (isHydrated) {
            if (!user) {
                router.replace('/login');
            } else if (pathname.startsWith('/admin') && user.role !== 'admin') {
                router.replace('/dashboard');
            }
        }
    }, [isHydrated, user, router, pathname]);

    if (!isHydrated) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) return null;

    return <>{children}</>;
}