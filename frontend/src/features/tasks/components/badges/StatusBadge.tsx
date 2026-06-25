import type { TaskStatus } from '@/features/tasks/types/task';

interface StatusBadgeProps {
  status: TaskStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const configs = {
    'Pending': {
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/20',
      dot: 'bg-amber-500',
      glow: 'shadow-[0_0_6px_rgba(251,191,36,0.3)]',
    },
    'In Progress': {
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      text: 'text-indigo-700 dark:text-indigo-400',
      border: 'border-indigo-200 dark:border-indigo-500/20',
      dot: 'bg-indigo-500',
      glow: 'shadow-[0_0_6px_rgba(129,140,248,0.3)]',
    },
    'Completed': {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      dot: 'bg-emerald-500',
      glow: 'shadow-[0_0_6px_rgba(52,211,153,0.3)]',
    },
    'Cancelled': {
      bg: 'bg-slate-100 dark:bg-white/[0.04]',
      text: 'text-slate-600 dark:text-white/40',
      border: 'border-slate-200 dark:border-white/[0.08]',
      dot: 'bg-slate-400 dark:bg-white/30',
      glow: '',
    },
  };

  const config = configs[status] || configs['Pending'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border whitespace-nowrap ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${config.glow}`} />
      {status}
    </span>
  );
}