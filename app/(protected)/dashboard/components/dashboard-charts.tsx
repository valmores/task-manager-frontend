"use client";

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { PieChart, BarChart } from '@mui/x-charts';
import { Task } from '@/types/task';

interface DashboardChartsProps {
  tasks: Task[];
}

export function DashboardCharts({ tasks }: DashboardChartsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 1. Data for Pie Chart (Status Distribution)
  const statusData = [
    { id: 0, value: tasks.filter(t => t.status === 'todo').length, label: 'To Do', color: theme.palette.grey[500] },
    { id: 1, value: tasks.filter(t => t.status === 'in_progress').length, label: 'In Progress', color: theme.palette.info.main },
    { id: 2, value: tasks.filter(t => t.status === 'on_hold').length, label: 'On Hold', color: theme.palette.warning.main },
    { id: 3, value: tasks.filter(t => t.status === 'done').length, label: 'Completed', color: theme.palette.success.main },
  ].filter(item => item.value > 0);

  // 2. Data for Bar Chart (Tasks by Project)
  const projectMap = new Map<string, number>();
  tasks.forEach(task => {
    const name = task.project_name || 'No Project';
    projectMap.set(name, (projectMap.get(name) || 0) + 1);
  });

  const projectLabels = Array.from(projectMap.keys());
  const projectValues = Array.from(projectMap.values());

  return (
    <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {/* Task Status Distribution */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          flex: '1 1 400px',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.action.hover})`
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Task Status Distribution
        </Typography>
        <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
          {statusData.length > 0 ? (
            <PieChart
              series={[
                {
                  data: statusData,
                  highlightScope: { fade: 'series', highlight: 'item' },
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                },
              ]}
              height={250}
              margin={{ right: 5 }}
              slotProps={isMobile ? {} : { legend: {} }}
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography color="text.secondary">No task data available</Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Tasks by Project */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          flex: '1 1 500px',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.action.hover})`
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Workload by Project
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          {projectLabels.length > 0 ? (
            <BarChart
              xAxis={[{ scaleType: 'band', data: projectLabels, label: 'Projects' }]}
              series={[
                {
                  data: projectValues,
                  label: 'Number of Tasks',
                  color: theme.palette.primary.main,
                }
              ]}
              height={250}
              margin={{ top: 20, bottom: 50, left: 40, right: 10 }}
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography color="text.secondary">No project data available</Typography>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
