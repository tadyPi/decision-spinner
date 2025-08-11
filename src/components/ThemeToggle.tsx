import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-2 sm:right-4 z-30 p-3 rounded-full bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-300/20 dark:border-gray-700 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon size={24} className="text-gray-700 dark:text-gray-300" />
      ) : (
        <Sun size={24} className="text-yellow-500" />
      )}
    </button>
  );
};