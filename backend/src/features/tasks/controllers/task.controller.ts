import type { Request, Response } from 'express';
import { TaskModel } from '@/features/tasks/models/task.model.js';
import { toTaskDTO } from '@/features/tasks/mappers/task.mapper.js';
import { createTaskSchema, updateTaskSchema } from '@/features/tasks/validators/task.validator.js';
import { AppError } from '@/infrastructure/middleware/errorHandler.js';

export async function getTasks(_req: Request, res: Response): Promise<void> {
  const tasks = await TaskModel.find().sort({ createdAt: -1 });
  res.json(tasks.map(toTaskDTO));
}

export async function createTask(req: Request, res: Response): Promise<void> {
  const data = createTaskSchema.parse(req.body);
  const task = await TaskModel.create(data);
  res.status(201).json(toTaskDTO(task));
}

export async function updateTask(req: Request, res: Response): Promise<void> {
  const data = updateTaskSchema.parse(req.body);
  const task = await TaskModel.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json(toTaskDTO(task));
}

export async function deleteTask(req: Request, res: Response): Promise<void> {
  const task = await TaskModel.findByIdAndDelete(req.params.id);

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(204).send();
}
