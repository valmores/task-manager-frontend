"use client";

import React, { useState, useEffect } from "react";
import { Stack, Divider, Alert, CircularProgress } from "@mui/material";
import { useAuthStore } from "@/store/useAuthStore";
import { useChangePassword } from "@/hooks/users/use-change-password";

import UserInfo from "./components/user-info";
import ChangePassword from "./components/change-password";

export default function ProfilePage() {
    const { user: authUser } = useAuthStore();
    const { mutate: changePassword, isPending, isError, error, isSuccess } = useChangePassword();
    const [passwordErrors, setPasswordErrors] = useState<{
        current?: string;
        new?: string;
        confirm?: string;
    }>({});

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    useEffect(() => {
        if (authUser) {
            setUser({
                firstName: authUser.first_name || "",
                lastName: authUser.last_name || "",
                email: authUser.email || "",
            });
        }
    }, [authUser]);

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const [message, setMessage] = useState("");

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = () => {
        setMessage("Profile updating is not implemented yet.");
    };

    const handleChangePassword = () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            setMessage("Please fill in all password fields.");
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setMessage("New passwords do not match.");
            return;
        }

        changePassword({
            old_password: passwords.current,
            new_password: passwords.new,
            confirm_password: passwords.confirm
        }, {
            onSuccess: () => {
                setPasswords({ current: "", new: "", confirm: "" });
                setPasswordErrors({});
                setMessage("Password changed successfully!");
            },
            onError: (err: any) => {
                const data = err.response?.data;

                const fieldErrors = {
                    current: data?.old_password?.[0],
                    new: data?.new_password?.[0],
                    confirm: data?.confirm_password?.[0],
                };

                setPasswordErrors(fieldErrors);

                const fallback =
                    data?.detail ||
                    "Failed to change password";

                setMessage(fallback);
            },
        });
    };

    return (
        <Stack spacing={4}>
            {/* User Info Component */}
            <UserInfo
                user={user}
                onChange={handleUserChange}
                onSave={handleSaveProfile}
            />

            <Divider />

            {/* Password Component */}
            <ChangePassword
                passwords={passwords}
                onChange={handlePasswordChange}
                onSubmit={handleChangePassword}
                errors={passwordErrors}
            />
            {isPending && <CircularProgress size={24} sx={{ mt: 2, alignSelf: 'center' }} />}
            {message && (
                <Alert
                    severity={isSuccess ? "success" : (isError || message.includes("match") || message.includes("fill") ? "error" : "info")}
                    sx={{ mt: 2 }}
                >
                    {message}
                </Alert>
            )}
        </Stack>
    );
}