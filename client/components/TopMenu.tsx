import { View } from "react-native"
import { useTheme } from "../theming"
import { ReactNode } from "react";

export const TopMenu: React.FC<{
    children?: ReactNode
}> = ({ children }) => {
    const theme = useTheme();
    return (
        <View style={[{ backgroundColor: theme.colors.muted, paddingTop: 50 }]}>
            {children}
        </View>
    )
}
