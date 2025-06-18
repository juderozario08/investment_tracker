import { SafeAreaView, StyleSheet, Text } from "react-native"
import { useTheme } from "../../../theming"
import { FadingPressable } from "../../../components/FadingPressable";
import { ThemedText } from "../../../components/ThemedText";

export const YTD = () => {
    const theme = useTheme();
    return (
        <SafeAreaView style={[{
            backgroundColor: theme.colors.background
        }, styles.container]}>
            <FadingPressable onPress={() => {
            }}>
                <ThemedText>Hello Button</ThemedText>
            </FadingPressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
