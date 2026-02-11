import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import clsx from 'clsx';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Sync with local storage and system pref on mount
  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Prevent hydration mismatch by not rendering icon until mounted
  if (!mounted) return <div className="w-9 h-9" />; 

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "p-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500",
        "hover:bg-slate-200 dark:hover:bg-slate-800",
        "text-slate-600 dark:text-slate-400"
      )}
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
