/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../theming';
import { Days, getDefaultTransactionValue } from '../library/constants';
import type { TransactionDataType } from '../library/types';
import { useEffect, useState } from 'react';
import { TransactionModal } from './TransactionModal';
import { useDataContext } from '../context/DataContext';
import { ScrollView } from 'react-native-gesture-handler';
import { TransactionItem } from './TransactionItem';
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useDateContext } from '../context/DateContext';
import Reanimated from 'react-native-reanimated';
import { ThemedText } from './ThemedText';
import { STANDARD_ANIMATION_DURATION } from '../library/animationConfigs';

export const DailyCard: React.FC<{
    transactions: TransactionDataType[];
    date: Date;
    delay: number;
}> = ({ transactions, date, delay }) => {
    const theme = useTheme();
    const globalDateContext = useDateContext();

    const opacity = useSharedValue<number>(0);
    const scale = useSharedValue<number>(0);
    const translationY = useSharedValue<number>(100);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                { translateY: translationY.value },
                { scale: scale.value },
            ],
        };
    });

    useEffect(() => {
        opacity.value = 0;
        scale.value = 0;
        translationY.value = 100;

        opacity.value = withDelay(75 * delay, withTiming(1, { duration: STANDARD_ANIMATION_DURATION }));
        scale.value = withDelay(75 * delay, withTiming(1, { duration: STANDARD_ANIMATION_DURATION }));
        translationY.value = withDelay(75 * delay, withTiming(0, { duration: STANDARD_ANIMATION_DURATION }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [globalDateContext.date]);

    const { editTransaction, removeTransaction } = useDataContext();
    const totals = transactions.reduce(
        (acc, transaction) => {
            if (transaction.category === 'income') {
                acc.income += Number(transaction.amount);
            }
            if (transaction.category === 'spending') {
                acc.spending += Number(transaction.amount);
            }
            if (transaction.category === 'investment') {
                acc.investments += Number(transaction.amount);
            }
            return acc;
        },
        { income: 0, spending: 0, investments: 0 },
    );
    const total = totals.income - totals.spending;

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [transaction, setTransaction] = useState<TransactionDataType>(
        getDefaultTransactionValue(date)
    );

    return (
        <Reanimated.View style={animatedStyle}>
            <View style={[{ backgroundColor: theme.colors.muted }, styles.container]}>
                {/* Card Header */}
                <View style={[styles.header]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'rgba(255, 70, 28, 0.8)', fontSize: 20, width: 30 }}>{date.getDate()}</Text>
                        <ThemedText style={{ fontSize: 13, fontWeight: 600 }}>{Days[date.getDay()]}</ThemedText>
                    </View>
                    <View style={[styles.headerValues]}>
                        <Text style={[styles.headerValueItems, { color: theme.colors.investment }]}>
                            ${totals.investments}
                        </Text>
                        <Text style={[styles.headerValueItems, { color: theme.colors.income }]}>
                            ${totals.income}
                        </Text>
                        <Text style={[styles.headerValueItems, { color: theme.colors.spending }]}>
                            ${totals.spending}
                        </Text>
                        <Text style={[styles.headerValueItems, { color: total < 0 ? theme.colors.spending : theme.colors.income }]}>
                            {`$${Math.abs(total)}`}
                        </Text>
                    </View>
                </View>

                {/* Transactions */}
                <ScrollView style={{ paddingTop: 10 }}>
                    {transactions.map((transaction, idx) => (
                        <TransactionItem
                            key={idx}
                            setDetails={setTransaction}
                            setIsVisible={setIsVisible}
                            transaction={transaction}
                            removeTransaction={removeTransaction}
                        />
                    ))}
                    <TransactionModal
                        isVisibleState={[isVisible, setIsVisible]}
                        transactionState={[transaction, setTransaction]}
                        onSubmit={() => {
                            editTransaction(transaction);
                            setIsVisible(false);
                        }} />
                </ScrollView>
            </View>
        </Reanimated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 5,
    },
    headerValueItems: {
        textAlign: 'right',
        paddingLeft: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    headerValues: {
        flexDirection: 'row',
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        paddingHorizontal: 10,
    },
    modalFields: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'rgba(128, 128, 128, 0.7)',
        paddingBottom: 5,
    },
    modalText: {
        marginTop: 10,
        width: 100,
    },
    dropdown: {
        marginTop: 8,
        height: 'auto',
        width: 150,
        borderColor: 'transparent',
        borderWidth: 0.5,
        paddingRight: 10,
    },
});
