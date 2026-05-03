"use client";

import React, { useState } from 'react';
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
} from '@mui/material';
import { TaskCard } from './components/task-card';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAuthStore } from '@/store/useAuthStore';
import { useTasks, useCreateTask, useUpdateTask } from '@/hooks/use-tasks';
import { TaskFormModal } from '../dashboard/components/create-task-modal';
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
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks, isLoading, isError } = useTasks();

  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'project_owner';

  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleFormSubmit = () => {
    // Modal handles the mutation internally
  };

  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

      {/* Filters & Actions Bar */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
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

        <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', sm: 'auto' } }}>
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

          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
          >
            More Filters
          </Button>
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
          {filteredTasks.map((task) => (
            <Grid key={task.id} size={{ xs: 12 }}>
              <TaskCard 
                task={task}
                isAdminOrOwner={isAdminOrOwner}
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

      {/* Pagination Placeholder */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        {/* We can add MUI Pagination here later */}
      </Box>

      <TaskFormModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        task={editingTask}
      />
    </Container>
  );
}

