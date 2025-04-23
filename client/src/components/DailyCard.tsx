import { StyleSheet, View, Text } from "react-native"
import { useTheme } from "../theming/ThemeProvider"
import { Days } from "../lib/constants";
import { TransactionDateType } from "..";

const CardHeader: React.FC<{
    date: Date;
    investments: number;
    income: number;
    spending: number;
}> = ({ date, investments, income, spending }) => {
    const { theme } = useTheme();
    const total = income - spending;
    return (
        <View style={[styles.header]}>
            <Text style={[{ color: theme.colors.text }]}>{`${date.getDate()} ${Days[date.getDay()]}`}</Text>
            <View style={[styles.headerValues]}>
                <Text style={[{ color: theme.colors.investment }]}>{`$${investments}`}</Text>
                <Text style={[{ color: theme.colors.income }]}>{`$${income}`}</Text>
                <Text style={[{ color: theme.colors.spending }]}>{`$${spending}`}</Text>
                <Text style={[{ color: total < 0 ? theme.colors.spending : theme.colors.income }]}>{`$${Math.abs(total)}`}</Text>
            </View>
        </View>
    )
}

const Transaction: React.FC<TransactionDateType> = ({ category, transactionType, name, amount }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.transaction, { paddingRight: 5 }]}>
            <View style={{ flexDirection: 'row', gap: 10, paddingLeft: 5 }}>
                <Text style={[{ color: theme.colors.text, width: 75 }]}>{transactionType}</Text>
                <Text style={[{ color: theme.colors.text, width: 75 }]}>{name}</Text>
            </View>
            <Text style={[{ color: theme.colors[category] }]}>{`$${amount}`}</Text>
        </View>
    )
}

export const DailyCard: React.FC<{ transactions: TransactionDateType[] }> = ({ transactions }) => {
    const { theme } = useTheme();
    const totals = transactions.reduce((acc, transaction) => {
        if (transaction.category === 'income') acc.income += transaction.amount;
        if (transaction.category === 'spending') acc.spending += transaction.amount;
        if (transaction.category === 'investment') acc.investments += transaction.amount;
        return acc;
    }, { income: 0, spending: 0, investments: 0 });

    return (
        <View style={[{ backgroundColor: theme.colors.muted }, styles.container]}>
            <CardHeader date={new Date()} investments={totals.investments} income={totals.income} spending={totals.spending} />
            <View style={{ paddingTop: 10, gap: 10 }}>
                {transactions.map((transaction, idx) => (
                    <Transaction
                        key={idx}
                        category={transaction.category}
                        transactionType={transaction.transactionType}
                        name={transaction.name}
                        amount={transaction.amount}
                        date={transaction.date}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    headerValues: {
        flexDirection: 'row',
        gap: 12
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})
