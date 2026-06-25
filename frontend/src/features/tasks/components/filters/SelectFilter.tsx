interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
}

export default function SelectFilter({ value, onChange, options, label }: SelectFilterProps) {
  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <label className="text-[10px] font-semibold text-slate-400 dark:text-white/25 uppercase tracking-wider pl-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-white/[0.03] text-slate-900 dark:text-white/80 text-[13px] focus:outline-none focus:border-indigo-300 dark:focus:border-indigo-500/30 focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-500/10 transition-all duration-200 appearance-none cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-white dark:bg-[#161922] text-slate-900 dark:text-white/80">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-300 dark:text-white/20">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}