"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FolderIcon from '@mui/icons-material/Folder';
import { useAuthStore } from '@/store/useAuthStore';

// Mock data for UI development
const MOCK_PROJECTS = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Modernizing the company landing page with a focus on speed and SEO.',
    task_count: 12,
    created_at: '2024-04-10',
    created_by: 'admin@example.com'
  },
  {
    id: 2,
    name: 'Mobile App API',
    description: 'Developing the backend infrastructure for the upcoming iOS and Android applications.',
    task_count: 8,
    created_at: '2024-04-15',
    created_by: 'owner@example.com'
  },
  {
    id: 3,
    name: 'Marketing Campaign Q2',
    description: 'Coordinating tasks for the spring social media and email outreach program.',
    task_count: 5,
    created_at: '2024-05-01',
    created_by: 'admin@example.com'
  }
];

export default function ProjectsPage() {
  const { user } = useAuthStore();
  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'project_owner';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Area */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
            Projects
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize your tasks into high-level projects for better management.
          </Typography>
        </Box>
        {isAdminOrOwner && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
            }}
          >
            Create Project
          </Button>
        )}
      </Box>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {MOCK_PROJECTS.map((project) => (
          <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <AvatarBox>
                    <FolderIcon color="primary" />
                  </AvatarBox>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {project.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Created {project.created_at}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                  {project.description}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Chip
                    label={`${project.task_count} Tasks`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 600, borderRadius: 1.5 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    by {project.created_by}
                  </Typography>
                </Stack>
              </CardContent>

              <Divider sx={{ mx: 2, opacity: 0.5 }} />

              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Button
                  size="small"
                  startIcon={<OpenInNewIcon />}
                  sx={{ fontWeight: 600 }}
                >
                  View Tasks
                </Button>

                {isAdminOrOwner && (
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton size="small" color="primary">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

// Styled component helper
const AvatarBox = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      width: 40,
      height: 40,
      borderRadius: 1.5,
      bgcolor: 'primary.light',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.9,
    }}
  >
    {children}
  </Box>
);
