import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Logs } from "./Logs";

const Stack = createNativeStackNavigator();

export const Transactions = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false
        }}>
            <Stack.Screen name="Logs" component={Logs} />
        </Stack.Navigator>
    )
}
