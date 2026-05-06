"use client";

import React, { useState } from "react";
import { Stack, Divider, Alert } from "@mui/material";

import UserInfo from "./components/user-info";
import ChangePassword from "./components/change-password";

export default function ProfilePage() {
    const [user, setUser] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "user@email.com",
    });

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
        setMessage("Profile updated successfully");
    };

    const handleChangePassword = () => {
        if (passwords.new !== passwords.confirm) {
            setMessage("Passwords do not match");
            return;
        }

        setMessage("Password changed successfully");
        setPasswords({ current: "", new: "", confirm: "" });
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
            />

            {message && <Alert severity="info">{message}</Alert>}
        </Stack>
    );
}