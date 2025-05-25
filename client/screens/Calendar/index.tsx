import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../theming"

export const Calendar = () => {
    const theme = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text }}>Calendar</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
    },
});
