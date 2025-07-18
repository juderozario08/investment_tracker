/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../../theming';
import { useEffect, useState } from 'react';
import { TransactionDataType } from '../../library/types';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemedText } from '../../components/ThemedText';
import { TransactionItem } from '../../components/TransactionItem';
import { getDefaultTransactionValue } from '../../library/constants';
import { TransactionModal } from '../../components/TransactionModal';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { FadingPressable } from '../../components/FadingPressable';
import { ChevronUp, X } from 'react-native-feather';
import { STANDARD_ANIMATION_DURATION, getTimingConfig } from '../../library/animationConfigs';
import { DateType } from 'react-native-ui-datepicker';
import { RangeTypes } from './types';
import { getDatesInRange } from './helpers/functions';
import { MonthSwitcher } from '../../components/MonthSwitcher';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDataContext } from '../../context/DataContext';
import { useDateContext } from '../../context/DateContext';
import { YearSwitcher } from '../../components/YearSwitcher';
import { NativeCalendarModeMultiple } from '../../components/NativeCalendar';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedFadingPressable = Animated.createAnimatedComponent(FadingPressable);

const originalHeight = 135;
const targetHeight = 0;
const originalRotate = 0;
const targetRotate = 180;

function getMonthDates(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const result: Date[] = [];
    let current = new Date(firstDay);
    while (current <= lastDay) {
        result.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return result;
}

const getYearDates = (year: number): Date[] => {
    const dates: Date[] = [];
    const date = new Date(year, 0, 1);

    while (date.getFullYear() === year) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    return dates;
};

const RangeButton: React.FC<{
    rangeSelected: RangeTypes;
    setPrevRangeSelected: React.Dispatch<React.SetStateAction<RangeTypes | undefined>>;
    setRangeSelected: React.Dispatch<React.SetStateAction<RangeTypes>>;
    text: RangeTypes;
}> = ({ rangeSelected, setRangeSelected, setPrevRangeSelected, text }) => {
    const theme = useTheme();
    return (
        <FadingPressable style={[{
            borderWidth: 2,
            borderRadius: 15,
            padding: 10,
            borderColor: theme.colors.primary,
        }, rangeSelected === text && { backgroundColor: theme.colors.primary }]}
            onPress={() => {
                setRangeSelected(prev => {
                    setPrevRangeSelected(prev);
                    return text;
                });
            }}
        >
            <Text style={[
                rangeSelected === text ?
                    { color: theme.colors.background, fontWeight: 'bold' } :
                    { color: theme.colors.primary },
                { fontSize: 16 },
            ]}>{text}</Text>
        </FadingPressable>
    );
};

export const Statistics = () => {
    const theme = useTheme();
    const { date } = useDateContext();
    const { groupedByDate, removeTransaction, editTransaction } = useDataContext();

    const [prevRangeSelected, setPrevRangeSelected] = useState<RangeTypes | undefined>();
    const [rangeSelected, setRangeSelected] = useState<RangeTypes>('Monthly');

    const [modalDates, setModalDates] = useState<DateType[]>([]);
    const [dateRange, setDateRange] = useState<DateType[]>([]);
    const [dateRangeModalVisible, setDateRangeModalVisible] = useState<boolean>(false);

    const [transactions, setTransactions] = useState<TransactionDataType[]>([]);
    const [selectedTransactions, setSelectedTransactions] = useState<TransactionDataType[]>([]);

    const [year, setYear] = useState<number>(new Date().getFullYear());

    const [slideViewVisible, setSlideViewVisible] = useState<boolean>(false);

    function getTransactions() {
        const trxs: TransactionDataType[] = [];
        for (const d of dateRange) {
            if (d) {
                const ds = new Date(d.toString());
                const transactionList = groupedByDate.get(ds.toISOString());
                if (transactionList) {
                    trxs.push(...transactionList);
                }
            }
        }
        setTransactions(trxs);
    }

    useEffect(() => {
        if (rangeSelected === 'Range') {
            setDateRangeModalVisible(true);
        } else if (rangeSelected === 'Monthly') {
            setDateRange(getMonthDates(date));
        } else if (rangeSelected === 'Yearly') {
            setDateRange(getYearDates(year));
        } else {
            const d = getDatesInRange(rangeSelected);
            setDateRange(d);
        }
    }, [rangeSelected, year, date]);

    useEffect(() => {
        getTransactions();
    }, [dateRange]);

    const [buttonsVisible, setButtonsVisible] = useState<boolean>(true);
    const height = useSharedValue<number>(135);
    const rotate = useSharedValue<number>(0);
    const animatedButtonContainerStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
        };
    });
    const animatedChevronStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotate: `${rotate.value}deg` },
            ],
        };
    });

    useEffect(() => {
        if (!buttonsVisible) {
            height.value = withTiming(targetHeight, getTimingConfig(STANDARD_ANIMATION_DURATION));
            rotate.value = withTiming(targetRotate, getTimingConfig(STANDARD_ANIMATION_DURATION));
        } else {
            height.value = withTiming(originalHeight, getTimingConfig(STANDARD_ANIMATION_DURATION));
            rotate.value = withTiming(originalRotate, getTimingConfig(STANDARD_ANIMATION_DURATION));
        }
    }, [buttonsVisible]);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView edges={['top']} style={[styles.container]}>
                {/* Top Page Range Buttons */}
                <AnimatedView style={[animatedButtonContainerStyle, { overflow: 'hidden' }]}>
                    <View style={{
                        backgroundColor: theme.colors.muted,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        padding: 15,
                        gap: 20,
                    }}>
                        <RangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'Daily'} />
                        <RangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'Weekly'} />
                        <RangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'Monthly'} />
                        <RangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'Yearly'} />
                        <RangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'YTD'} />
                        <RangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'Range'} />
                    </View>
                </AnimatedView>
                <View
                    style={{
                        backgroundColor: theme.colors.muted,
                        position: 'relative',
                    }}
                >
                    <View style={{ alignItems: 'flex-start' }}>
                        {rangeSelected === 'Monthly' && <MonthSwitcher />}
                        {rangeSelected === 'Yearly' && <YearSwitcher year={year} setYear={setYear} />}
                    </View>

                    <AnimatedFadingPressable
                        onPress={() => setButtonsVisible(!buttonsVisible)}
                        style={[
                            animatedChevronStyle, {
                                position: 'absolute',
                                alignSelf: 'center',
                                top: 8,
                            },
                        ]}
                    >
                        <ChevronUp color="grey" width={40} height={40} />
                    </AnimatedFadingPressable>
                </View>


                {transactions.length > 0 ?
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/*Account Overview*/}

                        {/*Transaction Overview*/}

                        {/*Income Overview*/}

                        {/*Spending Overview*/}

                        {/*Investment Overview*/}
                    </ScrollView> :
                    <View style={styles.centeredNonFilledView}>
                        <ThemedText style={{ fontSize: 20 }}>
                            No transactions available
                        </ThemedText>
                    </View>
                }
                <NativeCalendarModeMultiple
                    modalDates={modalDates}
                    setModalDates={setModalDates}
                    isVisible={dateRangeModalVisible}
                    setIsVisible={setDateRangeModalVisible}
                    onPressCancel={() => { }}
                    onPressSubmit={() => { }} />
            </SafeAreaView>
            <SlideDailyTransaction
                visible={slideViewVisible}
                setVisible={setSlideViewVisible}
                transactions={transactions}
                removeTransaction={removeTransaction}
                editTransaction={editTransaction} />
        </View>
    );
};

const SlideDailyTransaction: React.FC<{
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    transactions: TransactionDataType[];
    removeTransaction: (id: string) => void;
    editTransaction: (t: TransactionDataType) => void;
}> = ({ visible, setVisible, transactions, editTransaction, removeTransaction }) => {
    const theme = useTheme();

    // Slide Animation
    const screenHeight = Dimensions.get('screen').height;
    const translateY = useSharedValue<number>(screenHeight);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDataType>(getDefaultTransactionValue(new Date()));

    useEffect(() => {
        if (!visible) { return; }

        translateY.value = withSequence(
            withTiming(screenHeight, { duration: STANDARD_ANIMATION_DURATION }),
            withTiming(0, { duration: STANDARD_ANIMATION_DURATION })
        );

    }, [transactions]);

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
            {}
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
                        <ScrollView style={{
                            backgroundColor: theme.colors.background,
                            borderRadius: 10,
                            padding: 10,
                            gap: 10,
                        }}>
                            {transactions.map((val) => (
                                <TransactionItem
                                    key={val.id}
                                    setDetails={setSelectedTransaction}
                                    setIsVisible={setIsVisible}
                                    transaction={val}
                                    removeTransaction={removeTransaction} />
                            ))}
                            <TransactionModal
                                isVisibleState={[isVisible, setIsVisible]}
                                detailsState={[selectedTransaction, setSelectedTransaction]}
                                onSubmit={() => {
                                    editTransaction(selectedTransaction);
                                    setIsVisible(false);
                                }} />
                        </ScrollView>
                    </View>
            }
        </AnimatedView>
    );
};

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    donutText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    centeredNonFilledView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        shadowRadius: 4,
        elevation: 10,
        maxHeight: '90%',
        marginVertical: 10,
        marginHorizontal: 5,
        paddingBottom: 20,
    },
});
