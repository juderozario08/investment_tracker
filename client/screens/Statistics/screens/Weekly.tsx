import { View } from "react-native"
import { useTheme } from "../../../theming";
import { styles } from "../styles";
import { ThemedText } from "../../../components/ThemedText";

export const Weekly = () => {
    const theme = useTheme();
    return (
        <View style={styles.container}>
            <ThemedText>Weekly</ThemedText>
        </View>
    )
}
