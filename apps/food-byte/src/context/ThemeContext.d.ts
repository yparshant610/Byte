import React from 'react';
export type ThemeMode = 'light' | 'dark';
export type ViewportMode = 'mobile-frame' | 'responsive';
interface ThemeContextType {
    theme: ThemeMode;
    toggleTheme: () => void;
    viewportMode: ViewportMode;
    toggleViewportMode: () => void;
}
export declare const ThemeProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useTheme: () => ThemeContextType;
export {};
