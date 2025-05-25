import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./AppNavigator";

const App = () => {
    return (
        <NavigationContainer>
            <AppNavigator />
            <StatusBar />
        </NavigationContainer>
    )
}

export default App;
