import type { ReactNode } from 'react';

interface TaskSummaryCardProps {
  label: string;
  value: number;
  previousValue?: number;
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
  trend?: 'up' | 'down' | 'neutral';
  insight?: string;
  onClick?: () => void;
}

export default function TaskSummaryCard({
  label,
  value,
  previousValue = 0,
  icon,
  iconColor,
  iconBg,
  trend = 'neutral',
  insight,
  onClick,
}: TaskSummaryCardProps) {
  const percentageChange = previousValue > 0
    ? Math.round(((value - previousValue) / previousValue) * 100)
    : value > 0 ? 100 : 0;

  const showTrend = percentageChange !== 0 || trend !== 'neutral';

  const trendConfig = {
    up: {
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      ),
    },
    down: {
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>
      ),
    },
    neutral: {
      color: 'text-slate-500 dark:text-white/40',
      bg: 'bg-slate-100 dark:bg-white/[0.04]',
      icon: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 12h14" />
        </svg>
      ),
    },
  };

  const config = trendConfig[trend];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`group relative bg-white dark:bg-[#161922] rounded-xl border border-slate-200 dark:border-white/[0.08] p-4 card-hover overflow-hidden ${onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0a0c10]' : ''}`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 dark:from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3 flex-1 min-w-0">
          <p className="text-[11px] font-medium text-slate-500 dark:text-white/45 uppercase tracking-wider">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {value}
            </h3>
            {showTrend && (
              <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${config.bg} ${config.color} text-[11px] font-semibold`}>
                {config.icon}
                {Math.abs(percentageChange)}%
              </span>
            )}
          </div>
          {insight && (
            <p className="text-[11px] text-slate-500 dark:text-white/45 leading-relaxed truncate">
              {insight}
            </p>
          )}
        </div>

        <div className={`flex-shrink-0 p-2 rounded-lg ${iconBg} ${iconColor} shadow-sm`}>
          <div className="w-4 h-4 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>

      {/* Bottom progress indicator */}
      <div className="mt-3 h-[2px] bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${iconBg.replace('bg-', 'bg-').replace('/10', '')} opacity-30 dark:opacity-40 transition-all duration-700`}
          style={{ width: `${Math.min((value / (previousValue + value || 1)) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}