import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../../../../../theming/ThemeProvider";

export const ExpenseForm = () => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text>Expense Tracker</Text>
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
