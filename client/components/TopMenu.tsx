import { View } from "react-native"
import { useTheme } from "../theming"
import { MonthSwitcher } from "./MonthSwitcher";
import { MonthTotal } from "./MonthTotal";

export const TopMenu = () => {
    const theme = useTheme();
    return (
        <View style={[{ backgroundColor: theme.colors.muted, paddingTop: 50 }]}>
            <MonthSwitcher />
            <MonthTotal />
        </View>
    )
}
