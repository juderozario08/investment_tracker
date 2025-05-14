import { ColorValue } from "react-native";

export interface ThemeColors {
    background: ColorValue;
    text: ColorValue;
    textSubtle: ColorValue;
    primary: ColorValue;
    secondary: ColorValue;
    accent: ColorValue;
    muted: ColorValue;
    border: ColorValue;
    card: ColorValue;
    tabBarBackground: ColorValue;
    tabBarActive: ColorValue;
    tabBarInactive: ColorValue;
    headerBackground: ColorValue;
    headerText: ColorValue;
    income: ColorValue;
    investment: ColorValue;
    spending: ColorValue;
}

export interface Theme {
    name: string;
    colors: ThemeColors;
}

export interface Themes {
    light: Theme;
    dark: Theme;
}
