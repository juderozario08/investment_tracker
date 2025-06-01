import { StyleSheet } from "react-native"
import { useTheme } from "../../theming"
import { SafeAreaView } from "react-native-safe-area-context";
import { TopMenu } from "../../components/TopMenu";
import { MonthSummary } from "../../components/MonthTotal";
import { useEffect, useState } from "react";
import { MonthSwitcher } from "../../components/MonthSwitcher";
import { useDateContext } from "../../context/DateContext";

export const Calendar = () => {
    const theme = useTheme();

    const { date, setDate, prevMonth, nextMonth } = useDateContext();
    const [numOfDates, setNumOfDates] = useState<number>(0);

    useEffect(() => {
        setNumOfDates(new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate());
        console.log(numOfDates);
    }, [date]);

    const [investing, setInvestment] = useState<number>(0);
    const [spending, setSpending] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Tob Bar */}
            <TopMenu>
                <MonthSwitcher />
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
