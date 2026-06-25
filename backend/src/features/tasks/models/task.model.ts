import mongoose, { Schema, Document } from 'mongoose';
import type { TaskPriority, TaskStatus } from '../types/task.types.js';

export interface ITask extends Document {
  title: string;
  description: string;
  assignedTo: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true, maxlength: 60 },
    description: { type: String, default: '', trim: true, maxlength: 600 },
    assignedTo: { type: String, required: true, trim: true, maxlength: 60 },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      required: true,
    },
    dueDate: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

export const TaskModel = mongoose.model<ITask>('Task', taskSchema);
