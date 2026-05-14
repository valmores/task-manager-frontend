"use client";

import React from "react";
import { Box, TextField, Button, Typography, Stack } from "@mui/material";

type UserState = {
    firstName: string;
    lastName: string;
    email: string;
};

type Props = {
    user: UserState;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
};

export default function UserInfo({ user, onChange, onSave }: Props) {
    return (
        <Box>
            <Typography variant="h6">
                User Information
            </Typography>

            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="First Name"
                        name="firstName"
                        disabled={true}
                        value={user.firstName}
                        onChange={onChange}
                        fullWidth
                    />

                    <TextField
                        label="Last Name"
                        name="lastName"
                        disabled={true}
                        value={user.lastName}
                        onChange={onChange}
                        fullWidth
                    />
                </Stack>

                <TextField
                    label="Email"
                    name="email"
                    value={user.email}
                    onChange={onChange}
                    disabled={true}
                    fullWidth
                />

                <Button variant="contained" onClick={onSave}>
                    Save Changes
                </Button>
            </Stack>
        </Box>
    );
}