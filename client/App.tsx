import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./AppNavigator";
import { DataProvider } from "./context/DataContext";
import { DateProvider } from "./context/DateContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
    return (
        <DateProvider>
            <DataProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <NavigationContainer>
                        <AppNavigator />
                        <StatusBar />
                    </NavigationContainer>
                </GestureHandlerRootView>
            </DataProvider>
        </DateProvider>
    )
}

export default App;
