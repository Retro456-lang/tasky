import { useAuth } from '@/features/auth/context/AuthContext';

interface SidebarProps {
  currentTab: 'dashboard' | 'tasks';
  setCurrentTab: (tab: 'dashboard' | 'tasks') => void;
}

export default function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  const { user } = useAuth();
  
  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      id: 'tasks' as const,
      label: 'Employee Tasks',
      icon: (
        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-[216px] border-r border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0f1117] flex-shrink-0 hidden md:flex flex-col justify-between py-4 px-3 h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="space-y-1">
        <div className="px-2.5 pb-3">
          <p className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-widest">
            Workspace
          </p>
        </div>
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20'
                  : 'text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white/80 hover:bg-slate-50 dark:hover:bg-white/[0.04] border border-transparent'
                  }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Superadmin Mode status banner */}
        {user?.role === 'Superadmin' && (
          <div className="mt-4 p-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5 shadow-glow-sm flex flex-col gap-1 mx-0.5 select-none">
            <div className="flex items-center gap-1.5 text-indigo-500 dark:text-indigo-400">
              <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">Superadmin Mode</span>
            </div>
            <p className="text-[9px] text-slate-400 dark:text-white/40 leading-normal">
              Full CRUD administrative privileges are enabled.
            </p>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-white/[0.06] pt-3 px-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-white/30">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></div>
          <span>Connected to API</span>
        </div>
      </div>
    </aside>
  );
}