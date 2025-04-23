import { View, StyleSheet } from "react-native"
import { useTheme } from "../theming/ThemeProvider"
import { ReactNode } from "react";
import { MonthSwitcher } from "./MonthSwitcher";

export const TopMenu: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { theme } = useTheme();
    return (
        <View style={[{ backgroundColor: theme.colors.muted }, styles.container]}>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'absolute',
        top: 17,
        padding: 10
    },
})
