import { Dimensions, View } from "react-native"
import { useTheme } from "../../theming"
import { SafeAreaView } from "react-native-safe-area-context";
import { TopMenu } from "../../components/TopMenu";
import { MonthTotal } from "../../components/MonthTotal";
import { useEffect, useState } from "react";
import { MonthSwitcher } from "../../components/MonthSwitcher";
import { useDateContext } from "../../context/DateContext";
import { Text } from "react-native";
import { FadingPressable } from "../../components/FadingPressable";
import { useDataContext } from "../../context/DataContext";
import { Theme } from "../../theming/types";
import { TransactionDataType } from "../../library/types";
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { Days } from "../../library/constants";
import { GestureView } from "../../components/Views/GestureView";
import { springConfig } from "../../library/animationConfigs";
import { X } from "react-native-feather";
import { ScrollView } from "react-native-gesture-handler";

type AmountsType = {
    investments: number;
    income: number;
    spending: number;
}

export const Calendar = () => {
    const theme = useTheme();

    const { date, nextMonth, prevMonth } = useDateContext();
    const { groupedByDate } = useDataContext();

    const [dates, setDates] = useState<number[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(date);
    const [transactionsOfSelectedDate, setTransactionsOfSelectedDate] = useState<TransactionDataType[]>([]);
    const [amounts, setAmounts] = useState<AmountsType[]>([]);
    const [visible, setVisible] = useState<boolean>(false);

    const setDailyAmounts = () => {
        const result = Array.from({ length: dates.length }, () => {
            const d: AmountsType = {
                investments: 0,
                income: 0,
                spending: 0
            }
            return d;
        })

        for (const s of groupedByDate.keys()) {
            const d = new Date(s);
            if (date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear()) {
                const index = d.getDate() - 1;
                const newValuesList = groupedByDate.get(s);
                newValuesList?.forEach((val) => {
                    if (val.category === 'spending') {
                        result[index].spending += Number(val.amount);
                    } else if (val.category === 'income') {
                        result[index].income += Number(val.amount);
                    } else if (val.category === 'investing') {
                        result[index].investments += Number(val.amount);
                    }
                });
            }
        }
        setAmounts(result);
    }

    useEffect(() => {
        const dateArr = Array.from(
            { length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() },
            (_, i) => i)
        setDates(dateArr);
    }, [date]);

    useEffect(() => {
        if (dates.length !== 0) {
            setDailyAmounts();
        }
    }, [dates, groupedByDate]);

    return (
        <SafeAreaView style={{ flex: 1, marginBottom: -35, backgroundColor: theme.colors.background }}>
            {/* Tob Bar */}
            <TopMenu>
                <MonthSwitcher />
                <MonthTotal />
            </TopMenu>
            <GestureView onLeftSwipe={nextMonth} onRightSwipe={prevMonth}>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {amounts.map((val, idx) => (
                        <DailyReportBox
                            key={idx}
                            theme={theme}
                            setVisible={setVisible}
                            date={date}
                            idx={idx}
                            amount={val}
                            setSelectedDate={setSelectedDate}
                            rows={dates.length === 31 ? 6 : 5} />
                    ))}
                </View>
            </GestureView>
            <TransactionsFromSelectedDate
                visible={visible}
                setVisible={setVisible}
                selectedDate={selectedDate}
                theme={theme} />
        </SafeAreaView>
    )
}

const TransactionsFromSelectedDate: React.FC<{
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDate: Date;
    theme: Theme;
}> = ({ visible, setVisible, selectedDate, theme }) => {

    {/* Slide Animation */ }
    const ANIMATION_DURATION = 300;
    const translateY = useSharedValue<number | `${number}%`>(100);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));
    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(-35, { duration: ANIMATION_DURATION });
        }
    }, [visible]);

    {/* Transactions based on Date */ }
    const { groupedByDate } = useDataContext();
    const [transactions, setTransactions] = useState<TransactionDataType[]>([]);

    useEffect(() => {
        setTransactions(groupedByDate.get(selectedDate.toString()) ?? []);
    }, [selectedDate, groupedByDate])

    return (
        <Animated.View style={[
            {
                backgroundColor: theme.colors.muted,
                display: visible ? "flex" : "none",
                position: "absolute",
                width: "100%",
                bottom: 0,
                borderTopRightRadius: 12,
                borderTopLeftRadius: 12,
                padding: 16,
                paddingBottom: 30,
                zIndex: 1000,
                elevation: 5,
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 10,
            },
            animatedStyle
        ]}>
            <View style={{ flexDirection: "row-reverse", marginBottom: 15 }}>
                <FadingPressable onPress={() => {
                    translateY.value = withTiming(100, { duration: 200 });
                    setTimeout(() => {
                        setVisible(false);
                    }, ANIMATION_DURATION);
                }}>
                    <X color={'grey'} width={20} style={{ padding: 5 }} />
                </FadingPressable>
            </View>
            {
                transactions.length === 0 ?
                    (<Text style={{ color: theme.colors.text, textAlign: "center" }}>No Transactions were recorded this day!</Text>)
                    : (<TransactionsView theme={theme} transactions={transactions} />)
            }
        </Animated.View>
    );
};

const TransactionsView: React.FC<{
    theme: Theme;
    transactions: TransactionDataType[];
}> = ({ theme, transactions }) => {
    const screenWidth = Dimensions.get("window").width;
    return (
        <ScrollView>
            {
                transactions.map((val, idx) => (
                    <View key={idx} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ color: theme.colors.text, width: screenWidth / 4 }}>{val.name}</Text>
                            <Text style={{ color: theme.colors.text, width: screenWidth / 4 }}>{val.tag}</Text>
                        </View>
                        <Text style={{
                            color: val.category === "spending"
                                ? theme.colors.spending : val.category === "income"
                                    ? theme.colors.income : theme.colors.investment
                        }}>${val.amount}</Text>
                    </View>
                ))
            }
        </ScrollView>
    )
}

const DailyReportBox: React.FC<{
    theme: Theme;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    date: Date;
    idx: number;
    amount: AmountsType;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
    rows: number;
}> = ({ theme, setVisible, date, idx, amount, setSelectedDate, rows }) => {

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height - 257;
    const scale = useSharedValue<number>(0);
    const animatedStyle = useAnimatedStyle(() => {
        'worklet'
        return {
            transform: [
                { scale: scale.value },
            ]
        }
    });

    useEffect(() => {
        scale.value = 0;
        const delay = idx * 10;
        const timeout = setTimeout(() => {
            scale.value = withSpring(1, springConfig);
        }, delay);
        return () => clearTimeout(timeout);
    }, [date]);

    const isCurrentDate = (idx: number): boolean => {
        const b = date.getMonth() === new Date().getMonth()
            && date.getFullYear() === new Date().getFullYear()
            && date.getDate() === (idx + 1);
        return b;
    }

    return (
        <Animated.View style={[animatedStyle]}>
            <FadingPressable
                style={[{
                    width: screenWidth / 6,
                    height: screenHeight / rows,
                    borderColor: isCurrentDate(idx) ? theme.colors.accent : 'gray',
                    borderWidth: 1.5,
                    backgroundColor: theme.colors.background,
                }]}
                onPress={() => {
                    setVisible(true);
                    setSelectedDate(new Date(date.getFullYear(), date.getMonth(), idx + 1, 0, 0, 0));
                }}
            >
                <View style={{
                    flexDirection: "row",
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    borderBottomWidth: 1.5,
                    backgroundColor: theme.colors.muted,
                    borderColor: isCurrentDate(idx) ? theme.colors.accent : 'transparent',
                }}>
                    <Text style={{ color: theme.colors.text }}>{idx + 1}</Text>
                    <Text style={{ color: theme.colors.text, paddingLeft: 5 }}>{Days[new Date(date.getFullYear(), date.getMonth(), idx + 1).getDay()]}</Text>
                </View>
                <View style={{
                    marginVertical: "auto"
                }}>
                    <Text style={{ color: theme.colors.investment, textAlign: "center" }}>${amount.investments}</Text>
                    <Text style={{ color: theme.colors.income, textAlign: "center" }}>${amount.income}</Text>
                    <Text style={{ color: theme.colors.spending, textAlign: "center" }}>${amount.spending}</Text>
                </View>
            </FadingPressable>
        </Animated.View>
    )
}
