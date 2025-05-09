import React, { useState, useEffect } from 'react';
import { Theme, ThemeContext } from './themeContext.types';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    if (typeof window === 'undefined') return 'light';

    // Check localStorage first
    const savedTheme = getStorageItem('theme') as Theme;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Fall back to system preference and save it
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setStorageItem('theme', 'dark');
      return 'dark';
    }

    // Default to light theme and save it
    setStorageItem('theme', 'light');
    return 'light';
  };

  // Initialize state with theme from localStorage or defaults
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Only apply the theme to the document without saving to localStorage
  useEffect(() => {
    if (!theme) return;

    // Apply theme to document (not setting, just applying what was read)
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    console.log('Theme applied to document:', theme);
  }, [theme]);

  // The toggle function is the explicit action to change the theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    // Set in localStorage first
    setStorageItem('theme', newTheme);
    // Then update the state
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export only the provider, useTheme hook is exported from themeUtils.ts