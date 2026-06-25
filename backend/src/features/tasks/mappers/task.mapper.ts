import type { ITask } from '../models/task.model.js';
import type { TaskDTO } from '../types/task.types.js';

export function toTaskDTO(task: ITask): TaskDTO {
  return {
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    assignedTo: task.assignedTo,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    createdAt: task.createdAt.toISOString(),
  };
}
