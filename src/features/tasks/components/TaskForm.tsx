import { useState } from 'react';
import type { Task, TaskStatus, TaskPriority } from '../../../types/task';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export default function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'Pending');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'Medium');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Task title is required';
    if (!assignedTo.trim()) newErrors.assignedTo = 'Assigned employee name is required';
    if (!status) newErrors.status = 'Status is required';
    if (!priority) newErrors.priority = 'Priority is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        assignedTo: assignedTo.trim(),
        status,
        priority,
        dueDate,
      });
    }
  };

  const inputBaseClasses =
    'w-full px-3 py-2 rounded-lg border bg-white dark:bg-white/[0.03] text-slate-900 dark:text-white/80 placeholder-slate-400 dark:placeholder-white/20 text-[13px] focus:outline-none focus:ring-1 transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wider pl-1">
          Task Title <span className="text-rose-500 dark:text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Implement User Authentication"
          className={`${inputBaseClasses} ${errors.title
            ? 'border-rose-300 dark:border-rose-500/30 focus:border-rose-400 dark:focus:border-rose-500/50 focus:ring-rose-100 dark:focus:ring-rose-500/10'
            : 'border-slate-200 dark:border-white/[0.06] focus:border-indigo-300 dark:focus:border-indigo-500/30 focus:ring-indigo-100 dark:focus:ring-indigo-500/10'
            }`}
        />
        {errors.title && <span className="text-[11px] text-rose-500 dark:text-rose-400 pl-1">{errors.title}</span>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wider pl-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed task description..."
          rows={3}
          className={`${inputBaseClasses} border-slate-200 dark:border-white/[0.06] focus:border-indigo-300 dark:focus:border-indigo-500/30 focus:ring-indigo-100 dark:focus:ring-indigo-500/10 resize-none`}
        />
      </div>

      {/* Assigned To */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wider pl-1">
          Assigned To <span className="text-rose-500 dark:text-rose-400">*</span>
        </label>
        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          placeholder="e.g. Rahul Dev"
          className={`${inputBaseClasses} ${errors.assignedTo
            ? 'border-rose-300 dark:border-rose-500/30 focus:border-rose-400 dark:focus:border-rose-500/50 focus:ring-rose-100 dark:focus:ring-rose-500/10'
            : 'border-slate-200 dark:border-white/[0.06] focus:border-indigo-300 dark:focus:border-indigo-500/30 focus:ring-indigo-100 dark:focus:ring-indigo-500/10'
            }`}
        />
        {errors.assignedTo && <span className="text-[11px] text-rose-500 dark:text-rose-400 pl-1">{errors.assignedTo}</span>}
      </div>

      {/* Grid: Status & Priority */}
      <div className="grid grid-cols-2 gap-3">
        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wider pl-1">
            Status <span className="text-rose-500 dark:text-rose-400">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className={`${inputBaseClasses} border-slate-200 dark:border-white/[0.06] focus:border-indigo-300 dark:focus:border-indigo-500/30 focus:ring-indigo-100 dark:focus:ring-indigo-500/10 cursor-pointer`}
          >
            <option value="Pending" className="bg-white dark:bg-[#161922] text-slate-900 dark:text-white/80">Pending</option>
            <option value="In Progress" className="bg-white dark:bg-[#161922] text-slate-900 dark:text-white/80">In Progress</option>
            <option value="Completed" className="bg-white dark:bg-[#161922] text-slate-900 dark:text-white/80">Completed</option>
            <option value="Cancelled" className="bg-white dark:bg-[#161922] text-slate-900 dark:text-white/80">Cancelled</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wider pl-1">
            Priority <span className="text-rose-500 dark:text-rose-400">*</span>
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className={`${inputBaseClasses} border-slate-200 dark:border-white/[0.06] focus:border-indigo-300 dark:focus:border-indigo-500/30 focus:ring-indigo-100 dark:focus:ring-indigo-500/10 cursor-pointer`}
          >
            <option value="High" className="bg-white dark:bg-[#161922] text-slate-900 dark:text-white/80">High</option>
            <option value="Medium" className="bg-white dark:bg-[#161922] text-slate-900 dark:text-white/80">Medium</option>
            <option value="Low" className="bg-white dark:bg-[#161922] text-slate-900 dark:text-white/80">Low</option>
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-wider pl-1">
          Due Date <span className="text-rose-500 dark:text-rose-400">*</span>
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`${inputBaseClasses} ${errors.dueDate
            ? 'border-rose-300 dark:border-rose-500/30 focus:border-rose-400 dark:focus:border-rose-500/50 focus:ring-rose-100 dark:focus:ring-rose-500/10'
            : 'border-slate-200 dark:border-white/[0.06] focus:border-indigo-300 dark:focus:border-indigo-500/30 focus:ring-indigo-100 dark:focus:ring-indigo-500/10'
            }`}
        />
        {errors.dueDate && <span className="text-[11px] text-rose-500 dark:text-rose-400 pl-1">{errors.dueDate}</span>}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 justify-end pt-3 border-t border-slate-200 dark:border-white/[0.06]">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.12] bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white/80 text-[13px] font-medium transition-all duration-150"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-150 active:scale-[0.98]"
        >
          {task ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}