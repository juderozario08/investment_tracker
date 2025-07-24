/* eslint-disable react-native/no-inline-styles */
import { ColorValue, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { DataProvider } from './context/DataContext';
import { DateProvider } from './context/DateContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import { SvgProps } from 'react-native-svg';
import { useTheme } from './theming';
import { Transactions } from './screens/Transactions';
import { Calendar } from './screens/Calendar';
import { BookOpen, Calendar as CalendarIcon, MoreHorizontal, PieChart } from 'react-native-feather';
import { Statistics } from './screens/Statistics';
import { Options } from './screens/Options';

enableScreens();

type RootNavList = {
    Transactions: undefined;
    Calendar: undefined;
    Statistics: undefined;
    More: undefined;
}

const Tab = createBottomTabNavigator<RootNavList>();

const getTabColor = (Icon: (props: SvgProps) => React.JSX.Element, color: ColorValue) => <Icon color={color} />;

const App = () => {
    const theme = useTheme();

    return (
        <DateProvider>
            <DataProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <NavigationContainer>
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
                        <StatusBar />
                    </NavigationContainer>
                </GestureHandlerRootView>
            </DataProvider>
        </DateProvider>
    );
};

export default App;
