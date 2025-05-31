import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./AppNavigator";
import { DataProvider } from "./context/DataContext";
import { DateProvider } from "./context/DateContext";

const App = () => {
    return (
        <NavigationContainer>
            <DataProvider>
                <DateProvider>
                    <AppNavigator />
                    <StatusBar />
                </DateProvider>
            </DataProvider>
        </NavigationContainer>
    )
}

export default App;
