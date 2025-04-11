export interface ThemeColors {
    background: string,
    text: string,
    primary: string,
    secondary: string,
    accent: string,
    muted: string,
    border: string,
    card: string,
}

export interface Theme {
    name: string,
    colors: ThemeColors
}

export interface Themes {
    catppuccinMocha: Theme;
    tokyoNightStorm: Theme;
    lightMode: Theme;
}
