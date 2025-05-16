import {
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../../theming/ThemeProvider";
import { MonthSwitcher } from "../../../components/MonthSwitcher";
import { useEffect, useRef, useState } from "react";
import { TopMenu } from "../../../components/TopMenu";
import { DailyCard } from "../../../components/DailyCard";
import {
    GestureHandlerRootView,
    ScrollView,
} from "react-native-gesture-handler";
import { MonthSummary } from "../../../components/MonthTotal";
import { PlusCircle } from "react-native-feather";
import type { TransactionDataType } from "../../../library/types";
import styles from "./styles"
import { TransactionModal } from "../../../components/TransactionModal";
import { DefaultTransactionValues } from "../../../library/constants";

const data: TransactionDataType[] = [
    {
        category: "spending",
        tag: "Food",
        name: "Eats",
        amount: "10",
        date: new Date(),
    },
    {
        category: "income",
        tag: "Salary",
        name: "PHRI",
        amount: "1000",
        date: new Date(),
    },
    {
        category: "spending",
        tag: "Household",
        name: "Metro",
        amount: "50",
        date: new Date(),
    },
    {
        category: "investment",
        tag: "etf",
        name: "VFV",
        amount: "100",
        date: new Date(),
    },
    {
        category: "spending",
        tag: "Entertainment",
        name: "Netflix",
        amount: "15.99",
        date: new Date("2025-03-15"),
    },
    {
        category: "income",
        tag: "Freelance",
        name: "Upwork",
        amount: "250",
        date: new Date("2025-04-05"),
    },
    {
        category: "spending",
        tag: "Transport",
        name: "Presto",
        amount: "30",
        date: new Date("2025-04-10"),
    },
    {
        category: "investment",
        tag: "Crypto",
        name: "Bitcoin",
        amount: "200",
        date: new Date("2025-02-20"),
    },
    {
        category: "spending",
        tag: "Food",
        name: "Tim Hortons",
        amount: "8.5",
        date: new Date("2025-04-02"),
    },
    {
        category: "income",
        tag: "Gift",
        name: "Parents",
        amount: "100",
        date: new Date("2025-01-01"),
    },
    {
        category: "spending",
        tag: "Utilities",
        name: "Hydro",
        amount: "60",
        date: new Date("2025-03-22"),
    },
    {
        category: "investment",
        tag: "Stocks",
        name: "TSLA",
        amount: "150",
        date: new Date("2025-04-18"),
    },
];

// Organizing all the data to group by date
const groupByDate = (): Map<Date, TransactionDataType[]> => {
    const map = new Map<string, { key: Date; items: TransactionDataType[] }>();
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
    const result = new Map<Date, TransactionDataType[]>();
    for (const { key, items } of map.values()) {
        result.set(key, items);
    }
    return result;
};

// This will be the Material top navigator
export const Transactions = () => {
    const { theme } = useTheme();

    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [investing, setInvestment] = useState<number>(0);
    const [spending, setSpending] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [groupedByDate, setGroupedByDate] = useState(new Map<Date, TransactionDataType[]>());
    const [sortedDateArray, setSortedDateArray] = useState<Date[]>([]);

    const [details, setDetails] = useState<TransactionDataType>(DefaultTransactionValues);

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
                        if (t.category === "spending") totalSpending += Number(t.amount);
                        else if (t.category === "investment") totalInvestment += Number(t.amount);
                        else totalIncome += Number(t.amount);
                    }
                }
            }
        }
        setSpending(totalSpending);
        setInvestment(totalInvestment);
        setIncome(totalIncome);
    };

    const hasInitialized = useRef<boolean>(false);

    /* Setting date groups */
    useEffect(() => {
        const grouped = groupByDate();
        setGroupedByDate(grouped);

        const sorted = Array.from(grouped.keys()).sort((a, b) => b.getTime() - a.getTime());
        setSortedDateArray(sorted);
    }, [data]);

    /* Setting total amounts each time months or data changes */
    useEffect(() => {
        if (!hasInitialized.current) {
            if (groupedByDate.size > 0) {
                setAmounts();
                hasInitialized.current = true;
            }
        } else {
            setAmounts();
        }
    }, [month, year, groupedByDate]);

    return (
        <View
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            {/* Tob Bar */}
            <TopMenu>
                <MonthSwitcher
                    month={month}
                    prevMonth={prevMonth}
                    nextMonth={nextMonth}
                    year={year}
                />
                <MonthSummary amounts={{ investing, income, spending }} />
            </TopMenu>

            {/* Daily Transaction Cards Per Month */}
            <GestureHandlerRootView>
                <ScrollView style={{ padding: 10 }}>
                    {sortedDateArray.map((val, idx) => {
                        return val.getMonth() === month && val.getFullYear() === year ? (
                            <DailyCard
                                key={idx}
                                transactions={groupedByDate.get(val) || []}
                                date={val}
                            />
                        ) : null;
                    })}
                </ScrollView>
            </GestureHandlerRootView>

            {/* Add transaction button */}
            <TouchableOpacity
                style={{
                    position: "absolute",
                    right: 10,
                    bottom: 10,
                }}
                onPress={() => setIsVisible(true)}
            >
                <PlusCircle
                    fill={theme.colors.secondary}
                    color={theme.colors.background}
                    width={50}
                    height={50}
                />
            </TouchableOpacity>
            <TransactionModal
                theme={theme}
                isVisibleState={[isVisible, setIsVisible]}
                detailsState={[details, setDetails]}
                onSubmit={() => {
                    console.log(details);
                    setIsVisible(false);
                }} />
        </View>
    );
};
