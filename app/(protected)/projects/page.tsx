"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { useAuthStore } from '@/store/use-auth-store';
import { useProjects, useDeleteProject } from '@/hooks/projects/use-projects';
import { ProjectFormModal } from './components/project-form-modal';
import { Project } from '@/types/task';
import DeleteProjectDialog from './components/delete-project-dialog';
import ProjectCard from "./components/project-card";
import ProjectsHeader from './components/projects-header';
import { ListFilters } from '@/components/ui/list-filters';

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: projects, isLoading, isError } = useProjects();

  // Search State
  const [search, setSearch] = useState('');

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const deleteMutation = useDeleteProject();

  // Filtering Logic
  const filteredProjects = React.useMemo(() => {
    if (!projects) return [];
    return projects.filter((project) =>
      project.name.toLowerCase().includes(search.toLowerCase()) ||
      project.description?.toLowerCase().includes(search.toLowerCase()) ||
      project.created_by.toLowerCase().includes(search.toLowerCase())
    );
  }, [projects, search]);

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

  const totalPages = Math.ceil((filteredProjects.length || 0) / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prevent being stranded on an empty page after deletions or filtering
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  // Reset page on search
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Area */}
      <ProjectsHeader
        isAdminOrOwner={isAdminOrOwner}
        onCreate={handleCreateClick}
      />

      <Box sx={{ flexGrow: 1, minHeight: '60vh', display: 'flex', flexDirection: 'column' }}>

        <ListFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search projects by name, description, or owner..."
        />

        {/* Projects Grid */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">Error loading projects. Please try again later.</Alert>
        ) : filteredProjects.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {paginatedProjects?.map((project) => (
                <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <ProjectCard
                    project={project}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onViewTasks={handleViewTasks}
                    canEdit={user?.role === "admin"}
                    canExport={isAdminOrOwner}
                  />
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
              No projects found{search ? ` matching "${search}"` : ""}.
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
      <DeleteProjectDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        project={projectToDelete}
        isLoading={deleteMutation.isPending}
      />
    </Container>
  );
}
