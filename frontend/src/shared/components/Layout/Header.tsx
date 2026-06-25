import { useTheme } from '@/shared/hooks/useTheme';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className="h-14 border-b border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-indigo-500/20">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            RetroTask
          </h1>
          <span className="hidden sm:inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/[0.06] text-slate-400 dark:text-white/40 border border-slate-200 dark:border-white/[0.06]">
            v1.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          className="p-2 text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition duration-200"
        >
          {theme === 'light' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>

        {/* Notification bell */}
        <button className="p-2 text-slate-400 dark:text-white/40 hover:text-slate-700 dark:hover:text-white/80 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition duration-200 relative">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        </button>

        {/* Dynamic User Profile & Logout */}
        {user && (
          <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200 dark:border-white/[0.06]">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-700 dark:text-white/80">{user.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-white/40 leading-tight uppercase font-semibold tracking-wider">
                {user.role}
              </p>
            </div>
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500/20 to-violet-500/20 dark:from-indigo-500/20 dark:to-violet-500/20 border border-indigo-500/30 dark:border-indigo-500/40 overflow-hidden flex items-center justify-center text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
              {getInitials(user.name)}
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-500 dark:text-white/40 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition duration-200 ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}