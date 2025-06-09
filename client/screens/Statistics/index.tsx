import { useTheme } from "../../theming"
import { SafeAreaView } from "react-native-safe-area-context";

export const Statistics = () => {
    const theme = useTheme();
    return (
        <SafeAreaView
            style={{
                backgroundColor: theme.colors.background,
                flex: 1,
            }}>
        </SafeAreaView>
    )
}
