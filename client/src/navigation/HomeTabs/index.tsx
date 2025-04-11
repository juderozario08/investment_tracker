import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../theming/ThemeProvider';
import { History } from './screens/History';
import { Calendar } from './screens/Calendar';
import { Statistics } from './screens/Statistics';
import { Annual } from './screens/Annual';
import { Export } from './screens/Export';

const Tab = createBottomTabNavigator();

export const BottomTab = () => {
    const { theme } = useTheme();
    return (
        <Tab.Navigator screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: theme.colors.secondary
            },
            headerTitleStyle: {
                color: theme.colors.background
            },
            tabBarStyle: {
                backgroundColor: theme.colors.secondary
            },
            tabBarLabelStyle: {
                color: theme.colors.background
            },
        }}>
            <Tab.Screen name='History' component={History} />
            <Tab.Screen name='Calendar' component={Calendar} />
            <Tab.Screen name='Stats' component={Statistics} />
            <Tab.Screen name='Annual' component={Annual} />
            <Tab.Screen name='Export' component={Export} />
        </Tab.Navigator>
    )
}

