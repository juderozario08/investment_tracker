import { StyleSheet, Text, View } from "react-native"
import { useTheme } from "../../../theming"
import { useEffect, useState } from "react";
import { useDataContext } from "../../../context/DataContext";
import { TransactionDataType } from "../../../library/types";

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

    const [spendingGroupedByTags, setSpendingGroupedByTags] = useState<Map<string, { total: number; data: TransactionDataType[] }>>(new Map());
    const [incomeGroupedByTags, setIncomeGroupedByTags] = useState<Map<string, { total: number; data: TransactionDataType[] }>>(new Map());
    const [investmentGroupedByTags, setInvestmentGroupedByTags] = useState<Map<string, { total: number; data: TransactionDataType[] }>>(new Map());

    const calculateAllAmountsFromLogs = () => {
        const addToMap = (map: Map<string, { total: number; data: TransactionDataType[] }>, tx: TransactionDataType) => {
            if (!map.has(tx.tag)) {
                map.set(tx.tag, {
                    total: Number(tx.amount),
                    data: [tx]
                });
            } else {
                const currentValue = map.get(tx.tag);
                if (currentValue) {
                    map.set(tx.tag, {
                        total: currentValue.total + Number(tx.amount),
                        data: [...currentValue.data, tx]
                    });
                }
            }
        }
        let spending = 0;
        let income = 0;
        let investment = 0;
        let transactions = groupedByDate.get(currentDate.toString());
        let spendingGroup = new Map<string, { total: number; data: TransactionDataType[] }>();
        let incomeGroup = new Map<string, { total: number; data: TransactionDataType[] }>();
        let investmentGroup = new Map<string, { total: number; data: TransactionDataType[] }>();
        if (transactions) {
            for (const tx of transactions) {
                if (tx.category === "spending") {
                    spending += Number(tx.amount);
                    addToMap(spendingGroup, tx);
                } else if (tx.category === "income") {
                    income += Number(tx.amount);
                    addToMap(incomeGroup, tx);
                } else {
                    investment += Number(tx.amount);
                    addToMap(investmentGroup, tx);
                }
            }
        }
        setTransactionBreakdown({ income, spending });
        setInvestmentBreakdown({ income, investment });
        setTotalSpending(spending);
        setTotalIncome(income);
        setTotalInvestment(investment);
        setSpendingGroupedByTags(spendingGroup);
        setIncomeGroupedByTags(incomeGroup);
        setInvestmentGroupedByTags(investmentGroup);
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
