import { useState, useEffect } from 'react';
import AppLayout from '@/shared/components/Layout/AppLayout';
import Dashboard from '@/features/tasks/components/dashboard/Dashboard';
import TaskListPlaceholder from '@/features/tasks/components/TaskListPlaceholder';
import TaskModal from '@/features/tasks/components/modals/TaskModal';
import TaskForm from '@/features/tasks/components/forms/TaskForm';
import ConfirmDialog from '@/features/tasks/components/modals/ConfirmDialog';
import { DashboardSkeleton } from '@/features/tasks/components/LoadingSkeleton';
import { taskService } from '@/features/tasks/services/taskService';
import { useAuth } from '@/features/auth/context/AuthContext';
import SignIn from '@/features/auth/components/SignIn';
import SignUp from '@/features/auth/components/SignUp';
import ForgotPassword from '@/features/auth/components/ForgotPassword';
import ResetPassword from '@/features/auth/components/ResetPassword';
import type { Task } from '@/features/tasks/types/task';
import './App.css';

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unexpected error occurred.';
}

function App() {
  const { user, loading: authLoading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
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

  // Navigation Helper
  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Sync tab state with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Load tasks only when authenticated
  useEffect(() => {
    if (user) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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

  const handleNavigateToTasks = (statusFilter?: 'All' | 'Pending' | 'In Progress' | 'Completed') => {
    const query = statusFilter && statusFilter !== 'All' 
      ? `?status=${statusFilter.toLowerCase().replace(' ', '-')}` 
      : '';
    navigateTo(`/tasks${query}`);
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

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0c10] flex items-center justify-center text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  const isAuthRoute = ['/signin', '/signup', '/forgot-password', '/reset-password'].includes(currentPath);

  // Guard: Not Authenticated
  if (!user) {
    if (!isAuthRoute) {
      window.history.replaceState({}, '', '/signin');
      setCurrentPath('/signin');
      return null;
    }

    if (currentPath === '/signup') {
      return <SignUp onNavigate={navigateTo} />;
    }
    if (currentPath === '/forgot-password') {
      return <ForgotPassword onNavigate={navigateTo} />;
    }
    if (currentPath === '/reset-password') {
      return <ResetPassword onNavigate={navigateTo} />;
    }
    return <SignIn onNavigate={navigateTo} />;
  }

  // Guard: Authenticated user accessing Auth Route
  if (isAuthRoute) {
    window.history.replaceState({}, '', '/');
    setCurrentPath('/');
    return null;
  }

  // Determine Active Tab based on Path
  const currentTab = currentPath.startsWith('/tasks') ? 'tasks' : 'dashboard';
  const handleSetCurrentTab = (tab: 'dashboard' | 'tasks') => {
    navigateTo(tab === 'tasks' ? '/tasks' : '/');
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
