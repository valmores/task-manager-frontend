"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Typography,
} from '@mui/material';
import { useAuthStore } from '@/store/useAuthStore';
import { useTasks } from '@/hooks/tasks/use-tasks';
import { useProjects } from '@/hooks/projects/use-projects';
import { Task } from '@/types/task';

// Sub-components
import { TaskCard } from './components/task-card';
import { TaskFormModal } from './components/task-form-modal';
import { TaskListHeader } from './components/task-list-header';
import { TaskFilters } from './components/task-filters';
import { TaskPagination } from './components/task-pagination';

// Utils
import { getStatusColor, getStatusLabel, getPriorityColor } from './utils/task-helpers';

export default function TasksPage() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  // Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  // Data Fetching
  const { data: tasks, isLoading, isError } = useTasks();
  const { data: projects } = useProjects();

  // Effects
  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId) setProjectFilter(projectId);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, projectFilter]);

  // Permissions
  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'project_owner';

  // Handlers
  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logic
  const filteredTasks = useMemo(() => {
    return tasks?.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesProject = projectFilter === 'all' || task.project?.toString() === projectFilter;
      return matchesSearch && matchesStatus && matchesProject;
    });
  }, [tasks, search, statusFilter, projectFilter]);

  const totalPages = Math.ceil((filteredTasks?.length || 0) / itemsPerPage);
  const paginatedTasks = filteredTasks?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Prevent being stranded on an empty page after deletions
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <TaskListHeader 
        isAdminOrOwner={isAdminOrOwner} 
        onCreateClick={handleCreateClick} 
      />

      <Box sx={{ flexGrow: 1, minHeight: '65vh', display: 'flex', flexDirection: 'column' }}>
        <TaskFilters 
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          projectFilter={projectFilter}
          onProjectFilterChange={setProjectFilter}
          projects={projects}
        />

        {/* Content Area */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Alert severity="error">Error loading tasks. Please try again later.</Alert>
        ) : filteredTasks && filteredTasks.length > 0 ? (
          <Grid container spacing={2}>
            {paginatedTasks?.map((task) => (
              <Grid key={task.id} size={{ xs: 12 }}>
                <TaskCard
                  task={task}
                  userRole={user?.role}
                  onEdit={handleEditClick}
                  getStatusLabel={getStatusLabel}
                  getStatusColor={getStatusColor}
                  getPriorityColor={getPriorityColor}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No tasks found.
            </Typography>
          </Box>
        )}

        <TaskPagination 
          totalPages={totalPages} 
          page={page} 
          onPageChange={handlePageChange} 
        />
      </Box>

      <TaskFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
      />
    </Container>
  );
}
