import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "../../../theming"
import { useEffect, useState } from "react";
import { useDataContext } from "../../../context/DataContext";

export const Daily = () => {
    const theme = useTheme();
    const { groupedByDate } = useDataContext();
    const currentDate = (() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    })()

    const [totalSpending, setTotalSpending] = useState<number>(0);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [transactionBreakdown, setTransactionBreakdown] = useState<{
        income: number;
        spending: number;
    }>({
        income: 0,
        spending: 0
    });

    const [totalInvestment, setTotalInvestment] = useState<number>(0);
    const [investmentBreakdown, setInvestmentBreakdown] = useState<{
        income: number;
        investment: number;
    }>({
        income: 0,
        investment: 0
    });

    const [spendingGroupedByTags, setSpendingGroupedByTags] = useState<Map<string, number>>(new Map());

    const calculateAllAmountsFromLogs = () => {
        let spending = 0;
        let income = 0;
        let investment = 0;
        let transactions = groupedByDate.get(currentDate.toString());
        let spendingGroup = new Map<string, number>();
        if (transactions) {
            for (const tx of transactions) {
                if (tx.category === "spending") {
                    spending += Number(tx.amount);
                    if (spendingGroup.has(tx.tag)) {
                        spendingGroup.set(tx.tag, Number(tx.amount));
                    }
                } else if (tx.category === "income") {
                    income += Number(tx.amount);
                } else {
                    investment += Number(tx.amount);
                }
            }
        }
        setTransactionBreakdown({ income, spending });
        setInvestmentBreakdown({ income, investment });
        setTotalSpending(spending);
        setTotalIncome(income);
        setTotalInvestment(investment);
    }

    useEffect(() => {
        calculateAllAmountsFromLogs();
    }, [groupedByDate]);
    return (
        <View style={[{
            backgroundColor: theme.colors.background
        }, styles.container]}>
            <Text style={[{ color: theme.colors.text }, styles.title]}>
                Transactions Overview
            </Text>
            <Text style={[{ color: theme.colors.text }, styles.title]}>
                Investment Overview
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    }
})
