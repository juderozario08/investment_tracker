import { useEffect, useState } from 'react';
import { TransactionDataType } from '../../library/types';
import { styles } from './styles'
import { useTheme } from '../../theming';
import { TransactionModal } from '../../components/TransactionModal';
import { PlusCircle } from 'react-native-feather';
import { GestureScrollView } from '../../components/Views/GestureScrollView';
import { DailyCard } from '../../components/DailyCard';
import { TopMenu } from '../../components/TopMenu';
import { useDataContext } from '../../context/DataContext';
import { getDefaultTransactionValue } from '../../library/constants';
import { useDateContext } from '../../context/DateContext';
import { FadingPressable } from '../../components/FadingPressable';
import { Text, View } from 'react-native';

export const Transactions = () => {
    const theme = useTheme();
    const { addTransaction, groupedByDate } = useDataContext();
    const { date, prevMonth, nextMonth } = useDateContext();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [details, setDetails] = useState<TransactionDataType>(getDefaultTransactionValue(date));
    const [filteredDates, setFilteredDates] = useState<string[]>([]);

    useEffect(() => {
        setFilteredDates(Array.from(groupedByDate.keys())
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .filter(val => {
                const d = new Date(val);
                return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
            }));
    }, [date, groupedByDate])

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Tob Bar */}
            <TopMenu />
            {/* Daily Transaction Cards Per Month */}
            <GestureScrollView onLeftSwipe={nextMonth} onRightSwipe={prevMonth} style={{ padding: 10 }}>
                {filteredDates.length > 0 ? (
                    filteredDates.map((val, idx) => (
                        <DailyCard
                            key={idx}
                            transactions={groupedByDate.get(val) || []}
                            date={new Date(val)}
                            delay={idx}
                        />
                    ))
                ) : (
                    <Text style={{ padding: 16, textAlign: 'center', color: 'gray', paddingTop: "25%" }}>
                        No transactions found for this month.
                    </Text>
                )}
            </GestureScrollView>

            {/* Add transaction button */}
            <FadingPressable
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
            </FadingPressable>
            <TransactionModal
                isVisibleState={[isVisible, setIsVisible]}
                detailsState={[details, setDetails]}
                onSubmit={() => {
                    addTransaction(details);
                    setDetails(getDefaultTransactionValue(date));
                    setIsVisible(false);
                }} />
        </View>
    )
}
