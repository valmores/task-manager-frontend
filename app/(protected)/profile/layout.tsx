"use client";

import React from "react";
import { Box, Container, Paper, Typography, Avatar, Stack, Tabs, Tab } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuthStore();

    const currentTab = pathname.split("/")[2] || "overview";

    const handleChange = (_: any, value: string) => {
        router.push(`/profile/${value}`);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 3 }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 2, borderRadius: 1 }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                        {user?.first_name?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                    <Box>
                        <Typography variant="h6">
                            {user ? `${user.first_name} ${user.last_name}` : "User"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user?.email || "user@email.com"}
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Content */}
            <Paper sx={{ p: 3, borderRadius: 1 }}>
                {children}
            </Paper>
        </Container>
    );
}