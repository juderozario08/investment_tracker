import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../../theming/ThemeProvider"
import { MonthSwitcher } from "../../../components/MonthSwitcher";

export const Calendar = () => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <MonthSwitcher />
            <Text style={{ color: theme.colors.text }}>Calendar!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
});
