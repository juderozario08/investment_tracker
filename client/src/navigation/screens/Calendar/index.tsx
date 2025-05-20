import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../../theming/ThemeProvider"
import { MonthSwitcher } from "../../../components/MonthSwitcher";
import { useState } from "react";
import { TopMenu } from "../../../components/TopMenu";
import { MonthSummary } from "../../../components/MonthTotal";

export const Calendar = () => {
    const { theme } = useTheme();
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear())
    const [investing, setInvestment] = useState<number>(0);
    const [spending, setSpending] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TopMenu>
                {/* <MonthSwitcher month={month} prevMonth={prevMonth} nextMonth={nextMonth} year={year} /> */}
                <MonthSummary amounts={{ investing, income, spending }} />
            </TopMenu>
            <Text style={{ color: theme.colors.text }}>Calendar</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
    },
});
