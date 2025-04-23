import { StyleSheet, View } from "react-native"
import { useTheme } from "../../../../theming/ThemeProvider"
import { MonthSwitcher } from "../../../../components/MonthSwitcher";
import { useState } from "react";
import { TopMenu } from "../../../../components/TopMenu";
import { DailyCard } from "../../../../components/DailyCard";
import { TransactionDateType } from "../../../..";

const data: TransactionDateType[] = [
    {
        category: 'spending',
        transactionType: 'Food',
        name: 'Eats',
        amount: 10,
        date: new Date()
    },
    {
        category: 'income',
        transactionType: 'Salary',
        name: 'PHRI',
        amount: 1000,
        date: new Date()
    },
    {
        category: 'spending',
        transactionType: 'Household',
        name: 'Metro',
        amount: 50,
        date: new Date()
    },
    {
        category: 'investment',
        transactionType: 'ETF',
        name: 'VFV',
        amount: 100,
        date: new Date()
    },
]

// This will be the Material top navigator
export const Logs = () => {
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
            <TopMenu>
                <MonthSwitcher month={month} setMonth={setMonth} prevMonth={prevMonth} nextMonth={nextMonth} />
            </TopMenu>
            <View style={[styles.logContainer]}>
                <DailyCard transactions={data} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    logContainer: {
        padding: 10
    }
})
