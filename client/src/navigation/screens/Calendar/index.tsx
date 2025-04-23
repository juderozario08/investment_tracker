import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../../theming/ThemeProvider"
import { MonthSwitcher } from "../../../components/MonthSwitcher";
import { useState } from "react";

export const Calendar = () => {
    const { theme } = useTheme();
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const prevMonth = () => {
        const newMonth = month - 1;
        setMonth(((newMonth % 12) + 12) % 12);
    };
    const nextMonth = () => {
        const newMonth = month + 1;
        setMonth(((newMonth % 12) + 12) % 12);
    };
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <MonthSwitcher month={month} setMonth={setMonth} prevMonth={prevMonth} nextMonth={nextMonth} />
            <Text style={{ color: theme.colors.text }}>Calendar!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
});
