import { RotateCcw } from 'lucide-react';
import SearchInput from './SearchInput';
import SelectFilter from './SelectFilter';

interface TaskFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  onReset: () => void;
}

export default function TaskFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onReset,
}: TaskFiltersProps) {
  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'All', label: 'All Priorities' },
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || priorityFilter !== 'All';

  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#161922] p-3.5 flex flex-col md:flex-row gap-3 items-end justify-between">
      <div className="w-full md:w-auto flex flex-col md:flex-row gap-3 flex-1 items-stretch md:items-end">
        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 max-w-sm">
          <label className="text-[10px] font-semibold text-slate-400 dark:text-white/25 uppercase tracking-wider pl-1">
            Search
          </label>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by title or employee..."
          />
        </div>

        {/* Status Filter */}
        <SelectFilter
          label="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
        />

        {/* Priority Filter */}
        <SelectFilter
          label="Priority"
          value={priorityFilter}
          onChange={setPriorityFilter}
          options={priorityOptions}
        />
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.12] bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] text-slate-500 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/70 text-[13px] font-medium transition-all duration-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      )}
    </div>
  );
}