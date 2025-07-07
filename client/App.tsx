import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./AppNavigator";
import { DataProvider } from "./context/DataContext";
import { DateProvider } from "./context/DateContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <DateProvider>
                <DataProvider>
                    <NavigationContainer>
                        <AppNavigator />
                        <StatusBar />
                    </NavigationContainer>
                </DataProvider>
            </DateProvider>
        </GestureHandlerRootView>
    )
}

export default App;
