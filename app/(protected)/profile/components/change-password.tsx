"use client";

import React from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Stack,
} from "@mui/material";

type PasswordState = {
    current: string;
    new: string;
    confirm: string;
};

type Props = {
    passwords: PasswordState;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
};

export default function ChangePassword({
    passwords,
    onChange,
    onSubmit,
}: Props) {
    return (
        <Box>
            <Typography variant="h6">
                Change Password
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Current Password"
                    name="current"
                    type="password"
                    value={passwords.current}
                    onChange={onChange}
                    fullWidth
                />

                <TextField
                    label="New Password"
                    name="new"
                    type="password"
                    value={passwords.new}
                    onChange={onChange}
                    fullWidth
                />

                <TextField
                    label="Confirm New Password"
                    name="confirm"
                    type="password"
                    value={passwords.confirm}
                    onChange={onChange}
                    fullWidth
                />

                <Button variant="contained" color="error" onClick={onSubmit}>
                    Update Password
                </Button>
            </Stack>
        </Box>
    );
}