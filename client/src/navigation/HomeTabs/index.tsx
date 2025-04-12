import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../theming/ThemeProvider';
import { History } from './screens/History';
import { Calendar } from './screens/Calendar';
import { Statistics } from './screens/Statistics';
import { Annual } from './screens/Annual';
import { More } from './screens/More';
import { BarChart, BookOpen, Calendar as CalendarIco, MoreHorizontal, PieChart } from 'react-native-feather';

const Tab = createBottomTabNavigator();

export const BottomTab = () => {
    const { theme } = useTheme();
    return (
        <Tab.Navigator screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: theme.colors.secondary },
            headerTitleStyle: { color: theme.colors.background },
            tabBarStyle: { backgroundColor: theme.colors.secondary },
            tabBarActiveTintColor: theme.colors.text,
            tabBarInactiveTintColor: theme.colors.muted,
            tabBarActiveBackgroundColor: theme.colors.muted
        }} initialRouteName='Transactions'>
            <Tab.Screen name='Transactions' component={History} options={{
                tabBarIcon: ({ focused }) =>
                    <BookOpen color={focused ? theme.colors.text : theme.colors.muted} />
            }} />
            <Tab.Screen name='Calendar' component={Calendar} options={{
                tabBarIcon: ({ focused }) =>
                    <CalendarIco color={focused ? theme.colors.text : theme.colors.muted} />
            }} />
            <Tab.Screen name='Stats' component={Statistics} options={{
                tabBarIcon: ({ focused }) =>
                    <PieChart color={focused ? theme.colors.text : theme.colors.muted} />
            }} />
            <Tab.Screen name='Annual' component={Annual} options={{
                tabBarIcon: ({ focused }) =>
                    <BarChart color={focused ? theme.colors.text : theme.colors.muted} />
            }} />
            <Tab.Screen name='More' component={More} options={{
                tabBarIcon: ({ focused }) =>
                    <MoreHorizontal color={focused ? theme.colors.text : theme.colors.muted} />
            }} />
        </Tab.Navigator>
    )
}

