import { useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../../../types/task';
import TaskTable from './TaskTable';
import TaskFilters from './TaskFilters';
import TaskTrendLineChart from './charts/TaskTrendLineChart';
import TaskStatusPieChart from './charts/TaskStatusPieChart';

type ViewMode = 'table' | 'graph' | 'pie';

type StatusFilterValue = 'All' | 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';

interface TaskListPlaceholderProps {
  tasks: Task[];
  onCreate: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function getUrlStatusFilter(): StatusFilterValue {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'All';
  }
}

function getUrlPriorityFilter(): 'All' | 'High' | 'Medium' | 'Low' {
  const params = new URLSearchParams(window.location.search);
  const priority = params.get('priority');
  switch (priority) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return 'All';
  }
}

function getUrlSearchQuery(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('search') ?? '';
}

function statusFilterToUrl(status: StatusFilterValue): string | null {
  switch (status) {
    case 'Pending':
      return 'pending';
    case 'In Progress':
      return 'in-progress';
    case 'Completed':
      return 'completed';
    case 'Cancelled':
      return 'cancelled';
    case 'All':
    default:
      return null;
  }
}

function priorityFilterToUrl(priority: 'All' | 'High' | 'Medium' | 'Low'): string | null {
  switch (priority) {
    case 'High':
      return 'high';
    case 'Medium':
      return 'medium';
    case 'Low':
      return 'low';
    case 'All':
    default:
      return null;
  }
}

function updateFilterUrl(params: {
  search?: string;
  status?: StatusFilterValue;
  priority?: 'All' | 'High' | 'Medium' | 'Low';
}) {
  const url = new URL(window.location.href);
  const { search, status, priority } = params;

  if (search !== undefined) {
    if (search) url.searchParams.set('search', search);
    else url.searchParams.delete('search');
  }

  if (status !== undefined) {
    const statusUrl = statusFilterToUrl(status);
    if (statusUrl) url.searchParams.set('status', statusUrl);
    else url.searchParams.delete('status');
  }

  if (priority !== undefined) {
    const priorityUrl = priorityFilterToUrl(priority);
    if (priorityUrl) url.searchParams.set('priority', priorityUrl);
    else url.searchParams.delete('priority');
  }

  window.history.replaceState({}, '', url.pathname + url.search);
}

export default function TaskListPlaceholder({ tasks, onCreate, onEdit, onDelete }: TaskListPlaceholderProps) {
  const [searchQuery, setSearchQuery] = useState(getUrlSearchQuery);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(getUrlStatusFilter);
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>(getUrlPriorityFilter);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;

    const handleScroll = () => {
      setIsScrolled(main.scrollTop > 300);
    };

    main.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => main.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const handleSetSearchQuery = (value: string) => {
    setSearchQuery(value);
    updateFilterUrl({ search: value });
  };

  const handleSetStatusFilter = (value: string) => {
    const nextStatus = (value as StatusFilterValue) || 'All';
    setStatusFilter(nextStatus);
    updateFilterUrl({ status: nextStatus });
  };

  const handleSetPriorityFilter = (value: string) => {
    const nextPriority = (value as 'All' | 'High' | 'Medium' | 'Low') || 'All';
    setPriorityFilter(nextPriority);
    updateFilterUrl({ priority: nextPriority });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    updateFilterUrl({ search: '', status: 'All', priority: 'All' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setSearchQuery(getUrlSearchQuery());
      setStatusFilter(getUrlStatusFilter());
      setPriorityFilter(getUrlPriorityFilter());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const viewOptions: { value: ViewMode; label: string; icon: ReactNode }[] = [
    {
      value: 'table',
      label: 'Table',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      value: 'graph',
      label: 'Trend',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
    },
    {
      value: 'pie',
      label: 'Status',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4 relative pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Employee Tasks
          </h2>
          <p className="text-xs text-slate-500 dark:text-white/45">
            {filteredTasks.length} of {tasks.length} tasks shown
          </p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 active:scale-[0.98]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Create Task
        </button>
      </div>

      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={handleSetSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={handleSetStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={handleSetPriorityFilter}
        onReset={handleResetFilters}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white/90">
          {viewMode === 'table' && 'Task List'}
          {viewMode === 'graph' && 'Task Trends'}
          {viewMode === 'pie' && 'Status Distribution'}
        </h3>
        <div
          className="inline-flex items-center gap-0.5 p-0.5 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922]"
          role="tablist"
          aria-label="Task view switcher"
        >
          {viewOptions.map((option) => {
            const isActive = viewMode === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setViewMode(option.value)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Switch to ${option.label} view`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
                  : 'text-slate-500 dark:text-white/45 hover:text-slate-700 dark:hover:text-white/70 border border-transparent'
                  }`}
              >
                {option.icon}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        {viewMode === 'table' && (
          <TaskTable tasks={filteredTasks} onEdit={onEdit} onDelete={onDelete} />
        )}
        {viewMode === 'graph' && (
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922] p-4">
            <TaskTrendLineChart tasks={filteredTasks} />
          </div>
        )}
        {viewMode === 'pie' && (
          <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922] p-4">
            <TaskStatusPieChart tasks={filteredTasks} />
          </div>
        )}
      </div>

      {/* Floating Create Task Pill — scroll-aware */}
      <button
        onClick={onCreate}
        className={`fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 pl-4 pr-5 h-12 rounded-full
          bg-white/75 dark:bg-[#161922]/75
          hover:bg-white/90 dark:hover:bg-[#1e212b]/90
          backdrop-blur-xl
          border border-slate-200/60 dark:border-white/[0.08]
          hover:border-slate-300/80 dark:hover:border-white/[0.14]
          shadow-lg shadow-slate-900/5 dark:shadow-black/25
          hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-black/35
          text-indigo-600 dark:text-indigo-400
          transition-all duration-300 ease-out
          active:scale-95 active:duration-100
          ${isScrolled
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : 'translate-y-3 opacity-0 pointer-events-none'
          }`}
        aria-label="Create new task"
      >
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-[13px] font-semibold whitespace-nowrap">Create Task</span>
      </button>
    </div>
  );
}