"use client";

import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Stack,
    IconButton,
    InputAdornment,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

type PasswordState = {
    current: string;
    new: string;
    confirm: string;
};

type Props = {
    passwords: PasswordState;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    isLoading?: boolean;
    errors?: {
        current?: string;
        new?: string;
        confirm?: string;
    };
};

export default function ChangePassword({
    passwords,
    onChange,
    onSubmit,
    isLoading,
    errors,
}: Props) {
    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const toggleShow = (field: keyof typeof show) => {
        setShow((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const confirmPasswordError =
        passwords.confirm && passwords.confirm !== passwords.new
            ? "Passwords do not match"
            : errors?.confirm;

    const isConfirmValid =
        passwords.confirm.length > 0 &&
        passwords.confirm === passwords.new;

    const isConfirmInvalid =
        passwords.confirm.length > 0 &&
        passwords.confirm !== passwords.new;

    const isFormValid =
        passwords.current &&
        passwords.new &&
        passwords.confirm &&
        isConfirmValid;

    return (
        <Box>
            <Typography variant="h6">Change Password</Typography>

            <Stack spacing={2}>
                {/* Current */}
                <TextField
                    label="Current Password"
                    name="current"
                    type={show.current ? "text" : "password"}
                    value={passwords.current}
                    onChange={onChange}
                    fullWidth
                    error={!!errors?.current}
                    helperText={errors?.current}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => toggleShow("current")}
                                        edge="end"
                                    >
                                        {show.current ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* New */}
                <TextField
                    label="New Password"
                    name="new"
                    type={show.new ? "text" : "password"}
                    value={passwords.new}
                    onChange={onChange}
                    fullWidth
                    error={!!errors?.new}
                    helperText={errors?.new}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => toggleShow("new")}
                                        edge="end"
                                    >
                                        {show.new ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* Confirm */}
                <TextField
                    label="Confirm New Password"
                    name="confirm"
                    type={show.confirm ? "text" : "password"}
                    value={passwords.confirm}
                    onChange={onChange}
                    fullWidth
                    error={isConfirmInvalid}
                    helperText={isConfirmInvalid ? "Passwords do not match" : ""}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    {isConfirmValid && (
                                        <CheckCircleIcon sx={{ color: "success.main", mr: 1 }} />
                                    )}

                                    <IconButton
                                        onClick={() => toggleShow("confirm")}
                                        edge="end"
                                    >
                                        {show.confirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <Button
                    variant="contained"
                    color="error"
                    onClick={onSubmit}
                    disabled={!isFormValid || isLoading}
                    sx={{ minWidth: 160 }}
                >
                    {isLoading ? (
                        <CircularProgress size={18} color="inherit" />
                    ) : (
                        "Update Password"
                    )}
                </Button>
            </Stack>
        </Box>
    );
}