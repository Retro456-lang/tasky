import { useMemo, useState } from 'react';
import { Clock3 } from 'lucide-react';
import type { Task } from '@/features/tasks/types/task';
import TaskSummaryCard from './TaskSummaryCard';
import TaskTable from '@/features/tasks/components/table/TaskTable';
import TaskDayBarChart from '@/features/tasks/components/charts/TaskDayBarChart';
import TaskTrendLineChart from '@/features/tasks/components/charts/TaskTrendLineChart';
import TaskStatusPieChart from '@/features/tasks/components/charts/TaskStatusPieChart';

interface DashboardProps {
  tasks: Task[];
  onCreate: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onNavigateToTasks: (statusFilter?: 'All' | 'Pending' | 'In Progress' | 'Completed') => void;
}

type QuickFilter = 'today' | 'week' | 'month' | 'all';

import { useAuth } from '@/features/auth/context/AuthContext';

export default function Dashboard({ tasks, onCreate, onEdit, onDelete, onNavigateToTasks }: DashboardProps) {
  const { user } = useAuth();
  const canManage = user?.role === 'Superadmin' || user?.role === 'Manager';

  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().slice(0, 10);

    switch (quickFilter) {
      case 'today': {
        return tasks.filter(t => t.createdAt.slice(0, 10) === today).slice(0, 5);
      }
      case 'week': {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return tasks.filter(t => new Date(t.createdAt) >= weekAgo).slice(0, 5);
      }
      case 'month': {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return tasks.filter(t => new Date(t.createdAt) >= monthAgo).slice(0, 5);
      }
      case 'all':
      default:
        return [...tasks]
          .sort((a, b) => {
            const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return db - da;
          })
          .slice(0, 5);
    }
  }, [tasks, quickFilter]);

  const quickFilters: { value: QuickFilter; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];

  const summaries = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      previousValue: Math.max(0, totalTasks - 3),
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/10',
      trend: 'up' as const,
      insight: `${completionRate}% completion rate across all tasks`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      statusFilter: 'All' as const,
    },
    {
      label: 'Pending',
      value: pendingTasks,
      previousValue: Math.max(0, pendingTasks - 1),
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      trend: pendingTasks > 2 ? 'up' as const : 'neutral' as const,
      insight: pendingTasks > 0 ? `${pendingTasks} tasks awaiting action` : 'All caught up',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      statusFilter: 'Pending' as const,
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      previousValue: Math.max(0, inProgressTasks - 1),
      iconColor: 'text-sky-600 dark:text-sky-400',
      iconBg: 'bg-sky-50 dark:bg-sky-500/10',
      trend: 'up' as const,
      insight: `${inProgressTasks} active workstreams`,
      icon: <Clock3 className="w-4 h-4" />,
      statusFilter: 'In Progress' as const,
    },
    {
      label: 'Completed',
      value: completedTasks,
      previousValue: Math.max(0, completedTasks - 2),
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      trend: 'up' as const,
      insight: `${completedTasks} tasks delivered`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      statusFilter: 'Completed' as const,
    },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-white/45">
            Real-time workspace metrics and task overview
          </p>
        </div>
        {canManage && (
          <button
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 active:scale-[0.98]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            Create Task
          </button>
        )}
      </div>

      {/* Summary Cards Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaries.map((summary, index) => (
          <TaskSummaryCard
            key={index}
            label={summary.label}
            value={summary.value}
            previousValue={summary.previousValue}
            icon={summary.icon}
            iconColor={summary.iconColor}
            iconBg={summary.iconBg}
            trend={summary.trend}
            insight={summary.insight}
            onClick={() => onNavigateToTasks(summary.statusFilter)}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922] p-4">
          <TaskDayBarChart tasks={tasks} />
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922] p-4">
          <TaskTrendLineChart tasks={tasks} />
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922] p-4">
          <TaskStatusPieChart tasks={tasks} />
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">Recent Tasks</h3>
            <p className="text-[11px] text-slate-500 dark:text-white/45 mt-0.5">Latest activity across workspace</p>
          </div>

          {/* Quick Filters */}
          <div className="inline-flex items-center gap-0.5 p-0.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922]">
            {quickFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setQuickFilter(filter.value)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all duration-200 ${quickFilter === filter.value
                  ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
                  : 'text-slate-500 dark:text-white/45 hover:text-slate-700 dark:hover:text-white/70 border border-transparent'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <TaskTable tasks={filteredTasks} onEdit={onEdit} onDelete={onDelete} />
      </div>

    </div>
  );
}