"use client";

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuthStore } from '@/store/useAuthStore';
import { TaskStatusCard } from './components/status-card';
import { CreateTaskModal } from './components/create-task-modal';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const fullName = user ? `${user.first_name} ${user.last_name}` : 'User';

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateTask = () => {
    setIsModalOpen(true);
  };

  const handleSubmitTask = (taskData: any) => {
    setIsModalOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ fontWeight: 700 }}>
            Welcome back, {fullName}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here is an overview of your tasks for today.
          </Typography>
        </Box>
        <Button
          onClick={handleCreateTask}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ px: 3, py: 1 }}
        >
          Create Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TaskStatusCard
            title="To Do"
            description="Tasks waiting to be started."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TaskStatusCard
            title="In Progress"
            description="Tasks you are currently working on."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TaskStatusCard
            title="Completed"
            description="Tasks you have finished."
          />
        </Grid>
      </Grid>

      <CreateTaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTask}
      />
    </Container>
  );
}
