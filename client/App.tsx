import { StatusBar, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./AppNavigator";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

const App = () => {
    return (
        <PaperProvider theme={useColorScheme() === 'dark' ? MD3DarkTheme : MD3LightTheme}>
            <NavigationContainer>
                <AppNavigator />
            </NavigationContainer>
            <StatusBar />
        </PaperProvider>
    )
}

export default App;
