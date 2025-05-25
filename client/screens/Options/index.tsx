import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../theming"

export const Options = () => {
    const theme = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.text }}>Options!</Text>
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
