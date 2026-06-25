import type { Task } from '@/features/tasks/types/task';

interface TaskTrendLineChartProps {
  tasks: Task[];
}

export default function TaskTrendLineChart({ tasks }: TaskTrendLineChartProps) {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfPrevWeek = new Date(startOfWeek);
  startOfPrevWeek.setDate(startOfWeek.getDate() - 7);
  const endOfPrevWeek = new Date(startOfWeek);
  endOfPrevWeek.setMilliseconds(-1);

  // Completed tasks this week vs last week
  const completedThisWeek = tasks.filter((t) => {
    if (t.status !== 'Completed') return false;
    const d = new Date(t.createdAt);
    return d >= startOfWeek;
  }).length;

  const completedPrevWeek = tasks.filter((t) => {
    if (t.status !== 'Completed') return false;
    const d = new Date(t.createdAt);
    return d >= startOfPrevWeek && d <= endOfPrevWeek;
  }).length;

  // Average resolution time (proxy: days between createdAt and dueDate for completed tasks)
  const completedTasks = tasks.filter((t) => t.status === 'Completed');
  const avgResolutionDays = completedTasks.length > 0
    ? completedTasks.reduce((sum, t) => {
        const created = new Date(t.createdAt).getTime();
        const due = new Date(t.dueDate).getTime();
        const days = Math.max(0, Math.round((due - created) / (1000 * 60 * 60 * 24)));
        return sum + days;
      }, 0) / completedTasks.length
    : 0;

  // Previous period resolution time (same calculation for prev week completed)
  const prevWeekCompletedTasks = tasks.filter((t) => {
    if (t.status !== 'Completed') return false;
    const d = new Date(t.createdAt);
    return d >= startOfPrevWeek && d <= endOfPrevWeek;
  });
  const prevAvgResolutionDays = prevWeekCompletedTasks.length > 0
    ? prevWeekCompletedTasks.reduce((sum, t) => {
        const created = new Date(t.createdAt).getTime();
        const due = new Date(t.dueDate).getTime();
        const days = Math.max(0, Math.round((due - created) / (1000 * 60 * 60 * 24)));
        return sum + days;
      }, 0) / prevWeekCompletedTasks.length
    : 0;

  const resolutionChange = prevAvgResolutionDays > 0
    ? Math.round(((avgResolutionDays - prevAvgResolutionDays) / prevAvgResolutionDays) * 100)
    : 0;
  const isFaster = resolutionChange <= 0;

  const completionChange = completedPrevWeek > 0
    ? Math.round(((completedThisWeek - completedPrevWeek) / completedPrevWeek) * 100)
    : completedThisWeek > 0 ? 100 : 0;
  const completionUp = completionChange >= 0;

  // Tasks closed per day this week
  const daysSoFar = Math.max(1, now.getDay() + 1);
  const closedPerDay = (completedThisWeek / daysSoFar).toFixed(1);

  return (
    <div className="w-full h-full min-h-[280px] flex flex-col">
      <div className="mb-1">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white/80">Task Velocity</h3>
        <p className="text-[11px] text-slate-400 dark:text-white/30 mt-0.5">Resolution & throughput metrics</p>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-5">
        {/* Primary Metric */}
        <div>
          <p className="text-[11px] font-medium text-slate-500 dark:text-white/45 uppercase tracking-wider">Average Resolution Time</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {avgResolutionDays > 0 ? avgResolutionDays.toFixed(1) : '—'}
            </span>
            <span className="text-sm text-slate-500 dark:text-white/45">days</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${isFaster ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isFaster ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7-7-7" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7 7 7" />
                </svg>
              )}
              {Math.abs(resolutionChange)}%
            </span>
            <span className="text-[10px] text-slate-400 dark:text-white/30">
              {isFaster ? 'faster' : 'slower'} than last week
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100 dark:border-white/[0.06]" />

        {/* Secondary Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-white/45 uppercase tracking-wider">Completed This Week</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{completedThisWeek}</span>
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${completionUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {completionUp ? (
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7 7 7" />
                  </svg>
                ) : (
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7-7-7" />
                  </svg>
                )}
                {Math.abs(completionChange)}%
              </span>
            </div>
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-white/45 uppercase tracking-wider">Closed Per Day</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">{closedPerDay}</span>
              <span className="text-[11px] text-slate-400 dark:text-white/35">avg</span>
            </div>
          </div>
        </div>

        {/* Mini insight bar */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/[0.06]">
          <div className={`w-1.5 h-1.5 rounded-full ${completedThisWeek > completedPrevWeek ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-amber-500 dark:bg-amber-400'}`} />
          <p className="text-[11px] text-slate-500 dark:text-white/50">
            {completedThisWeek > completedPrevWeek
              ? 'Throughput is trending upward this week.'
              : completedThisWeek === completedPrevWeek
                ? 'Throughput is consistent with last week.'
                : 'Throughput is slightly below last week.'}
          </p>
        </div>
      </div>
    </div>
  );
}