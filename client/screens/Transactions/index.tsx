/* eslint-disable react-native/no-inline-styles */
import { useEffect, useState } from 'react';
import { TransactionDataType } from '../../library/types';
import { styles } from './styles';
import { useTheme } from '../../theming';
import { TransactionModal } from '../../components/TransactionModal';
import { Plus } from 'react-native-feather';
import { DailyCard } from '../../components/DailyCard';
import { TopMenu } from '../../components/TopMenu';
import { useDataContext } from '../../context/DataContext';
import { getDefaultTransactionValue } from '../../library/constants';
import { useDateContext } from '../../context/DateContext';
import { FadingPressable } from '../../components/FadingPressable';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { MonthSwitcher } from '../../components/MonthSwitcher';
import { MonthTotal } from '../../components/MonthTotal';
import { GestureView } from '../../components/Views/GestureView';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Transactions = () => {
    const theme = useTheme();
    const { addTransaction, groupedByDate } = useDataContext();
    const { date, prevMonth, nextMonth } = useDateContext();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [transaction, setTransaction] = useState<TransactionDataType>(
        getDefaultTransactionValue(date)
    );
    const [filteredDates, setFilteredDates] = useState<string[]>([]);

    useEffect(() => {
        setFilteredDates(Array.from(groupedByDate.keys())
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .filter(val => {
                const d = new Date(val);
                return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
            }));
    }, [date, groupedByDate]);

    const renderItem: ListRenderItem<string> = ({ item, index }) => {
        return (
            <DailyCard
                transactions={groupedByDate.get(item) || []}
                date={new Date(item)}
                delay={index}
            />
        );
    };

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Tob Bar */}
            <TopMenu>
                {}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <MonthSwitcher />
                    {/* Add transaction button */}
                    <FadingPressable
                        onPress={() => setIsVisible(true)}

                        style={{ padding: 10 }}
                    >
                        <Plus
                            color={theme.colors.textSubtle}
                            width={30}
                            height={30}
                        />
                    </FadingPressable>
                </View>
                <MonthTotal />
            </TopMenu>

            {/* Daily Transaction Cards Per Month */}
            <GestureView onLeftSwipe={nextMonth} onRightSwipe={prevMonth} style={{ flex: 1, padding: 10 }}>
                {filteredDates.length > 0 ?
                    <FlatList
                        data={filteredDates}
                        renderItem={renderItem}
                        style={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    /> :
                    <View>
                        <Text style={{ padding: 16, textAlign: 'center', color: 'gray', paddingTop: '25%' }}>
                            No transactions found for this month.
                        </Text>
                    </View>}
            </GestureView>

            <TransactionModal
                isVisibleState={[isVisible, setIsVisible]}
                transactionState={[transaction, setTransaction]}
                onSubmit={() => {
                    addTransaction(transaction);
                    setTransaction(getDefaultTransactionValue(date));
                    setIsVisible(false);
                }} />
        </SafeAreaView>
    );
};
