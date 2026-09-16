import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Check localStorage first
    try {
      const saved = localStorage.getItem('krishi_theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // localStorage not accessible (e.g. in some iframe sandboxes)
    }
    // Default to dark as primary theme for KrishiRakshak, but check system preference if wanted
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      if (body) {
        body.classList.remove('dark');
        body.classList.add('light');
        body.setAttribute('data-theme', 'light');
      }
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      if (body) {
        body.classList.remove('light');
        body.classList.add('dark');
        body.setAttribute('data-theme', 'dark');
      }
    }

    try {
      localStorage.setItem('krishi_theme', theme);
    } catch {
      // ignore storage failure
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
