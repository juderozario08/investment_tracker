import { Dimensions, View } from "react-native"
import { useTheme } from "../../theming"
import { TopMenu } from "../../components/TopMenu";
import { useEffect, useState } from "react";
import { useDateContext } from "../../context/DateContext";
import { Text } from "react-native";
import { FadingPressable } from "../../components/FadingPressable";
import { useDataContext } from "../../context/DataContext";
import { Theme } from "../../theming/types";
import { TransactionDataType } from "../../library/types";
import Reanimated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { Days, Months, getDefaultTransactionValue } from "../../library/constants";
import { springConfig } from "../../library/animationConfigs";
import { X } from "react-native-feather";
import { ScrollView } from "react-native-gesture-handler";
import { GestureScrollView } from "../../components/Views/GestureScrollView";
import { TransactionModal } from "../../components/TransactionModal";
import { TransactionItem } from "../../components/TransactionItem";

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
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.background,
        }}>
            {/* Tob Bar */}
            <TopMenu />
            <GestureScrollView onLeftSwipe={nextMonth} onRightSwipe={prevMonth}>
                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                    {amounts.map((val, idx) => (
                        <DailyReportBox
                            key={idx}
                            theme={theme}
                            setVisible={setVisible}
                            date={date}
                            idx={idx}
                            amount={val}
                            setSelectedDate={setSelectedDate} />
                    ))}
                </View>
            </GestureScrollView>
            <TransactionsFromSelectedDate
                visible={visible}
                setVisible={setVisible}
                selectedDate={selectedDate}
                theme={theme} />
        </View>
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
    const translateY = useSharedValue<number>(500);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }]
    }));

    {/* Transactions based on Date */ }
    const { groupedByDate } = useDataContext();
    const [transactions, setTransactions] = useState<TransactionDataType[]>([]);

    const { removeTransaction, editTransaction } = useDataContext();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [details, setDetails] = useState<TransactionDataType>(
        getDefaultTransactionValue(selectedDate)
    );

    useEffect(() => {
        if (!visible) return;

        const updatedTransactions = groupedByDate.get(selectedDate.toString()) ?? [];
        const updateTransactions = () => {
            setTransactions(updatedTransactions);
        };

        translateY.value = withSequence(
            withTiming(500, { duration: ANIMATION_DURATION }, (isFinished) => {
                if (isFinished) {
                    runOnJS(updateTransactions)();
                }
            }),
            withTiming(0, { duration: ANIMATION_DURATION })
        );
    }, [selectedDate, groupedByDate])

    return (
        <Reanimated.View
            pointerEvents={visible ? 'auto' : 'none'}
            style={[
                {
                    backgroundColor: theme.colors.muted,
                    position: "absolute",
                    width: "100%",
                    bottom: 0,
                    borderTopRightRadius: 12,
                    borderTopLeftRadius: 12,
                    padding: 16,
                    paddingBottom: 30,
                    zIndex: 1000,
                    elevation: 5,
                    shadowColor: "#fff",
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    maxHeight: "50%"
                },
                animatedStyle
            ]}>
            <View style={{ flexDirection: "row-reverse" }}>
                <FadingPressable onPress={() => {
                    translateY.value = withTiming(500, { duration: 200 });
                    setTimeout(() => {
                        setVisible(false);
                    }, ANIMATION_DURATION);
                }}>
                    <X color={'grey'} width={20} style={{ padding: 5 }} />
                </FadingPressable>
            </View>
            {
                transactions.length === 0 ?
                    <View style={{
                        backgroundColor: theme.colors.background,
                        borderRadius: 10,
                        padding: 10,
                        marginTop: 10
                    }}>
                        <Text style={{
                            textAlign: "center",
                            color: theme.colors.text,
                            fontSize: 16,
                        }}>No Transactions were recorded this day!</Text>
                    </View>
                    : <View>
                        <View style={{ paddingBottom: 20 }}>
                            <Text style={{
                                textAlign: "center",
                                color: theme.colors.text,
                                fontSize: 16,
                                fontWeight: "bold",
                            }}>Transactions for {Months[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}</Text>
                        </View>
                        <ScrollView style={{
                            backgroundColor: theme.colors.background,
                            borderRadius: 10,
                            padding: 10,
                            gap: 10,
                        }}>
                            {
                                transactions.map((val, _) => (
                                    <TransactionItem
                                        key={val.id}
                                        setDetails={setDetails}
                                        setIsVisible={setIsVisible}
                                        transaction={val}
                                        removeTransaction={removeTransaction}
                                        theme={theme} />
                                ))
                            }
                            <TransactionModal
                                isVisibleState={[isVisible, setIsVisible]}
                                detailsState={[details, setDetails]}
                                onSubmit={() => {
                                    editTransaction(details);
                                    setIsVisible(false);
                                }} />
                        </ScrollView>
                    </View>
            }
        </Reanimated.View>
    );
};

const DailyReportBox: React.FC<{
    theme: Theme;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    date: Date;
    idx: number;
    amount: AmountsType;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}> = ({ theme, setVisible, date, idx, amount, setSelectedDate }) => {

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
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
        scale.value = withDelay(idx * 10, withSpring(1, springConfig));
    }, [date]);

    const isCurrentDate = (idx: number): boolean => {
        const b = date.getMonth() === new Date().getMonth()
            && date.getFullYear() === new Date().getFullYear()
            && date.getDate() === (idx + 1);
        return b;
    }

    return (
        <Reanimated.View style={[animatedStyle]}>
            <FadingPressable
                style={[{
                    width: screenWidth / 6,
                    height: screenHeight / 6,
                    borderColor: isCurrentDate(idx) ? theme.colors.accent : 'gray',
                    borderWidth: 1.5,
                    backgroundColor: theme.colors.background,
                }]}
                onPress={() => {
                    setSelectedDate((prev) => {
                        const newDate = new Date(date.getFullYear(), date.getMonth(), idx + 1, 0, 0, 0);
                        if (prev.toString() === newDate.toString()) {
                            return prev;
                        }
                        return newDate;
                    });
                    setVisible(true);
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
        </Reanimated.View>
    )
}
