"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Stack,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FolderIcon from '@mui/icons-material/Folder';
import { useAuthStore } from '@/store/useAuthStore';
import { useProjects, useDeleteProject } from '@/hooks/projects/use-projects';
import { ProjectFormModal } from './components/project-form-modal';
import { Project } from '@/types/task';

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: projects, isLoading, isError } = useProjects();

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const deleteMutation = useDeleteProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'project_owner';

  const handleCreateClick = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete.id, {
        onSuccess: () => setDeleteDialogOpen(false),
      });
    }
  };

  const handleViewTasks = (projectId: number) => {
    router.push(`/tasks?project=${projectId}`);
  };

  const totalPages = Math.ceil((projects?.length || 0) / itemsPerPage);
  const paginatedProjects = projects?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prevent being stranded on an empty page after deletions
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

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
            onClick={handleCreateClick}
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

      <Box sx={{ flexGrow: 1, minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>

      {/* Projects Grid */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">Error loading projects. Please try again later.</Alert>
      ) : projects && projects.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {paginatedProjects?.map((project) => (
              <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
                {/* ... Card component ... */}
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

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                      {project.description || 'No description provided.'}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Chip
                        label={`${project.task_count || 0} Tasks`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600, borderRadius: 1.5 }}
                      />
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 150 }}>
                        by {project.created_by}
                      </Typography>
                    </Stack>
                  </CardContent>

                  <Divider sx={{ mx: 2, opacity: 0.5 }} />

                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Button
                      size="small"
                      startIcon={<OpenInNewIcon />}
                      onClick={() => handleViewTasks(project.id)}
                      sx={{ fontWeight: 600 }}
                    >
                      View Tasks
                    </Button>

                    {user?.role === 'admin' && (
                      <Box>
                        <Tooltip title="Edit">
                          <IconButton size="small" color="primary" onClick={() => handleEditClick(project)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteClick(project)}>
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

          {totalPages > 1 && (
            <Box 
              sx={{ 
                mt: 'auto', 
                pt: 6,
                display: 'flex', 
                justifyContent: 'center',
                p: 2,
                borderRadius: 4,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    borderRadius: 2,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    },
                    '&.Mui-selected': {
                      boxShadow: '0 4px 12px rgba(0,118,255,0.3)',
                    }
                  }
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No projects found.
          </Typography>
        </Box>
      )}
      </Box>

      {/* Modals */}
      <ProjectFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
      />

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle component="div">
          <Typography variant="h6">
            Delete Project?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{projectToDelete?.name}"? All associated tasks will be unlinked but not deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
