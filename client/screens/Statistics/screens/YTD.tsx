import { SafeAreaView, StyleSheet, View } from "react-native"
import { useTheme } from "../../../theming"

export const YTD = () => {
    const theme = useTheme();
    return (
        <SafeAreaView style={[{
            backgroundColor: theme.colors.background
        }, styles.container]}>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
