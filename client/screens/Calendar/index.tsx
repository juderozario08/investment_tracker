import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../../theming"
import { SafeAreaView } from "react-native-safe-area-context";
import { TopMenu } from "../../components/TopMenu";
import { MonthSummary } from "../../components/MonthTotal";
import { useState } from "react";
import { MonthSwitcher } from "../../components/MonthSwitcher";

export const Calendar = () => {
    const theme = useTheme();

    const [dateState, setDateState] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    })

    const [investing, setInvestment] = useState<number>(0);
    const [spending, setSpending] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);

    const prevMonth = () => {
        setDateState(({ month, year }) => {
            let newMonth = month - 1;
            let newYear = year;

            if (newMonth < 0) {
                newMonth = 11;
                newYear -= 1;
            }

            return { month: newMonth, year: newYear };
        });
    };

    const nextMonth = () => {
        const currentDate = new Date();

        setDateState(({ month, year }) => {
            let newMonth = month + 1;
            let newYear = year;

            if (newMonth > 11) {
                newMonth = 0;
                newYear += 1;
            }

            const newDate = new Date(newYear, newMonth);
            if (newDate <= currentDate) {
                return { month: newMonth, year: newYear };
            }

            return { month, year };
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Tob Bar */}
            <TopMenu>
                <MonthSwitcher
                    dateState={dateState}
                    prevMonth={prevMonth}
                    nextMonth={nextMonth}
                />
                <MonthSummary amounts={{ investing, income, spending }} />
            </TopMenu>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
    },
});
