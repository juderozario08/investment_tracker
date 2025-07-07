import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Daily } from './screens/Daily';
import { Monthly } from './screens/Monthly';
import { YTD } from './screens/YTD';
import { Yearly } from './screens/Yearly';
import { enableScreens } from 'react-native-screens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theming';
import { Weekly } from './screens/Weekly';
import { DataContextType, useDataContext } from '../../context/DataContext';

enableScreens();

export type TopTabParamList = {
    Daily: undefined;
    Weekly: undefined;
    Monthly: undefined;
    YTD: undefined;
    Yearly: undefined;
}

const TopTab = createMaterialTopTabNavigator<TopTabParamList>();

export const Statistics = () => {
    const theme = useTheme();
    return (
        <SafeAreaView edges={["top", "left", "right"]} style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <TopTab.Navigator initialRouteName='Daily' screenOptions={{
                tabBarStyle: { backgroundColor: theme.colors.tabBarBackground },
                tabBarActiveTintColor: String(theme.colors.tabBarActive),
                tabBarInactiveTintColor: String(theme.colors.tabBarInactive)
            }}>
                <TopTab.Screen name='Daily' component={Daily} />
                <TopTab.Screen name='Weekly' component={Weekly} />
                <TopTab.Screen name='Monthly' component={Monthly} />
                <TopTab.Screen name='YTD' component={YTD} />
                <TopTab.Screen name='Yearly' component={Yearly} />
            </TopTab.Navigator>
        </SafeAreaView>
    );
};
