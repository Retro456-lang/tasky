import { useEffect, useState, type ReactNode } from 'react';
import { ThemeContext, getInitialTheme, type Theme } from '@/shared/hooks/useTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

function scheduleNextSixPM(callback: () => void): number {
  const now = new Date();
  const nextSixPM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0, 0);
  if (nextSixPM.getTime() <= now.getTime()) {
    nextSixPM.setDate(nextSixPM.getDate() + 1);
  }
  return window.setTimeout(callback, nextSixPM.getTime() - now.getTime());
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  // Auto-switch to dark at 6:00 PM local time
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 18) {
        setThemeState((current) => (current === 'light' ? 'dark' : current));
      }
    };

    // Check on mount
    checkTime();

    // Schedule next 6 PM check
    const timeoutId = scheduleNextSixPM(checkTime);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (value: Theme) => {
    setThemeState(value);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
