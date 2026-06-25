import type { TaskPriority } from '@/features/tasks/types/task';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const configs = {
    'High': {
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-500/20',
      dot: 'bg-rose-500',
    },
    'Medium': {
      bg: 'bg-orange-50 dark:bg-orange-500/10',
      text: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-200 dark:border-orange-500/20',
      dot: 'bg-orange-500',
    },
    'Low': {
      bg: 'bg-sky-50 dark:bg-sky-500/10',
      text: 'text-sky-700 dark:text-sky-400',
      border: 'border-sky-200 dark:border-sky-500/20',
      dot: 'bg-sky-500',
    },
  };

  const config = configs[priority] || configs['Low'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border whitespace-nowrap ${config.bg} ${config.text} ${config.border}`}>
      <span className={`w-1 h-1 rounded-full ${config.dot}`} />
      {priority}
    </span>
  );
}