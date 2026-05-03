"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import { TaskCard } from './components/task-card';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FolderIcon from '@mui/icons-material/Folder';
import { useAuthStore } from '@/store/useAuthStore';
import { useTasks } from '@/hooks/use-tasks';
import { useProjects } from '@/hooks/use-projects';
import { TaskFormModal } from './components/task-form-modal';
import { Task } from '@/types/task';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo': return 'default';
    case 'in_progress': return 'primary';
    case 'on_hold': return 'warning';
    case 'done': return 'success';
    default: return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'todo': return 'To Do';
    case 'in_progress': return 'In Progress';
    case 'on_hold': return 'On Hold';
    case 'done': return 'Done';
    default: return status;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'info';
    default: return 'inherit';
  }
};

export default function TasksPage() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const itemsPerPage = 7;

  const { data: tasks, isLoading, isError } = useTasks();
  const { data: projects } = useProjects();

  useEffect(() => {
    const projectId = searchParams.get('project');
    if (projectId) {
      setProjectFilter(projectId);
    }
  }, [searchParams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, projectFilter]);

  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'project_owner';

  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesProject = projectFilter === 'all' || task.project?.toString() === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  });

  const totalPages = Math.ceil((filteredTasks?.length || 0) / itemsPerPage);
  const paginatedTasks = filteredTasks?.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
            Task List
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your project tasks in one place.
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
            Create Task
          </Button>
        )}
      </Box>

      <Box sx={{ flexGrow: 1, minHeight: '65vh', display: 'flex', flexDirection: 'column' }}>

      {/* Filters & Actions Bar */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 2,
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <TextField
          placeholder="Search tasks..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 }
            }
          }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', lg: 'auto' } }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="on_hold">On Hold</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Project</InputLabel>
            <Select
              value={projectFilter}
              label="Project"
              onChange={(e) => setProjectFilter(e.target.value)}
              sx={{ borderRadius: 2 }}
              startAdornment={
                <InputAdornment position="start">
                  <FolderIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Projects</MenuItem>
              {projects?.map((project) => (
                <MenuItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Tasks Grid */}
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
      </Box>

      <TaskFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
      />
    </Container>
  );
}

