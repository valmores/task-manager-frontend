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
import { useAuthStore } from '@/store/use-auth-store';
import { TaskStatusCard } from './components/status-card';
import { TaskFormModal } from '../tasks/components/task-form-modal';
import { useTasks } from '@/hooks/tasks/use-tasks';
import { DashboardCharts } from './components/dashboard-charts';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const fullName = user ? `${user.first_name} ${user.last_name}` : 'User';

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { data: tasks } = useTasks();

  const handleCreateTask = () => {
    setIsModalOpen(true);
  };

  const handleSubmitTask = () => {
    // Modal handles the mutation internally
  };

  const getCountByStatus = (status: string) => {
    return tasks?.filter(task => task.status === status).length || 0;
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
        {/* {(user?.role === 'admin' || user?.role === 'project_owner') && (
          <Button
            onClick={handleCreateTask}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ px: 3, py: 1 }}
          >
            Create Task
          </Button>
        )} */}
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TaskStatusCard
            title="To Do"
            description="Tasks waiting to be started."
            status="todo"
            count={getCountByStatus('todo')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TaskStatusCard
            title="In Progress"
            description="Tasks you are currently working on."
            status="in_progress"
            count={getCountByStatus('in_progress')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TaskStatusCard
            title="On Hold"
            description="Tasks that are temporarily paused."
            status="on_hold"
            count={getCountByStatus('on_hold')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TaskStatusCard
            title="Completed"
            description="Tasks you have finished."
            status="done"
            count={getCountByStatus('done')}
          />
        </Grid>
      </Grid>

      <DashboardCharts tasks={tasks || []} />

      <TaskFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTask}
      />
    </Container>
  );
}
