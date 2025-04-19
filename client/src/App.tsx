import * as React from 'react';
import { BottomTab } from './navigation';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './theming/ThemeProvider';
import { Platform, StatusBar } from 'react-native';

export function App() {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <BottomTab />
            </NavigationContainer>
            {Platform.OS !== 'web' ? <StatusBar /> : null}
        </ThemeProvider>
    );
}
