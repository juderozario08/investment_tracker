/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { Dimensions, View } from 'react-native';
import { useTheme } from '../../theming';
import { TopMenu } from '../../components/TopMenu';
import { useEffect, useState } from 'react';
import { useDateContext } from '../../context/DateContext';
import { Text } from 'react-native';
import { FadingPressable } from '../../components/FadingPressable';
import { useDataContext } from '../../context/DataContext';
import { TransactionDataType } from '../../library/types';
import { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { Days, Months, getDefaultTransactionValue } from '../../library/constants';
import { FAST_SPRING_ANIMATION_DURATION, STANDARD_ANIMATION_DURATION, getSpringConfig } from '../../library/animationConfigs';
import { X } from 'react-native-feather';
import { ScrollView } from 'react-native-gesture-handler';
import { GestureScrollView } from '../../components/Views/GestureScrollView';
import { TransactionModal } from '../../components/TransactionModal';
import { TransactionItem } from '../../components/TransactionItem';
import { MonthSwitcher } from '../../components/MonthSwitcher';
import { MonthTotal } from '../../components/MonthTotal';
import { ThemedText } from '../../components/ThemedText';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedView = Animated.createAnimatedComponent(View);

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
                spending: 0,
            };
            return d;
        });

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
    };

    useEffect(() => {
        const dateArr = Array.from(
            { length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() },
            (_, i) => i);
        setDates(dateArr);
    }, [date]);

    useEffect(() => {
        if (dates.length !== 0) {
            setDailyAmounts();
        }
    }, [dates, groupedByDate]);

    return (
        <SafeAreaView edges={['top']}
            style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Tob Bar */}
            <TopMenu>
                <MonthSwitcher />
                <MonthTotal />
            </TopMenu>

            <GestureScrollView onLeftSwipe={nextMonth} onRightSwipe={prevMonth}>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}>
                    {amounts.map((val, idx) => (
                        <DailyReportBox
                            key={idx}
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
                selectedDate={selectedDate} />
        </SafeAreaView>
    );
};

const TransactionsFromSelectedDate: React.FC<{
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDate: Date;
}> = ({ visible, setVisible, selectedDate }) => {
    const theme = useTheme();

    // Slide Animation
    const screenHeight = Dimensions.get('screen').height;
    const translateY = useSharedValue<number>(screenHeight);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    // Transactions based on Date
    const { groupedByDate } = useDataContext();
    const [transactions, setTransactions] = useState<TransactionDataType[]>([]);

    const { removeTransaction, editTransaction } = useDataContext();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [details, setDetails] = useState<TransactionDataType>(
        getDefaultTransactionValue(selectedDate)
    );

    const { date } = useDateContext();

    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(screenHeight, { duration: STANDARD_ANIMATION_DURATION });
        }
    }, [date]);

    useEffect(() => {
        if (!visible) { return; }

        const updatedTransactions = groupedByDate.get(selectedDate.toISOString()) ?? [];
        const updateTransactions = () => {
            setTransactions(updatedTransactions);
        };

        translateY.value = withSequence(
            withTiming(screenHeight, { duration: STANDARD_ANIMATION_DURATION }, (isFinished) => {
                if (isFinished) {
                    runOnJS(updateTransactions)();
                }
            }),
            withTiming(0, { duration: STANDARD_ANIMATION_DURATION })
        );
    }, [selectedDate, groupedByDate]);

    return (
        <AnimatedView
            pointerEvents={visible ? 'auto' : 'none'}
            style={[
                {
                    backgroundColor: theme.colors.muted,
                    position: 'absolute',
                    width: '100%',
                    bottom: 0,
                    borderTopRightRadius: 12,
                    borderTopLeftRadius: 12,
                    padding: 16,
                    paddingBottom: 30,
                    zIndex: 1000,
                    elevation: 5,
                    shadowColor: '#fff',
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    maxHeight: '50%',
                },
                animatedStyle,
            ]}>
            <View style={{ flexDirection: 'row-reverse' }}>
                <FadingPressable onPress={() => {
                    translateY.value = withTiming(500, { duration: STANDARD_ANIMATION_DURATION }, () => {
                        'worklet';
                        runOnJS(setVisible)(false);
                    });
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
                        marginTop: 10,
                    }}>
                        <ThemedText style={{
                            textAlign: 'center',
                            fontSize: 16,
                        }}>No Transactions were recorded this day!</ThemedText>
                    </View>
                    : <View>
                        <View style={{ paddingBottom: 20 }}>
                            <ThemedText style={{
                                textAlign: 'center',
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}>Transactions for {Months[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}</ThemedText>
                        </View>
                        <ScrollView style={{
                            backgroundColor: theme.colors.background,
                            borderRadius: 10,
                            padding: 10,
                            gap: 10,
                        }}>
                            {
                                transactions.map((val) => (
                                    <TransactionItem
                                        key={val.id}
                                        setDetails={setDetails}
                                        setIsVisible={setIsVisible}
                                        transaction={val}
                                        removeTransaction={removeTransaction} />
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
        </AnimatedView>
    );
};

const DailyReportBox: React.FC<{
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    date: Date;
    idx: number;
    amount: AmountsType;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}> = ({ setVisible, date, idx, amount, setSelectedDate }) => {
    const theme = useTheme();

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const scale = useSharedValue<number>(0);
    const animatedStyle = useAnimatedStyle(() => {
        'worklet';
        return {
            transform: [
                { scale: scale.value },
            ],
        };
    });

    useEffect(() => {
        scale.value = 0;
        scale.value = withDelay(idx * 10, withSpring(1, getSpringConfig(FAST_SPRING_ANIMATION_DURATION)));
    }, [date]);

    const isCurrentDate = (index: number): boolean => {
        const b = date.getMonth() === new Date().getMonth()
            && date.getFullYear() === new Date().getFullYear()
            && date.getDate() === (index + 1);
        return b;
    };

    return (
        <AnimatedView style={[animatedStyle]}>
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
                        if (prev.toISOString() === newDate.toISOString()) {
                            return prev;
                        }
                        return newDate;
                    });
                    setVisible(true);
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    borderBottomWidth: 1.5,
                    backgroundColor: theme.colors.muted,
                    borderColor: isCurrentDate(idx) ? theme.colors.accent : 'transparent',
                }}>
                    <ThemedText>{idx + 1}</ThemedText>
                    <ThemedText style={{ paddingLeft: 5 }}>{Days[new Date(date.getFullYear(), date.getMonth(), idx + 1).getDay()]}</ThemedText>
                </View>
                <View style={{
                    marginVertical: 'auto',
                }}>
                    <Text style={{ color: theme.colors.investment, textAlign: 'center' }}>${amount.investments}</Text>
                    <Text style={{ color: theme.colors.income, textAlign: 'center' }}>${amount.income}</Text>
                    <Text style={{ color: theme.colors.spending, textAlign: 'center' }}>${amount.spending}</Text>
                </View>
            </FadingPressable>
        </AnimatedView>
    );
};
