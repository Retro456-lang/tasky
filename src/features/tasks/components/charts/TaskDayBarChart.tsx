import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Task } from '../../../../types/task';

interface TaskDayBarChartProps {
  tasks: Task[];
}

interface DayDataPoint {
  date: string;
  count: number;
  dayLabel: string;
  fullDate: string;
  isToday: boolean;
}

const BAR_COLORS = {
  primary: '#6366f1',
  secondary: '#818cf8',
  today: '#6366f1',
};

export default function TaskDayBarChart({ tasks }: TaskDayBarChartProps) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);

  // Calculate week boundaries
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfPrevWeek = new Date(startOfWeek);
  startOfPrevWeek.setDate(startOfWeek.getDate() - 7);
  const endOfPrevWeek = new Date(startOfWeek);
  endOfPrevWeek.setMilliseconds(-1);

  const grouped = tasks.reduce<Record<string, number>>((acc, task) => {
    const date = task.createdAt.slice(0, 10);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const data: DayDataPoint[] = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => {
      const d = new Date(`${date}T00:00:00`);
      return {
        date,
        count,
        dayLabel: d.toLocaleDateString(undefined, { weekday: 'narrow' }),
        fullDate: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        isToday: date === todayStr,
      };
    });

  // Summary metrics
  const thisWeekCount = tasks.filter((t) => {
    const d = new Date(t.createdAt);
    return d >= startOfWeek;
  }).length;

  const prevWeekCount = tasks.filter((t) => {
    const d = new Date(t.createdAt);
    return d >= startOfPrevWeek && d <= endOfPrevWeek;
  }).length;

  const weekChange = prevWeekCount > 0
    ? Math.round(((thisWeekCount - prevWeekCount) / prevWeekCount) * 100)
    : thisWeekCount > 0 ? 100 : 0;

  const isPositive = weekChange >= 0;

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[280px] rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#161922]">
        <p className="text-slate-400 dark:text-white/30 text-sm">No task data available.</p>
      </div>
    );
  }

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="w-full h-full min-h-[280px] flex flex-col">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white/80">Tasks Created</h3>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{thisWeekCount}</span>
          <span className="text-[11px] text-slate-500 dark:text-white/45">This Week</span>
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isPositive ? (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7-7-7" />
              </svg>
            )}
            {Math.abs(weekChange)}%
          </span>
          <span className="text-[10px] text-slate-400 dark:text-white/30">vs last week</span>
        </div>
      </div>
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%" minHeight={180}>
          <BarChart data={data} margin={{ top: 2, right: 4, left: -24, bottom: 2 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--chart-grid)"
              vertical={false}
            />
            <XAxis
              dataKey="dayLabel"
              tick={{ fill: 'var(--chart-tick)', fontSize: 11, fontFamily: 'Inter', fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: 'var(--chart-axis)' }}
            />
            <YAxis
              tick={{ fill: 'var(--chart-tick)', fontSize: 11, fontFamily: 'Inter' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--chart-axis)' }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'var(--chart-cursor)' }}
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
              labelStyle={{ color: 'var(--chart-tick)', fontSize: '11px', marginBottom: '4px' }}
              formatter={(value) => {
                const raw = Array.isArray(value) ? value[0] : value;
                const count = typeof raw === 'number' ? raw : 0;
                return [`${count} task${count === 1 ? '' : 's'}`, 'Created'];
              }}
              labelFormatter={(_, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullDate;
                }
                return '';
              }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={800} maxBarSize={36}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isToday ? BAR_COLORS.today : entry.count === maxCount ? BAR_COLORS.primary : BAR_COLORS.secondary}
                  opacity={entry.isToday ? 1 : entry.count === maxCount ? 0.9 : 0.55}
                  stroke={entry.isToday ? BAR_COLORS.today : 'transparent'}
                  strokeWidth={entry.isToday ? 1.5 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}