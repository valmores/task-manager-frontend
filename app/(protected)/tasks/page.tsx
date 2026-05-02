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
} from '@mui/material';
import { TaskCard } from './components/task-card';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAuthStore } from '@/store/useAuthStore';

// Sample data for the layout
const SAMPLE_TASKS = [
  {
    id: 1,
    title: 'Design Dashboard Wireframes',
    status: 'in_progress',
    priority: 'high',
    due_date: '2024-05-15',
    assigned_to_email: 'john.doe@example.com',
  },
  {
    id: 2,
    title: 'Implement Authentication API',
    status: 'todo',
    priority: 'medium',
    due_date: '2024-05-20',
    assigned_to_email: 'jane.smith@example.com',
  },
  {
    id: 3,
    title: 'Fix Navigation Bug',
    status: 'done',
    priority: 'low',
    due_date: '2024-05-10',
    assigned_to_email: 'john.doe@example.com',
  },
  {
    id: 4,
    title: 'Database Migration',
    status: 'on_hold',
    priority: 'high',
    due_date: '2024-05-25',
    assigned_to_email: 'admin@example.com',
  },
];

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

  const isAdminOrOwner = user?.role === 'admin' || user?.role === 'project_owner';

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
      <Grid container spacing={2}>
        {SAMPLE_TASKS.map((task) => (
          <Grid key={task.id} size={{ xs: 12 }}>
            <TaskCard 
              task={task}
              isAdminOrOwner={isAdminOrOwner}
              getStatusLabel={getStatusLabel}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination Placeholder */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        {/* We can add MUI Pagination here later */}
      </Box>
    </Container>
  );
}
