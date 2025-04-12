import { Themes } from "./types";

export const themes: Themes = {
    catppuccinMocha: {
        name: 'Catppuccin Mocha',
        colors: {
            background: '#1e1e2e',
            text: '#cdd6f4',
            primary: '#89b4fa',
            secondary: '#f38ba8',
            accent: '#b4befe',
            muted: '#45475a',
            border: '#585b70',
            card: '#313244',
        },
    },
    tokyoNightStorm: {
        name: 'TokyoNight Storm',
        colors: {
            background: '#1a1b26',
            text: '#a9b1d6',
            primary: '#627cd6',
            secondary: '#9d7cd8',
            accent: '#5ab0f6',
            muted: '#2e3440',
            border: '#2c3043',
            card: '#16161e',
        },
    },
    lightMode: {
        name: 'Light Mode',
        colors: {
            background: '#ffffff',
            text: '#111827',
            primary: '#2563eb',
            secondary: '#fbbf24',
            accent: '#ef4444',
            muted: '#f3f4f6',
            border: '#e5e7eb',
            card: '#f9fafb',
        },
    },
};

export type ThemeNames = keyof typeof themes;
