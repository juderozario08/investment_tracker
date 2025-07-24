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
import { Calendar, ChevronUp, X } from 'react-native-feather';
import { STANDARD_ANIMATION_DURATION, getTimingConfig } from '../../library/animationConfigs';
import { DateType } from 'react-native-ui-datepicker';
import { RangeTypes } from './types';
import { getDateSelectionAlert, getDatesInRange, getMonthDates, getYearDates } from './helpers/functions';
import { MonthSwitcher } from '../../components/MonthSwitcher';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDataContext } from '../../context/DataContext';
import { useDateContext } from '../../context/DateContext';
import { YearSwitcher } from '../../components/YearSwitcher';
import { NativeCalendarModeMultiple } from '../../components/NativeCalendar';
import { GraphComponent } from '../../components/GraphRenderer';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedFadingPressable = Animated.createAnimatedComponent(FadingPressable);

const originalHeight = 135;
const targetHeight = 0;
const originalRotate = 0;
const targetRotate = 180;

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
            if (modalDates.length > 1) {
                setDateRange(modalDates);
            } else {
                setDateRange([]);
                setDateRangeModalVisible(true);
            }
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
    }, [dateRange, groupedByDate]);

    const [buttonsVisible, setButtonsVisible] = useState<boolean>(true);
    const height = useSharedValue<number>(135);
    const rotate = useSharedValue<number>(0);
    const animatedButtonContainerStyle = useAnimatedStyle(() => ({ height: height.value }));
    const animatedChevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotate.value}deg` }] }));

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
                        <DateRangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'Daily'} />
                        <DateRangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'Weekly'} />
                        <DateRangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'Monthly'} />
                        <DateRangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'Yearly'} />
                        <DateRangeButton
                            rangeSelected={rangeSelected}
                            setPrevRangeSelected={setPrevRangeSelected}
                            setRangeSelected={setRangeSelected}
                            text={'YTD'} />
                        <DateRangeButton
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
                        height: 55,
                    }}
                >
                    <View style={{ alignItems: 'flex-start' }}>
                        {rangeSelected === 'Monthly' && <MonthSwitcher />}
                        {rangeSelected === 'Yearly' && <YearSwitcher year={year} setYear={setYear} />}
                        {rangeSelected === 'Range' &&
                            <FadingPressable
                                style={{ paddingHorizontal: 10, paddingVertical: 11 }}
                                onPress={() => {
                                    setDateRangeModalVisible(true);
                                }}>
                                <Calendar color={'grey'} width={32} height={32} />
                            </FadingPressable>}
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
                        <GraphComponent
                            mode={'Bar'}
                            lookupType="category"
                            data={transactions}
                            chartSelectionList={['Bar', 'Pie']}
                            noOfSections={6}
                            onPress={(t) => {
                                setSelectedTransactions(transactions.filter(a => a.category === t));
                                setSlideViewVisible(true);
                            }}
                        />

                        {/*Income Overview*/}
                        <GraphComponent
                            mode={'Bar'}
                            lookupType="tag"
                            data={transactions.filter(t => t.category === 'income')}
                            chartSelectionList={['Bar', 'Pie']}
                            noOfSections={6}
                            onPress={(t) => {
                                setSelectedTransactions(transactions.filter(a => a.tag === t));
                                setSlideViewVisible(true);
                            }}
                        />

                        {/*Spending Overview*/}
                        <GraphComponent
                            mode={'Bar'}
                            lookupType="tag"
                            data={transactions.filter(t => t.category === 'spending')}
                            chartSelectionList={['Bar', 'Pie']}
                            noOfSections={2}
                            onPress={(t) => {
                                setSelectedTransactions(transactions.filter(a => a.tag === t));
                                setSlideViewVisible(true);
                            }}
                        />

                        {/*Investment Overview*/}
                        <GraphComponent
                            mode={'Bar'}
                            lookupType="tag"
                            data={transactions.filter(t => t.category === 'investment')}
                            chartSelectionList={['Bar', 'Pie']}
                            noOfSections={2}
                            onPress={(t) => {
                                setSelectedTransactions(transactions.filter(a => a.tag === t));
                                setSlideViewVisible(true);
                            }}
                        />

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
                    clearSelection
                    onClearSelectionPress={() => setModalDates([])}
                    onPressCancel={() => {
                        const onOkayPress = () => {
                            setDateRangeModalVisible(false);
                            setRangeSelected(prevRangeSelected ?? 'Daily');
                            setPrevRangeSelected(undefined);
                        };
                        if (dateRange.length < 1) {
                            getDateSelectionAlert(prevRangeSelected ?? 'Daily', onOkayPress);
                        } else {
                            if (modalDates.length < 1) { setModalDates(dateRange); }
                            setDateRangeModalVisible(false);
                        }
                    }}
                    onPressSubmit={() => {
                        const onOkayPress = () => {
                            setDateRangeModalVisible(false);
                            setRangeSelected(prevRangeSelected ?? 'Daily');
                            setPrevRangeSelected(undefined);
                        };
                        if (modalDates.length < 1) {
                            // NOTE: MAKE IT SO THAT IF A DATE IS ALREADY SELECTED AND THEN THE MODAL DATES ARE EMPTY,
                            // THEN THE ALERT SHOULD SAY GO BACK TO PREVIOUS DATE
                            getDateSelectionAlert(prevRangeSelected ?? 'Daily', onOkayPress);
                        } else {
                            setDateRange(modalDates);
                            setDateRangeModalVisible(false);
                        }
                    }} />

            </SafeAreaView>

            <SlideDailyTransaction
                visible={slideViewVisible}
                setVisible={setSlideViewVisible}
                transactions={selectedTransactions}
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
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDataType>(
        getDefaultTransactionValue(new Date())
    );

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
                { backgroundColor: theme.colors.muted },
                styles.slideViewTransactionView,
                animatedStyle,
            ]}>
            <View style={{ flexDirection: 'row-reverse', paddingBottom: 10 }}>
                <FadingPressable onPress={() => {
                    translateY.value = withTiming(500, { duration: STANDARD_ANIMATION_DURATION }, () => {
                        'worklet';
                        runOnJS(setVisible)(false);
                    });
                }}>
                    <X color={'grey'} width={20} style={{ padding: 5 }} />
                </FadingPressable>
            </View>
            {transactions.length === 0 ?
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
                            transactionState={[selectedTransaction, setSelectedTransaction]}
                            onSubmit={() => {
                                editTransaction(selectedTransaction);
                                setIsVisible(false);
                            }} />
                    </ScrollView>
                </View>}
        </AnimatedView>
    );
};

const DateRangeButton: React.FC<{
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
    slideViewTransactionView: {
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
});
