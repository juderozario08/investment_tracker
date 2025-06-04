import { useState } from 'react';
import { TransactionDataType } from '../../library/types';
import { styles } from './styles'
import { useTheme } from '../../theming';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransactionModal } from '../../components/TransactionModal';
import { PlusCircle } from 'react-native-feather';
import { GestureScrollView } from '../../components/Views/GestureScrollView';
import { DailyCard } from '../../components/DailyCard';
import { MonthTotal } from '../../components/MonthTotal';
import { TopMenu } from '../../components/TopMenu';
import { MonthSwitcher } from '../../components/MonthSwitcher';
import { useDataContext } from '../../context/DataContext';
import { getDefaultTransactionValue } from '../../library/constants';
import { useDateContext } from '../../context/DateContext';
import { FadingPressable } from '../../components/FadingPressable';

export const Transactions = () => {
    const theme = useTheme();
    const { addTransaction, groupedByDate } = useDataContext();
    const { date, prevMonth, nextMonth } = useDateContext();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [details, setDetails] = useState<TransactionDataType>(getDefaultTransactionValue(date));

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Tob Bar */}
            <TopMenu>
                <MonthSwitcher />
                <MonthTotal />
            </TopMenu>

            {/* Daily Transaction Cards Per Month */}
            <GestureScrollView onLeftSwipe={nextMonth} onRightSwipe={prevMonth} style={{ padding: 10 }}>
                {Array.from(groupedByDate.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).map((val, idx) => {
                    const d = new Date(val);
                    return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear() ? (
                        <DailyCard
                            key={idx}
                            transactions={groupedByDate.get(val) || []}
                            date={d}
                        />
                    ) : null;
                })}
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
        </SafeAreaView>
    )
}
