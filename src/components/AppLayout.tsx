import Header from './Header';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  currentTab: 'dashboard' | 'tasks';
  setCurrentTab: (tab: 'dashboard' | 'tasks') => void;
  children: React.ReactNode;
}

export default function AppLayout({ currentTab, setCurrentTab, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0c10] text-slate-900 dark:text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          {/* Mobile Navigation bar */}
          <div className="flex md:hidden items-center justify-around bg-white dark:bg-[#161922] border border-slate-200 dark:border-white/[0.06] p-1.5 mb-4 rounded-xl">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex flex-col items-center gap-0.5 text-[10px] px-4 py-2 rounded-lg transition-all ${currentTab === 'dashboard' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20' : 'text-slate-400 dark:text-white/30'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setCurrentTab('tasks')}
              className={`flex flex-col items-center gap-0.5 text-[10px] px-4 py-2 rounded-lg transition-all ${currentTab === 'tasks' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20' : 'text-slate-400 dark:text-white/30'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span>Tasks</span>
            </button>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}