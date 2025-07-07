import { StyleSheet } from "react-native";
import { useTheme } from "../../theming";

const theme = useTheme();

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    donutText: {
        fontSize: 14,
        fontWeight: "bold"
    }
})
