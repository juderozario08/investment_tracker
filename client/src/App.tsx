import * as React from 'react';
import { BottomTab } from './navigation/HomeTabs';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './theming/ThemeProvider';

export function App() {
    return (
        <ThemeProvider>
            <NavigationContainer>
                <BottomTab />
            </NavigationContainer>
        </ThemeProvider>
    );
}
