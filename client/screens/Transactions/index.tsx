import { useEffect, useRef, useState } from 'react';
import { TransactionDataType } from '../../library/types';
import { styles } from './styles'
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../theming';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionModal } from '../../components/TransactionModal';
import { PlusCircle } from 'react-native-feather';
import { GestureScrollView } from '../../components/Views/GestureScrollView';
import { DailyCard } from '../../components/DailyCard';
import { MonthSummary } from '../../components/MonthTotal';
import { TopMenu } from '../../components/TopMenu';
import { MonthSwitcher } from '../../components/MonthSwitcher';
import { useDataContext } from '../../context/DataContext';
import { getDefaultTransactionValue } from '../../library/constants';
import { useDateContext } from '../../context/DateContext';

// Organizing all the data to group by date
const groupByDate = (data: TransactionDataType[]): Map<Date, TransactionDataType[]> => {
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

export const Transactions = () => {
    const theme = useTheme();

    const { data, addTransaction } = useDataContext();

    const { date, setDate, prevMonth, nextMonth } = useDateContext()

    const [investing, setInvestment] = useState<number>(0);
    const [spending, setSpending] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [groupedByDate, setGroupedByDate] = useState(new Map<Date, TransactionDataType[]>());
    const [sortedDateArray, setSortedDateArray] = useState<Date[]>([]);

    const [details, setDetails] = useState<TransactionDataType>(getDefaultTransactionValue());

    const setAmounts = () => {
        let totalInvestment = 0;
        let totalSpending = 0;
        let totalIncome = 0;
        for (const d of sortedDateArray) {
            if (d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()) {
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
        const grouped = groupByDate(data);
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
    }, [date, groupedByDate]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Tob Bar */}
            <TopMenu>
                <MonthSwitcher />
                <MonthSummary amounts={{ investing, income, spending }} />
            </TopMenu>

            {/* Daily Transaction Cards Per Month */}
            <GestureScrollView onLeftSwipe={nextMonth} onRightSwipe={prevMonth}>
                {sortedDateArray.map((val, idx) => {
                    return val.getMonth() === date.getMonth() && val.getFullYear() === date.getFullYear() ? (
                        <DailyCard
                            key={idx}
                            transactions={groupedByDate.get(val) || []}
                            date={val}
                        />
                    ) : null;
                })}
            </GestureScrollView>

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
                isVisibleState={[isVisible, setIsVisible]}
                detailsState={[details, setDetails]}
                onSubmit={() => {
                    addTransaction(details);
                    setDetails(getDefaultTransactionValue());
                    setIsVisible(false);
                }} />
        </SafeAreaView>
    )
}
