import { Theme, Themes } from "./types";

export const themes: Themes = {
    light: {
        name: 'Soft Aura',
        colors: {
            background: '#f9fafb',
            card: '#ffffff',
            text: '#1c1e21',
            primary: '#2563eb',
            secondary: '#f472b6',
            accent: '#22c55e',
            muted: '#e5e7eb',
            border: '#d1d5db',
            tabBarBackground: '#ffffff',
            tabBarActive: '#2563eb',
            tabBarInactive: '#9ca3af',
            headerBackground: '#ffffff',
            headerText: '#1c1e21',
        },
    },
    dark: {
        name: 'Midnight Luxe',
        colors: {
            background: '#121417',
            card: '#1c1f26',
            text: '#e6e8eb',
            primary: '#5ea1ff',
            secondary: '#ff85a2',
            accent: '#72faca',
            muted: '#2a2d33',
            border: '#2e323a',
            tabBarBackground: '#1c1f26',
            tabBarActive: '#5ea1ff',
            tabBarInactive: '#6b7280',
            headerBackground: '#1c1f26',
            headerText: '#e6e8eb',
        },
    },
};
export type ThemeNames = keyof typeof themes;

export const DefaultTheme: Theme = themes.dark
