import { useState, useMemo } from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '../../../types/task';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import TaskDetailDrawer from './TaskDetailDrawer';
import { formatDate } from '../../../utils';

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

type SortField = 'title' | 'assignedTo' | 'status' | 'priority' | 'dueDate';
type SortDirection = 'asc' | 'desc';

export default function TaskTable({ tasks, onEdit, onDelete }: TaskTableProps) {
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = (task: Task) => {
    if (viewingTask?.id !== task.id) {
      setViewingTask(task);
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    window.setTimeout(() => {
      setViewingTask(null);
    }, 300);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'assignedTo':
          comparison = a.assignedTo.localeCompare(b.assignedTo);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'priority':
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [tasks, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-3 h-3 text-slate-300 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-3 h-3 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (tasks.length === 0) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922]">
        <div className="py-16 text-center">
          <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] flex items-center justify-center text-slate-300 dark:text-white/25">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-slate-700 dark:text-white/70 font-medium text-sm">No Tasks Found</p>
              <p className="text-xs text-slate-400 dark:text-white/35">
                No tasks match the selected criteria. Create a new task or adjust your filters.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.03]">
              <th
                onClick={() => handleSort('title')}
                className="p-3 pl-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 cursor-pointer hover:text-slate-700 dark:hover:text-white/60 transition-colors select-none"
                style={{ width: '32%' }}
              >
                <div className="flex items-center gap-1">
                  Task Title
                  <SortIcon field="title" />
                </div>
              </th>
              <th
                onClick={() => handleSort('assignedTo')}
                className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 cursor-pointer hover:text-slate-700 dark:hover:text-white/60 transition-colors select-none"
                style={{ width: '15%' }}
              >
                <div className="flex items-center gap-1">
                  Assigned To
                  <SortIcon field="assignedTo" />
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 cursor-pointer hover:text-slate-700 dark:hover:text-white/60 transition-colors select-none"
                style={{ width: '13%' }}
              >
                <div className="flex items-center gap-1">
                  Status
                  <SortIcon field="status" />
                </div>
              </th>
              <th
                onClick={() => handleSort('priority')}
                className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 cursor-pointer hover:text-slate-700 dark:hover:text-white/60 transition-colors select-none"
                style={{ width: '12%' }}
              >
                <div className="flex items-center gap-1">
                  Priority
                  <SortIcon field="priority" />
                </div>
              </th>
              <th
                onClick={() => handleSort('dueDate')}
                className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40 cursor-pointer hover:text-slate-700 dark:hover:text-white/60 transition-colors select-none"
                style={{ width: '13%' }}
              >
                <div className="flex items-center gap-1">
                  Due Date
                  <SortIcon field="dueDate" />
                </div>
              </th>
              <th className="p-3 text-right pr-4 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-white/40" style={{ width: '15%' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
            {sortedTasks.map((task, index) => (
              <tr
                key={task.id}
                onClick={() => openDrawer(task)}
                className="group hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:bg-slate-50 dark:focus-visible:bg-white/[0.04] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/30"
                style={{ animationDelay: `${index * 30}ms` }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDrawer(task);
                  }
                }}
              >
                <td className="p-3 pl-4">
                  <div className="space-y-0.5 min-w-0">
                    <p className="font-medium text-[13px] text-slate-800 dark:text-white/90 group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-white/35 truncate max-w-[280px]">{task.description}</p>
                  </div>
                </td>
                <td className="p-3 text-[13px] font-medium text-slate-600 dark:text-white/70">
                  {task.assignedTo}
                </td>
                <td className="p-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className="p-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="p-3 text-[12px] text-slate-500 dark:text-white/50 font-mono whitespace-nowrap">
                  {formatDate(task.dueDate)}
                </td>
                <td className="p-3 text-right pr-4">
                  <div className="inline-flex gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDrawer(task);
                      }}
                      className="p-1.5 rounded-md text-slate-600 dark:text-white/70 bg-slate-50 dark:bg-white/[0.05] hover:bg-slate-100 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/[0.08] transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161922]"
                      title="View Task"
                      aria-label="View task details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task);
                      }}
                      className="p-1.5 rounded-md text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/15 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 border border-indigo-200 dark:border-indigo-500/30 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161922]"
                      title="Edit Task"
                      aria-label="Edit task"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                      }}
                      className="p-1.5 rounded-md text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/15 hover:bg-rose-100 dark:hover:bg-rose-500/25 border border-rose-200 dark:border-rose-500/30 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#161922]"
                      title="Delete Task"
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TaskDetailDrawer
        task={viewingTask}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onEdit={(task) => {
          closeDrawer();
          onEdit(task);
        }}
        onDelete={(id) => {
          closeDrawer();
          onDelete(id);
        }}
      />
    </div>
  );
}