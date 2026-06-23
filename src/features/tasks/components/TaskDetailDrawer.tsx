import { useEffect, useRef, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../../../types/task';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { formatDate } from '../../../utils';
import { X, Pencil, Trash2, CheckCircle2, User, Calendar, Clock, FileText, Activity } from 'lucide-react';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getCompletionPercentage(status: Task['status']): number {
  switch (status) {
    case 'Completed':
      return 100;
    case 'In Progress':
      return 50;
    case 'Pending':
      return 0;
    case 'Cancelled':
      return 0;
    default:
      return 0;
  }
}

function getStatusLabel(status: Task['status']): string {
  switch (status) {
    case 'Completed':
      return 'Completed';
    case 'In Progress':
      return 'In Progress';
    case 'Pending':
      return 'Pending';
    case 'Cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}

export default function TaskDetailDrawer({ task, isOpen, onClose, onEdit, onDelete }: TaskDetailDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const activityTimeline = useMemo(() => {
    if (!task) return [];
    const created = new Date(task.createdAt);
    const items: { label: string; description: string; timestamp: Date; icon: ReactNode }[] = [
      {
        label: 'Created',
        description: 'Task was created and added to the workspace.',
        timestamp: created,
        icon: <FileText className="w-3.5 h-3.5" />,
      },
      {
        label: 'Assigned',
        description: `Assigned to ${task.assignedTo}.`,
        timestamp: new Date(created.getTime() + 60 * 60 * 1000),
        icon: <User className="w-3.5 h-3.5" />,
      },
      {
        label: 'Updated',
        description: `Task status updated to ${getStatusLabel(task.status)}.`,
        timestamp: new Date(created.getTime() + 2 * 60 * 60 * 1000),
        icon: <Activity className="w-3.5 h-3.5" />,
      },
    ];

    if (task.status === 'Completed') {
      items.push({
        label: 'Completed',
        description: 'Task marked as completed.',
        timestamp: new Date(created.getTime() + 3 * 60 * 60 * 1000),
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      });
    }

    return items;
  }, [task]);

  const lastUpdated = useMemo(() => {
    if (!task) return null;
    return new Date(new Date(task.createdAt).getTime() + 2 * 60 * 60 * 1000);
  }, [task]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !drawerRef.current) return;

      const focusableElements = Array.from(drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement || !drawerRef.current.contains(document.activeElement as Node)) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement || !drawerRef.current.contains(document.activeElement as Node)) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      document.body.classList.add('overflow-hidden');
      const timer = setTimeout(() => {
        const closeButton = drawerRef.current?.querySelector<HTMLElement>('[data-drawer-close]');
        closeButton?.focus();
      }, 50);

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        document.body.classList.remove('overflow-hidden');
      };
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  useEffect(() => {
    if (!isOpen && previouslyFocusedRef.current) {
      previouslyFocusedRef.current.focus({ preventScroll: true });
    }
  }, [isOpen]);

  if (!task) return null;

  const completion = getCompletionPercentage(task.status);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="task-detail-title"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] md:w-[480px] lg:w-[560px] bg-white dark:bg-[#161922] shadow-2xl shadow-black/20 dark:shadow-black/40 border-l border-slate-200 dark:border-white/[0.08] flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-200 dark:border-white/[0.08]">
          <div className="space-y-2 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <h2 id="task-detail-title" className="text-lg font-bold tracking-tight text-slate-900 dark:text-white pr-2">
              {task.title}
            </h2>
          </div>
          <button
            data-drawer-close
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-lg text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-transparent hover:border-slate-200 dark:hover:border-white/[0.08] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161922]"
            aria-label="Close task details"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Task Information */}
          <section aria-labelledby="task-info-heading">
            <h3 id="task-info-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-3">
              Task Information
            </h3>
            <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] p-4 space-y-3">
              <p className="text-[13px] text-slate-600 dark:text-white/70 leading-relaxed">
                {task.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-white/30 uppercase tracking-wider">Assigned To</p>
                    <p className="text-[13px] font-medium text-slate-800 dark:text-white/90">{task.assignedTo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-white/30 uppercase tracking-wider">Due Date</p>
                    <p className="text-[13px] font-medium text-slate-800 dark:text-white/90">{formatDate(task.dueDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-white/30 uppercase tracking-wider">Created</p>
                    <p className="text-[13px] font-medium text-slate-800 dark:text-white/90">{formatDate(task.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Activity className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-white/30 uppercase tracking-wider">Last Updated</p>
                    <p className="text-[13px] font-medium text-slate-800 dark:text-white/90">{lastUpdated ? formatDate(lastUpdated.toISOString()) : formatDate(task.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Progress */}
          <section aria-labelledby="task-progress-heading">
            <h3 id="task-progress-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-3">
              Progress
            </h3>
            <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] p-4 space-y-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500 dark:text-white/50">Current Status</span>
                <span className="font-medium text-slate-800 dark:text-white/90">{getStatusLabel(task.status)}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-slate-500 dark:text-white/50">Priority</span>
                <span className="font-medium text-slate-800 dark:text-white/90">{task.priority}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-medium">
                  <span className="text-slate-500 dark:text-white/45">Completion</span>
                  <span className="text-slate-700 dark:text-white/80">{completion}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${completion === 100 ? 'bg-emerald-500' : completion > 0 ? 'bg-indigo-500' : 'bg-slate-400 dark:bg-white/30'}`}
                    style={{ width: `${completion}%` }}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={completion}
                    role="progressbar"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Activity Timeline */}
          <section aria-labelledby="task-activity-heading">
            <h3 id="task-activity-heading" className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 mb-3">
              Activity Timeline
            </h3>
            <div className="relative pl-4 space-y-5">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200 dark:bg-white/[0.08]" aria-hidden="true" />
              {activityTimeline.map((item, index) => (
                <div key={index} className="relative flex gap-3">
                  <div className="relative z-10 flex-shrink-0 w-[22px] h-[22px] rounded-full bg-white dark:bg-[#161922] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-500 dark:text-white/50">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0 -mt-0.5">
                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
                      <p className="text-[13px] font-semibold text-slate-800 dark:text-white/90">{item.label}</p>
                      <time className="text-[11px] text-slate-400 dark:text-white/35 font-mono">
                        {item.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' · '}
                        {item.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-white/45 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161922]"
              aria-label="Edit task"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit Task
            </button>
            <button
              onClick={() => {
                onClose();
                onDelete(task.id);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161922]"
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Task
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-[13px] font-medium text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white/90 hover:bg-slate-100 dark:hover:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161922]"
            aria-label="Close drawer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
