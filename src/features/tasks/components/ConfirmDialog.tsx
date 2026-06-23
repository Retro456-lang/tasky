interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onCancel}
        className="fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Dialog Shell */}
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#161922] p-5 shadow-2xl dark:shadow-black/50 transition-all">
        {/* Warning Icon & Header */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="space-y-1 pt-0.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white/90 tracking-tight">{title}</h3>
            <p className="text-xs text-slate-500 dark:text-white/40 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 justify-end pt-4 mt-4 border-t border-slate-200 dark:border-white/[0.06]">
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.12] bg-white dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.06] text-slate-500 dark:text-white/50 hover:text-slate-700 dark:hover:text-white/80 text-[13px] font-medium transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[13px] font-semibold shadow-lg shadow-rose-600/20 hover:shadow-rose-600/30 transition-all duration-150 active:scale-[0.98]"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}