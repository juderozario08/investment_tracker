import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../theming"

export const Statistics = () => {
    const theme = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text }}>Statistics goes here!</Text>
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
