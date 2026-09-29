import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type ViewportMode = 'mobile-frame' | 'responsive';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  viewportMode: ViewportMode;
  toggleViewportMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  viewportMode: 'mobile-frame',
  toggleViewportMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('fb_theme') as ThemeMode) || 'light';
  });

  const [viewportMode, setViewportMode] = useState<ViewportMode>(() => {
    return (localStorage.getItem('fb_viewport') as ViewportMode) || 'mobile-frame';
  });

  useEffect(() => {
    localStorage.setItem('fb_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('fb_viewport', viewportMode);
  }, [viewportMode]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleViewportMode = () => {
    setViewportMode(prev => (prev === 'mobile-frame' ? 'responsive' : 'mobile-frame'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, viewportMode, toggleViewportMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
