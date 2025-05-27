import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./AppNavigator";
import { DataProvider } from "./context/DataContext";

const App = () => {
    return (
        <NavigationContainer>
            <DataProvider>
                <AppNavigator />
                <StatusBar />
            </DataProvider>
        </NavigationContainer>
    )
}

export default App;
