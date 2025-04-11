import React, { createContext, useState, useContext, ReactNode } from 'react';
import { themes } from './index';
import { Theme } from './types';

type ThemeName = keyof typeof themes;

interface ThemeContextType {
    theme: Theme;
    themeName: ThemeName;
    setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [themeName, setThemeName] = useState<ThemeName>('tokyoNightStorm');
    const theme = themes[themeName];

    return (
        <ThemeContext.Provider value={{ theme, themeName, setThemeName }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
