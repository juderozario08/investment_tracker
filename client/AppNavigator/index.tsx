import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theming';
import { Transactions } from '../screens/Transactions';
import { enableScreens } from 'react-native-screens';
import { BookOpen, MoreHorizontal, PieChart, Calendar as CalendarIcon } from 'react-native-feather';
import { Calendar } from '../screens/Calendar';
import { Statistics } from '../screens/Statistics';
import { Options } from '../screens/Options';
import { ColorValue } from 'react-native/types';
import { SvgProps } from 'react-native-svg';

enableScreens();

type RootNavList = {
    Transactions: undefined;
    Calendar: undefined;
    Statistics: undefined;
    More: undefined;
}

const Tab = createBottomTabNavigator<RootNavList>();

const getTabColor = (Icon: (props: SvgProps) => React.JSX.Element, color: ColorValue) => <Icon color={color} />;

export const AppNavigator = () => {
    const theme = useTheme();

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: theme.colors.tabBarBackground },
            tabBarActiveTintColor: String(theme.colors.tabBarActive),
            tabBarInactiveTintColor: String(theme.colors.tabBarInactive),
        }} initialRouteName="Statistics">
            <Tab.Screen name={'Transactions'} component={Transactions} options={{
                tabBarIcon: ({ focused }) => getTabColor(BookOpen, focused ? theme.colors.tabBarActive : theme.colors.tabBarInactive),
            }} />
            <Tab.Screen name={'Calendar'} component={Calendar} options={{
                tabBarIcon: ({ focused }) => getTabColor(CalendarIcon, focused ? theme.colors.tabBarActive : theme.colors.tabBarInactive),
            }} />
            <Tab.Screen name={'Statistics'} component={Statistics} options={{
                tabBarIcon: ({ focused }) => getTabColor(PieChart, focused ? theme.colors.tabBarActive : theme.colors.tabBarInactive),
            }} />
            <Tab.Screen name={'More'} component={Options} options={{
                tabBarIcon: ({ focused }) => getTabColor(MoreHorizontal, focused ? theme.colors.tabBarActive : theme.colors.tabBarInactive),
            }} />
        </Tab.Navigator>
    );
};
