"use client";

import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import { Project } from "@/types/task";

type Props = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    project: Project | null;
    isLoading?: boolean;
};

export default function DeleteProjectDialog({
    open,
    onClose,
    onConfirm,
    project,
    isLoading,
}: Props) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle component="div">
                <Typography variant="h6">
                    Delete Project?
                </Typography>
            </DialogTitle>

            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete "{project?.name}"? All associated tasks will be unlinked but not deleted.
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    onClick={onConfirm}
                    color="error"
                    variant="contained"
                    disabled={isLoading}
                    sx={{ minWidth: 100, height: 36 }}
                >
                    {isLoading ? <CircularProgress size={18} /> : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}