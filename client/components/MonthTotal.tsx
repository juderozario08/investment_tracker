import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../theming";
import { useDataContext } from "../context/DataContext";
import { useEffect, useState } from "react";

export const MonthTotal = () => {
    const theme = useTheme();
    const { monthlyAmounts } = useDataContext();
    const [total, setTotal] = useState<number>();

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
                <Text style={[{ color: theme.colors.text }]}>Investing</Text>
                <Text style={[{ color: theme.colors.investment }]}>${monthlyAmounts.investments}</Text>
            </View>
            <View style={styles.categoryTotalView}>
                <Text style={[{ color: theme.colors.text }]}>Income</Text>
                <Text style={[{ color: theme.colors.income }]}>${monthlyAmounts.income}</Text>
            </View>
            <View style={styles.categoryTotalView}>
                <Text style={[{ color: theme.colors.text }]}>Spending</Text>
                <Text style={[{ color: theme.colors.spending }]}>${monthlyAmounts.spending}</Text>
            </View>
            <View style={styles.categoryTotalView}>
                <Text style={[{ color: theme.colors.text }]}>Total</Text>
                <Text style={[{ color: total > 0 ? theme.colors.income : theme.colors.spending }]}>${Math.abs(total)}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    categoryTotalView: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 2,
        paddingTop: 2
    }
})
