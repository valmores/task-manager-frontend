"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Stack,
    Chip,
    Divider,
    Button,
    IconButton,
    Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FolderIcon from "@mui/icons-material/Folder";

import { Project } from "@/types/task";
import { ExportPdfButton } from "./export-pdf-button";

type Props = {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (project: Project) => void;
    onViewTasks: (projectId: number) => void;
    canEdit?: boolean;
    canExport?: boolean;
};

export default function ProjectCard({
    project,
    onEdit,
    onDelete,
    onViewTasks,
    canEdit,
    canExport,
}: Props) {
    return (
        <Card
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 1,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                transition: "transform 0.2s, box-shadow 0.2s, border 0.2s",
                border: "1px solid",
                borderColor: "divider",

                "&:hover": {
                    borderColor: "primary.main",
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1.5,
                            bgcolor: "primary.light",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0.9,
                        }}
                    >
                        <FolderIcon color="primary" />
                    </Box>

                    <Box sx={{ ml: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {project.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Created {new Date(project.created_at).toLocaleDateString()}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3, minHeight: 40 }}
                >
                    {project.description || "No description provided."}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <Chip
                        label={`${project.task_count || 0} Tasks`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600, borderRadius: 1.5 }}
                    />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ maxWidth: 150 }}
                    >
                        by {project.created_by}
                    </Typography>
                </Stack>
            </CardContent>

            <Divider sx={{ mx: 2, opacity: 0.5 }} />

            <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    onClick={() => onViewTasks(project.id)}
                    sx={{ fontWeight: 600 }}
                >
                    View Tasks
                </Button>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {canExport && (
                        <ExportPdfButton project={project} />
                    )}

                    {canEdit && (
                        <>
                            <Tooltip title="Edit">
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => onEdit(project)}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete">
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => onDelete(project)}
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </>
                    )}
                </Box>
            </CardActions>
        </Card>
    );
}