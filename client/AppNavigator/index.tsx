import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../theming";
import { Transactions } from "../screens/Transactions";
import { enableScreens } from "react-native-screens";
import { BookOpen, MoreHorizontal, PieChart, Calendar as CalendarIcon } from "react-native-feather";
import { Calendar } from "../screens/Calendar";
import { Statistics } from "../screens/Statistics";
import { Options } from "../screens/Options";

enableScreens();

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    const theme = useTheme();
    const getTabColor = (focused: boolean) => {
        return focused ? theme.colors.tabBarActive : theme.colors.tabBarInactive
    }
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: theme.colors.tabBarBackground },
            tabBarActiveTintColor: String(theme.colors.tabBarActive),
            tabBarInactiveTintColor: String(theme.colors.tabBarInactive)
        }} initialRouteName="Calendar">
            <Tab.Screen name='Transactions' component={Transactions} options={{
                tabBarIcon: ({ focused }) =>
                    <BookOpen color={getTabColor(focused)} />
            }} />
            <Tab.Screen name='Calendar' component={Calendar} options={{
                tabBarIcon: ({ focused }) =>
                    <CalendarIcon color={getTabColor(focused)} />
            }} />
            <Tab.Screen name='Stats' component={Statistics} options={{
                tabBarIcon: ({ focused }) =>
                    <PieChart color={getTabColor(focused)} />
            }} />
            <Tab.Screen name='More' component={Options} options={{
                tabBarIcon: ({ focused }) =>
                    <MoreHorizontal color={getTabColor(focused)} />
            }} />
        </Tab.Navigator>
    )
}
