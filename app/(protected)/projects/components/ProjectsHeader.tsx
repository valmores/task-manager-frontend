"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Props = {
    isAdminOrOwner: boolean;
    onCreate: () => void;
};

export default function ProjectsHeader({
    isAdminOrOwner,
    onCreate,
}: Props) {
    return (
        <Box
            sx={{
                mb: 4,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            {/* Left side text */}
            <Box>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: 700, color: "primary.main" }}
                >
                    Projects
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    Organize your tasks into high-level projects for better management.
                </Typography>
            </Box>

            {/* Right side button */}
            {isAdminOrOwner && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onCreate}
                    sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
                    }}
                >
                    Create Project
                </Button>
            )}
        </Box>
    );
}