import { SafeAreaView, StyleSheet, Text, View } from "react-native"
import { useTheme } from "../../../theming"
import { useEffect } from "react";

export const Daily = () => {
    const theme = useTheme();

    useEffect(() => {
    }, []);
    return (
        <View style={[{
            backgroundColor: theme.colors.background
        }, styles.container]}>
            <View><Text>Hello</Text></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
