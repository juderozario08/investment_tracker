import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theming/ThemeProvider';
import { Transactions } from './screens/Transactions';
import { Calendar } from './screens/Calendar';
import { Statistics } from './screens/Statistics';
import { Annual } from './screens/Annual';
import { Options } from './screens/Options';
import { BarChart, BookOpen, Calendar as CalendarIco, MoreHorizontal, PieChart } from 'react-native-feather';

const Tab = createBottomTabNavigator();

export const BottomTab = () => {
    const { theme } = useTheme();
    const getTabColor = (focused: boolean) =>
        focused ? theme.colors.tabBarActive : theme.colors.tabBarInactive
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: theme.colors.tabBarBackground },
            tabBarActiveTintColor: String(theme.colors.tabBarActive),
            tabBarInactiveTintColor: String(theme.colors.tabBarInactive),
        }} initialRouteName='Transactions'>
            <Tab.Screen name='Transactions' component={Transactions} options={{
                tabBarIcon: ({ focused }) =>
                    <BookOpen color={getTabColor(focused)} />
            }} />
            <Tab.Screen name='Calendar' component={Calendar} options={{
                tabBarIcon: ({ focused }) =>
                    <CalendarIco color={getTabColor(focused)} />
            }} />
            <Tab.Screen name='Annual' component={Annual} options={{
                tabBarIcon: ({ focused }) =>
                    <BarChart color={getTabColor(focused)} />
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

