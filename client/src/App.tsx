import { useEffect } from 'react';
import { BottomTab } from './navigation';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './theming/ThemeProvider';
import { Platform, StatusBar } from 'react-native';

export function App() {
    useEffect(() => {
        //let socket: Socket;
        //socket = io("http://localhost:8080")
        //socket.on("message", (msg: string) => {
        //    console.log("Received message:", msg);
        //});
        //socket.emit("message", "Hello from client!");
    }, [])
    return (
        <ThemeProvider>
            <NavigationContainer>
                <BottomTab />
            </NavigationContainer>
            {Platform.OS !== 'web' ? <StatusBar /> : null}
        </ThemeProvider>
    );
}
