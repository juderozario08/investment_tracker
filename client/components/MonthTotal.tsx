/* eslint-disable react-native/no-inline-styles */
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theming';
import { useDataContext } from '../context/DataContext';
import { useEffect, useState } from 'react';
import { ThemedText } from './ThemedText';

export const MonthTotal = () => {
    const theme = useTheme();
    const { monthlyAmounts } = useDataContext();
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        setTotal(monthlyAmounts.income - monthlyAmounts.spending);
    }, [monthlyAmounts]);

    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 5,
            paddingBottom: 5,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: 'rgba(128, 128, 128, 0.5)',
        }}>
            <View style={styles.categoryTotalView}>
                <ThemedText>Investing</ThemedText>
                <Text style={[{ color: theme.colors.investment }]}>${monthlyAmounts.investments}</Text>
            </View>
            <View style={styles.categoryTotalView}>
                <ThemedText>Income</ThemedText>
                <Text style={[{ color: theme.colors.income }]}>${monthlyAmounts.income}</Text>
            </View>
            <View style={styles.categoryTotalView}>
                <ThemedText>Spending</ThemedText>
                <Text style={[{ color: theme.colors.spending }]}>${monthlyAmounts.spending}</Text>
            </View>
            <View style={styles.categoryTotalView}>
                <ThemedText>Total</ThemedText>
                <Text style={[{ color: total > 0 ? theme.colors.income : theme.colors.spending }]}>${Math.abs(total)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    categoryTotalView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 2,
        paddingTop: 2,
    },
});
