import { z } from 'zod';

const taskStatusSchema = z.enum(['Pending', 'In Progress', 'Completed', 'Cancelled']);
const taskPrioritySchema = z.enum(['Low', 'Medium', 'High']);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Task title is required').max(60),
  description: z.string().trim().max(600).default(''),
  assignedTo: z.string().trim().min(1, 'Assigned employee name is required').max(60),
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD'),
});

export const updateTaskSchema = createTaskSchema;
