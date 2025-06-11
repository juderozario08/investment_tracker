import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Daily } from './screens/Daily';
import { Monthly } from './screens/Monthly';
import { YTD } from './screens/YTD';
import { Yearly } from './screens/Yearly';
import { enableScreens } from 'react-native-screens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theming';

enableScreens();

const TopTab = createMaterialTopTabNavigator();

export const Statistics = () => {
    const theme = useTheme();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <TopTab.Navigator initialRouteName='Daily' screenOptions={{
                tabBarStyle: { backgroundColor: theme.colors.tabBarBackground },
                tabBarActiveTintColor: String(theme.colors.tabBarActive),
                tabBarInactiveTintColor: String(theme.colors.tabBarInactive)
            }}>
                <TopTab.Screen name='Daily' component={Daily} />
                <TopTab.Screen name='Monthly' component={Monthly} />
                <TopTab.Screen name='YTD' component={YTD} />
                <TopTab.Screen name='Yearly' component={Yearly} />
            </TopTab.Navigator>
        </SafeAreaView>
    );
};
