import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => { },
    viewportMode: 'mobile-frame',
    toggleViewportMode: () => { },
});
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('fb_theme') || 'light';
    });
    const [viewportMode, setViewportMode] = useState(() => {
        return localStorage.getItem('fb_viewport') || 'mobile-frame';
    });
    useEffect(() => {
        localStorage.setItem('fb_theme', theme);
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        }
        else {
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
    return (_jsx(ThemeContext.Provider, { value: { theme, toggleTheme, viewportMode, toggleViewportMode }, children: children }));
};
export const useTheme = () => useContext(ThemeContext);
//# sourceMappingURL=ThemeContext.js.map