import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./AppNavigator";
import { DataProvider } from "./context/DataContext";
import { DateProvider } from "./context/DateContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <NavigationContainer>
                <DateProvider>
                    <DataProvider>
                        <AppNavigator />
                        <StatusBar />
                    </DataProvider>
                </DateProvider>
            </NavigationContainer>
        </GestureHandlerRootView>
    )
}

export default App;
