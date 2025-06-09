import { Text, View } from "react-native";
import { useTheme } from "../../theming"
import { TopMenu } from "../../components/TopMenu";
import { MonthSwitcher } from "../../components/MonthSwitcher";

export const Statistics = () => {
    const theme = useTheme();
    return (
        <View
            style={{
                backgroundColor: theme.colors.background,
                flex: 1,
            }}>
            <TopMenu>
                <MonthSwitcher />
            </TopMenu>
            <Text></Text>
        </View>
    )
}
