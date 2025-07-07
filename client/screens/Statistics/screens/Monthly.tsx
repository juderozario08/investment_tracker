import { View } from "react-native"
import { useTheme } from "../../../theming";
import { styles } from "../styles";
import { ThemedText } from "../../../components/ThemedText";

export const Monthly = () => {
    const theme = useTheme();
    return (
        <View style={styles.container}>
            <ThemedText>Monthly</ThemedText>
        </View>
    )
}
