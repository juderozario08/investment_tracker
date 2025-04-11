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
            background: '#24283b',
            text: '#c0caf5',
            primary: '#7aa2f7',
            secondary: '#bb9af7',
            accent: '#7dcfff',
            muted: '#414868',
            border: '#3b4261',
            card: '#1f2335',
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
