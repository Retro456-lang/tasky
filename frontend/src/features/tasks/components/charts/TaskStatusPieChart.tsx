import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Task, TaskStatus } from '@/features/tasks/types/task';

interface TaskStatusPieChartProps {
  tasks: Task[];
}

const STATUS_ORDER: TaskStatus[] = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

const STATUS_COLORS: Record<TaskStatus, string> = {
  Pending: '#fbbf24',
  'In Progress': '#818cf8',
  Completed: '#34d399',
  Cancelled: '#f87171',
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  Pending: 'Pending',
  'In Progress': 'In Progress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
};

interface PieDataPoint {
  name: string;
  value: number;
  color: string;
  percentage: number;
  status: TaskStatus;
}

export default function TaskStatusPieChart({ tasks }: TaskStatusPieChartProps) {
  const total = tasks.length;

  const rawData = STATUS_ORDER
    .map((status) => ({
      name: STATUS_LABELS[status],
      value: tasks.filter((task) => task.status === status).length,
      color: STATUS_COLORS[status],
      status,
    }))
    .filter((entry) => entry.value > 0);

  const data: PieDataPoint[] = rawData.map((entry) => ({
    ...entry,
    percentage: total > 0 ? Math.round((entry.value / total) * 100) : 0,
  }));

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[280px] rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#161922]">
        <p className="text-slate-400 dark:text-white/30 text-sm">No task data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[280px] flex flex-col">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white/80">Status Breakdown</h3>
        <p className="text-[11px] text-slate-400 dark:text-white/30 mt-0.5">Distribution by current status</p>
      </div>
      <div className="flex-1 min-h-[160px] relative">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={160}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="56%"
              outerRadius="84%"
              paddingAngle={3}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--chart-tooltip-bg)',
                borderColor: 'var(--chart-tooltip-border)',
                borderRadius: '0.75rem',
                color: 'var(--chart-tooltip-text)',
                boxShadow: 'var(--chart-tooltip-shadow)',
                fontSize: '12px',
                padding: '8px 12px',
              }}
              itemStyle={{ color: 'var(--chart-tooltip-text)', fontWeight: 600 }}
              formatter={(value, name) => {
                const raw = Array.isArray(value) ? value[0] : value;
                const count = typeof raw === 'number' ? raw : 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return [`${count} tasks (${pct}%)`, name];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label — Completion Rate */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{completionRate}%</span>
          <span className="text-[10px] text-slate-500 dark:text-white/40 uppercase tracking-wider font-medium">Completion</span>
        </div>
      </div>
      {/* Legend with counts and percentages */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-[11px] text-slate-500 dark:text-white/50 truncate">{entry.name}</span>
            <span className="text-[11px] text-slate-700 dark:text-white/80 font-semibold tabular-nums ml-auto">
              {entry.value}
              <span className="text-slate-400 dark:text-white/35 font-normal ml-0.5">({entry.percentage}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}