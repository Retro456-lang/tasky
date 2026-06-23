import type { Task } from '../../../types/task';
import { mockTasks as initialTasks } from '../constants/mockTasks';

// In-memory/local storage backup for simulated mock api
let localTasks: Task[] = (() => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('simulated_tasks');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // Ignore
    }
  }
  return initialTasks;
})();

const saveLocalTasks = (tasks: Task[]) => {
  localTasks = tasks;
  if (typeof window !== 'undefined') {
    localStorage.setItem('simulated_tasks', JSON.stringify(tasks));
  }
};

export const taskService = {
  async getTasks(): Promise<Task[]> {
    await new Promise((r) => setTimeout(r, 300));
    return [...localTasks];
  },

  async createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    await new Promise((r) => setTimeout(r, 300));
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    saveLocalTasks([newTask, ...localTasks]);
    return newTask;
  },

  async updateTask(id: string, taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    await new Promise((r) => setTimeout(r, 300));
    let updatedTask: Task | null = null;
    const updatedList = localTasks.map((t) => {
      if (t.id === id) {
        updatedTask = { ...t, ...taskData };
        return updatedTask;
      }
      return t;
    });
    if (!updatedTask) throw new Error('Task not found');
    saveLocalTasks(updatedList);
    return updatedTask;
  },

  async deleteTask(id: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    saveLocalTasks(localTasks.filter((t) => t.id !== id));
  }
};
