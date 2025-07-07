import { View } from "react-native"
import { styles } from "../styles";
import { ThemedText } from "../../../components/ThemedText";
import { useTheme } from "../../../theming";

export const YTD = () => {
    const theme = useTheme();
    return (
        <View
            style={[styles.container]}>
            <ThemedText>YTD</ThemedText>
        </View>
    )
}
