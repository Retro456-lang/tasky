import { useState, useEffect } from 'react';
import AppLayout from './components/AppLayout';
import Dashboard from './features/tasks/components/Dashboard';
import TaskListPlaceholder from './features/tasks/components/TaskListPlaceholder';
import TaskModal from './features/tasks/components/TaskModal';
import TaskForm from './features/tasks/components/TaskForm';
import ConfirmDialog from './features/tasks/components/ConfirmDialog';
import { DashboardSkeleton } from './features/tasks/components/LoadingSkeleton';
import { taskService } from './features/tasks/services/taskService';
import type { Task } from './types/task';
import './App.css';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unexpected error occurred.';
}

function getTabFromUrl(): 'dashboard' | 'tasks' {
  const path = window.location.pathname;
  if (path === '/tasks' || path.startsWith('/tasks/')) return 'tasks';
  return 'dashboard';
}

function getStatusUrlParam(status: 'All' | 'Pending' | 'In Progress' | 'Completed'): string | null {
  switch (status) {
    case 'Pending':
      return 'pending';
    case 'In Progress':
      return 'in-progress';
    case 'Completed':
      return 'completed';
    case 'All':
    default:
      return null;
  }
}

function updateTabUrl(tab: 'dashboard' | 'tasks', status?: 'All' | 'Pending' | 'In Progress' | 'Completed') {
  const url = new URL(window.location.href);
  if (tab === 'tasks') {
    url.pathname = '/tasks';
    const statusParam = status ? getStatusUrlParam(status) : null;
    if (statusParam) url.searchParams.set('status', statusParam);
    else url.searchParams.delete('status');
  } else {
    url.pathname = '/';
    url.search = '';
  }
  window.history.pushState({}, '', url.pathname + url.search);
}

function App() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'tasks'>(getTabFromUrl);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Delete Dialog State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message || 'An error occurred while fetching tasks.');
      showToast(message || 'Error loading tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial data load
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync tab state with browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentTab(getTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle Toast Auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // CRUD Operations
  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteDialog = (id: string) => {
    setTaskToDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleSetCurrentTab = (tab: 'dashboard' | 'tasks') => {
    setCurrentTab(tab);
    updateTabUrl(tab);
  };

  const handleNavigateToTasks = (statusFilter: 'All' | 'Pending' | 'In Progress' | 'Completed' = 'All') => {
    setCurrentTab('tasks');
    updateTabUrl('tasks', statusFilter);
  };

  const handleFormSubmit = async (data: Omit<Task, 'id' | 'createdAt'>) => {
    setIsFormModalOpen(false);
    setLoading(true);
    try {
      if (editingTask) {
        // Update
        const updated = await taskService.updateTask(editingTask.id, data);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
        showToast('Task updated successfully!');
      } else {
        // Create
        const created = await taskService.createTask(data);
        setTasks((prev) => [created, ...prev]);
        showToast('Task created successfully!');
      }
    } catch (err: unknown) {
      showToast(getErrorMessage(err) || 'Operation failed', 'error');
    } finally {
      setLoading(false);
      setEditingTask(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (taskToDeleteId) {
      setIsDeleteOpen(false);
      setLoading(true);
      try {
        await taskService.deleteTask(taskToDeleteId);
        setTasks((prev) => prev.filter((t) => t.id !== taskToDeleteId));
        showToast('Task deleted successfully!');
      } catch (err: unknown) {
        showToast(getErrorMessage(err) || 'Failed to delete task', 'error');
      } finally {
        setLoading(false);
        setTaskToDeleteId(null);
      }
    }
  };

  return (
    <AppLayout currentTab={currentTab} setCurrentTab={handleSetCurrentTab}>
      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="w-full overflow-hidden rounded-xl border border-rose-200 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/[0.04] p-8 text-center space-y-4">
          <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400 mx-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-rose-600 dark:text-rose-400 font-semibold text-sm">Failed to Load Tasks</p>
            <p className="text-xs text-rose-400/70 dark:text-white/30 max-w-md mx-auto">{error}</p>
          </div>
          <button
            onClick={fetchTasks}
            className="px-4 py-2 rounded-lg bg-rose-100 dark:bg-rose-500/15 hover:bg-rose-200 dark:hover:bg-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-200 dark:border-rose-500/20 transition-all"
          >
            Retry Connection
          </button>
        </div>
      ) : currentTab === 'dashboard' ? (
        <Dashboard
          tasks={tasks}
          onCreate={handleOpenCreateModal}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
          onNavigateToTasks={handleNavigateToTasks}
        />
      ) : (
        <TaskListPlaceholder
          tasks={tasks}
          onCreate={handleOpenCreateModal}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteDialog}
        />
      )}

      {/* Task Modal (Add/Edit) */}
      <TaskModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingTask ? 'Edit Task Settings' : 'Create New Task'}
      >
        <TaskForm
          key={editingTask?.id ?? 'create'}
          task={editingTask}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </TaskModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Task"
        message="Are you absolutely sure you want to delete this task? This action is permanent and cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteOpen(false);
          setTaskToDeleteId(null);
        }}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922]/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/40 animate-fade-in-up">
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-rose-500 dark:bg-rose-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]'}`} />
          <p className="text-[13px] font-medium text-slate-700 dark:text-white/80">{toast.message}</p>
        </div>
      )}
    </AppLayout>
  );
}

export default App;