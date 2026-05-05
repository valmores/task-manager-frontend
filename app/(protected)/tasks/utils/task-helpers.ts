export const getStatusColor = (status: string) => {
  switch (status) {
    case 'todo': return 'default';
    case 'in_progress': return 'primary';
    case 'on_hold': return 'warning';
    case 'done': return 'success';
    default: return 'default';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'todo': return 'To Do';
    case 'in_progress': return 'In Progress';
    case 'on_hold': return 'On Hold';
    case 'done': return 'Done';
    default: return status;
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'error';
    case 'medium': return 'warning';
    case 'low': return 'info';
    default: return 'inherit';
  }
};

export const isOverdue = (dueDate: string | null, status: string) => {
  if (!dueDate || status === 'done') return false;
  
  // Split YYYY-MM-DD and create a local date to avoid timezone shifts
  const [year, month, day] = dueDate.split('-').map(Number);
  const dueDateTime = new Date(year, month - 1, day).getTime();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  
  return dueDateTime < todayTime;
};
