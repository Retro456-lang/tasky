export function SummaryCardsSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#161922] p-4"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200 dark:bg-white/[0.06]" />
            <div className="h-7 w-7 animate-pulse rounded-lg bg-slate-200 dark:bg-white/[0.06]" />
          </div>
          <div className="mt-3">
            <div className="h-7 w-14 animate-pulse rounded bg-slate-200 dark:bg-white/[0.06]" />
          </div>
          <div className="mt-3 h-[2px] bg-slate-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-slate-200 dark:bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#161922]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-white/[0.02]">
              <th className="p-3 pl-4 text-[11px] font-semibold uppercase tracking-wider text-slate-300 dark:text-white/20">Task Title</th>
              <th className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-300 dark:text-white/20">Assigned To</th>
              <th className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-300 dark:text-white/20">Status</th>
              <th className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-300 dark:text-white/20">Priority</th>
              <th className="p-3 text-[11px] font-semibold uppercase tracking-wider text-slate-300 dark:text-white/20">Due Date</th>
              <th className="p-3 text-right pr-4 text-[11px] font-semibold uppercase tracking-wider text-slate-300 dark:text-white/20">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="p-3 pl-4">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-32 rounded bg-slate-200 dark:bg-white/[0.06]" />
                    <div className="h-3 w-44 rounded bg-slate-100 dark:bg-white/[0.04]" />
                  </div>
                </td>
                <td className="p-3">
                  <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-white/[0.06]" />
                </td>
                <td className="p-3">
                  <div className="h-5 w-14 rounded bg-slate-200 dark:bg-white/[0.06]" />
                </td>
                <td className="p-3">
                  <div className="h-5 w-12 rounded bg-slate-200 dark:bg-white/[0.06]" />
                </td>
                <td className="p-3">
                  <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-white/[0.06]" />
                </td>
                <td className="p-3 text-right pr-4">
                  <div className="inline-flex gap-1 justify-end">
                    <div className="h-6 w-6 rounded bg-slate-200 dark:bg-white/[0.06]" />
                    <div className="h-6 w-6 rounded bg-slate-200 dark:bg-white/[0.06]" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="h-7 w-32 animate-pulse rounded bg-slate-200 dark:bg-white/[0.06]" />
          <div className="h-3.5 w-56 animate-pulse rounded bg-slate-100 dark:bg-white/[0.04]" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-200 dark:bg-white/[0.06]" />
      </div>

      <SummaryCardsSkeleton />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-[280px] rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#161922] animate-pulse" />
        <div className="h-[280px] rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#161922] animate-pulse" />
        <div className="h-[280px] rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#161922] animate-pulse" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 animate-pulse rounded bg-slate-200 dark:bg-white/[0.06]" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-white/[0.06]" />
        </div>
        <TableSkeleton />
      </div>
    </div>
  );
}