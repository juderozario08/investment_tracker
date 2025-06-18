import { Text, TextProps } from "react-native"
import { useTheme } from "../theming"

export const ThemedText: React.FC<TextProps> = ({ style, ...props }) => {
    const theme = useTheme();
    return (
        <Text {...props} style={[{ color: theme.colors.text }, style]} />
    )
}
