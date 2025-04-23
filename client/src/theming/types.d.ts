export interface ThemeColors {
    background: string,
    text: string,
    primary: string,
    secondary: string,
    accent: string,
    muted: string,
    border: string,
    card: string,
    tabBarBackground: string,
    tabBarActive: string,
    tabBarInactive: string,
    headerBackground: string,
    headerText: string,
    income: string,
    investment: string,
    spending: string
}

export interface Theme {
    name: string,
    colors: ThemeColors
}

export interface Themes {
    light: Theme;
    dark: Theme;
}
