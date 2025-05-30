import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../theming";

export const MonthSummary: React.FC<{
    amounts: {
        investing: number;
        income: number;
        spending: number;
    }
}> = ({ amounts }) => {
    const theme = useTheme();
    const total = amounts.income - amounts.spending;
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 5,
            paddingBottom: 5,
            marginTop: 15,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: 'rgba(128, 128, 128, 0.5)',
        }}>
            <View style={styles.categoryTotalView}>
                <Text style={[{ color: theme.colors.text }]}>Investing</Text>
                <Text style={[{ color: theme.colors.investment }]}>${amounts.investing}</Text>
            </View>
            <View style={styles.categoryTotalView}>
                <Text style={[{ color: theme.colors.text }]}>Income</Text>
                <Text style={[{ color: theme.colors.income }]}>${amounts.income}</Text>
            </View>
            <View style={styles.categoryTotalView}>
                <Text style={[{ color: theme.colors.text }]}>Spending</Text>
                <Text style={[{ color: theme.colors.spending }]}>${amounts.spending}</Text>
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
