import type { ReactNode } from 'react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function TaskModal({ isOpen, onClose, title, children }: TaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922] p-5 shadow-2xl dark:shadow-black/50 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-white/[0.06]">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white/90 tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white/60 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form / Content */}
        <div className="max-h-[75vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}