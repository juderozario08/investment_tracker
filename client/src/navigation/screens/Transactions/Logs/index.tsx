import { StyleSheet, View, Text } from "react-native"
import { useTheme } from "../../../../theming/ThemeProvider"
import { MonthSwitcher } from "../../../../components/MonthSwitcher";

// This will be the Material top navigator
export const Logs = () => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <MonthSwitcher />
            <Text style={{ color: theme.colors.text }}>Logs</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    }
})
