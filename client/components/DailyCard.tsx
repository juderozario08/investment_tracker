import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../theming";
import { Days, DefaultTransactionValues, getDefaultTransactionValue } from "../library/constants";
import type { TransactionDataType } from "../library/types";
import { SetStateAction, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TransactionModal } from "./TransactionModal";
import { Theme } from "../theming/types";
import { useDataContext } from "../context/DataContext";

const TransactionItem: React.FC<{
    setDetails: React.Dispatch<React.SetStateAction<TransactionDataType>>,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    transaction: TransactionDataType,
    theme: Theme
}> = ({ setDetails, transaction, setIsVisible, theme }) => {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <TouchableOpacity
                    style={[styles.transaction, { paddingRight: 5 }]}
                    onPress={() => {
                        setDetails(transaction);
                        setIsVisible(true);
                    }}
                >
                    <View style={{ flexDirection: "row", paddingVertical: 5, paddingLeft: 5 }}>
                        <Text style={[{ color: theme.colors.text, width: 100 }]}>
                            {transaction.tag}
                        </Text>
                        <Text style={[{ color: theme.colors.text, width: 100 }]}>
                            {transaction.name}
                        </Text>
                    </View>
                    <Text
                        style={[{
                            color: transaction.category === 'spending' ?
                                theme.colors.spending : transaction.category === 'income' ?
                                    theme.colors.income : theme.colors.investment
                        }]}
                    >{`$${transaction.amount}`}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export const DailyCard: React.FC<{
    transactions: TransactionDataType[];
    date: Date;
}> = ({ transactions, date }) => {
    const theme = useTheme();
    const { editTransaction, removeTransaction } = useDataContext();
    const totals = transactions.reduce(
        (acc, transaction) => {
            if (transaction.category === "income") acc.income += Number(transaction.amount);
            if (transaction.category === "spending")
                acc.spending += Number(transaction.amount);
            if (transaction.category === "investment")
                acc.investments += Number(transaction.amount);
            return acc;
        },
        { income: 0, spending: 0, investments: 0 },
    );
    const total = totals.income - totals.spending;

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [details, setDetails] = useState<TransactionDataType>(getDefaultTransactionValue());

    return (
        <View style={[{ backgroundColor: theme.colors.muted }, styles.container]}>
            {/* Card Header */}
            <View style={[styles.header]}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                        style={{ color: "rgba(255, 70, 28, 0.8)", fontSize: 20, width: 30 }}
                    >
                        {date.getDate()}
                    </Text>
                    <Text
                        style={{ color: theme.colors.text, fontSize: 13, fontWeight: 600 }}
                    >
                        {Days[date.getDay()]}
                    </Text>
                </View>
                <View style={[styles.headerValues]}>
                    <Text
                        style={[
                            styles.headerValueItems,
                            { color: theme.colors.investment },
                        ]}
                    >{`$${totals.investments}`}</Text>
                    <Text
                        style={[styles.headerValueItems, { color: theme.colors.income }]}
                    >{`$${totals.income}`}</Text>
                    <Text
                        style={[styles.headerValueItems, { color: theme.colors.spending }]}
                    >{`$${totals.spending}`}</Text>
                    <Text
                        style={[
                            styles.headerValueItems,
                            {
                                color: total < 0 ? theme.colors.spending : theme.colors.income,
                            },
                        ]}
                    >{`$${Math.abs(total)}`}</Text>
                </View>
            </View>

            {/* Transactions */}
            <View style={{ paddingTop: 10, gap: 10 }}>
                {transactions.map((transaction, idx) => (
                    <TransactionItem key={idx}
                        setDetails={setDetails}
                        setIsVisible={setIsVisible}
                        transaction={transaction}
                        theme={theme}
                    />
                ))}
                <TransactionModal
                    isVisibleState={[isVisible, setIsVisible]}
                    detailsState={[details, setDetails]}
                    onSubmit={() => {
                        editTransaction(details);
                        setIsVisible(false);
                    }} />
            </View>
        </View >
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
        width: 55,
        textAlign: "right",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: "grey",
    },
    headerValues: {
        flexDirection: "row",
    },
    transaction: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modalFields: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "rgba(128, 128, 128, 0.7)",
        paddingBottom: 5,
    },
    modalText: {
        marginTop: 10,
        width: 100,
    },
    dropdown: {
        marginTop: 8,
        height: "auto",
        width: 150,
        borderColor: "transparent",
        borderWidth: 0.5,
        paddingRight: 10,
    },
});
