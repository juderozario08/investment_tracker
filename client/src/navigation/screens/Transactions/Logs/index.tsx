import { StyleSheet, View } from "react-native"
import { useTheme } from "../../../../theming/ThemeProvider"
import { MonthSwitcher } from "../../../../components/MonthSwitcher";
import { useEffect, useState } from "react";
import { TopMenu } from "../../../../components/TopMenu";
import { DailyCard } from "../../../../components/DailyCard";
import { TransactionDateType } from "../../../..";
import { ScrollView } from "react-native-gesture-handler";
import { MonthTotal } from "../../../../components/MonthTotal";

const data: TransactionDateType[] = [
    {
        category: 'spending',
        transactionType: 'Food',
        name: 'Eats',
        amount: 10,
        date: new Date('2025-04-25')
    },
    {
        category: 'income',
        transactionType: 'Salary',
        name: 'PHRI',
        amount: 1000,
        date: new Date('2025-04-25')
    },
    {
        category: 'spending',
        transactionType: 'Household',
        name: 'Metro',
        amount: 50,
        date: new Date('2025-04-25')
    },
    {
        category: 'investment',
        transactionType: 'ETF',
        name: 'VFV',
        amount: 100,
        date: new Date('2025-04-25')
    },
    {
        category: 'spending',
        transactionType: 'Entertainment',
        name: 'Netflix',
        amount: 15.99,
        date: new Date('2025-03-15')
    },
    {
        category: 'income',
        transactionType: 'Freelance',
        name: 'Upwork',
        amount: 250,
        date: new Date('2025-04-05')
    },
    {
        category: 'spending',
        transactionType: 'Transport',
        name: 'Presto',
        amount: 30,
        date: new Date('2025-04-10')
    },
    {
        category: 'investment',
        transactionType: 'Crypto',
        name: 'Bitcoin',
        amount: 200,
        date: new Date('2025-02-20')
    },
    {
        category: 'spending',
        transactionType: 'Food',
        name: 'Tim Hortons',
        amount: 8.5,
        date: new Date('2025-04-02')
    },
    {
        category: 'income',
        transactionType: 'Gift',
        name: 'Parents',
        amount: 100,
        date: new Date('2025-01-01')
    },
    {
        category: 'spending',
        transactionType: 'Utilities',
        name: 'Hydro',
        amount: 60,
        date: new Date('2025-03-22')
    },
    {
        category: 'investment',
        transactionType: 'Stocks',
        name: 'TSLA',
        amount: 150,
        date: new Date('2025-04-18')
    }
]

const groupByDate = (): Map<Date, TransactionDateType[]> => {
    const map = new Map<string, { key: Date; items: TransactionDateType[] }>();
    for (const tx of data) {
        const year = tx.date.getUTCFullYear();
        const month = tx.date.getUTCMonth();
        const day = tx.date.getUTCDate();

        const normalizedKey = `${year}-${month}-${day}`;

        if (!map.has(normalizedKey)) {
            map.set(normalizedKey, { key: new Date(year, month, day), items: [] });
        }
        map.get(normalizedKey)!.items.push(tx);
    }
    const result = new Map<Date, TransactionDateType[]>();
    for (const { key, items } of map.values()) {
        result.set(key, items);
    }
    return result;
}

const groupedByDate = groupByDate();
const sortedDateArray = Array.from(groupedByDate.keys()).sort((a, b) => b.getTime() - a.getTime());

// This will be the Material top navigator
export const Logs = () => {
    const { theme } = useTheme();
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [investing, setInvestment] = useState<number>(0);
    const [spending, setSpending] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);

    const prevMonth = () => {
        const newMonth = month - 1;
        if (newMonth < 0) {
            setYear(year - 1);
        }
        setMonth(((newMonth % 12) + 12) % 12);
    };
    const nextMonth = () => {
        const newMonth = month + 1;
        if (newMonth > 11) {
            setYear(year + 1);
        }
        setMonth(((newMonth % 12) + 12) % 12);
    };

    const setAmounts = () => {
        let totalInvestment = 0;
        let totalSpending = 0;
        let totalIncome = 0;
        for (const d of sortedDateArray) {
            if (d.getMonth() === month && d.getFullYear() === year) {
                const transactions = groupedByDate.get(d);
                if (transactions) {
                    for (const t of transactions) {
                        if (t.category === 'spending') totalSpending += t.amount;
                        else if (t.category === 'investment') totalInvestment += t.amount;
                        else totalIncome += t.amount;
                    }
                }
            }
        }
        setSpending(totalSpending);
        setInvestment(totalInvestment);
        setIncome(totalIncome);
    };

    useEffect(() => {
        setAmounts();
    }, [month, year])

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <TopMenu>
                <MonthSwitcher month={month} prevMonth={prevMonth} nextMonth={nextMonth} year={year} />
                <MonthTotal amounts={{ investing, income, spending }} />
            </TopMenu>
            <ScrollView style={[styles.logContainer]}>
                {
                    sortedDateArray.map((val, idx) => {
                        return val.getMonth() === month && val.getFullYear() === year ? (
                            <DailyCard key={idx} transactions={groupedByDate.get(val) || []} date={val} />
                        ) : null
                    })
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logContainer: {
        padding: 10
    }
})
