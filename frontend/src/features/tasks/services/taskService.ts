import type { Task } from '@/features/tasks/types/task';
import { authService } from '@/features/auth/services/authService';

const API_BASE = '/api/tasks';

function getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = authService.getToken();
  const headers: Record<string, string> = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const res = await fetch(API_BASE, {
      headers: getHeaders(),
    });
    return handleResponse<Task[]>(res);
  },

  async createTask(taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(taskData),
    });
    return handleResponse<Task>(res);
  },

  async updateTask(id: string, taskData: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: getHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(taskData),
    });
    return handleResponse<Task>(res);
  },

  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    await handleResponse<void>(res);
  },
};
