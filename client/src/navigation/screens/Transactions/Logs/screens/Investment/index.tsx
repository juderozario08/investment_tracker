import { StyleSheet, View, Text } from "react-native"
import { useTheme } from "../../../../../../theming/ThemeProvider"

export const InvestmentTracker = () => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text }}>Investment Tracker</Text>
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
