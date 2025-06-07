import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "../theming";
import { Days, getDefaultTransactionValue } from "../library/constants";
import type { TransactionDataType } from "../library/types";
import { useEffect, useState } from "react";
import { TransactionModal } from "./TransactionModal";
import { useDataContext } from "../context/DataContext";
import { ScrollView } from "react-native-gesture-handler";
import { TransactionItem } from "./TransactionItem";
import { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useDateContext } from "../context/DateContext";
import Reanimated from "react-native-reanimated";

export const DailyCard: React.FC<{
    transactions: TransactionDataType[];
    date: Date;
    delay: number;
}> = ({ transactions, date, delay }) => {
    const theme = useTheme();
    const globalDateContext = useDateContext();

    const ANIMATION_DELAY = 300;
    const opacity = useSharedValue<number>(0);
    const scale = useSharedValue<number>(0);
    const translationY = useSharedValue<number>(100);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                { translateY: translationY.value },
                { scale: scale.value }
            ]
        }
    })

    useEffect(() => {
        opacity.value = 0;
        scale.value = 0;
        translationY.value = 100;

        opacity.value = withDelay(75 * delay, withTiming(1, { duration: ANIMATION_DELAY }));
        scale.value = withDelay(75 * delay, withTiming(1, { duration: ANIMATION_DELAY }));
        translationY.value = withDelay(75 * delay, withTiming(0, { duration: ANIMATION_DELAY }));
    }, [globalDateContext.date])

    const { editTransaction, removeTransaction } = useDataContext();
    const totals = transactions.reduce(
        (acc, transaction) => {
            if (transaction.category === "income") {
                acc.income += Number(transaction.amount);
            }
            if (transaction.category === "spending") {
                acc.spending += Number(transaction.amount);
            }
            if (transaction.category === "investment") {
                acc.investments += Number(transaction.amount);
            }
            return acc;
        },
        { income: 0, spending: 0, investments: 0 },
    );
    const total = totals.income - totals.spending;

    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [details, setDetails] = useState<TransactionDataType>(getDefaultTransactionValue(date));

    return (
        <Reanimated.View style={animatedStyle}>
            <View style={[{ backgroundColor: theme.colors.muted }, styles.container]}>
                {/* Card Header */}
                <View style={[styles.header]}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={{ color: "rgba(255, 70, 28, 0.8)", fontSize: 20, width: 30 }}>{date.getDate()}</Text>
                        <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: 600 }}>{Days[date.getDay()]}</Text>
                    </View>
                    <View style={[styles.headerValues]}>
                        <Text style={[styles.headerValueItems, { color: theme.colors.investment }]}>
                            ${totals.investments}
                        </Text>
                        <Text style={[styles.headerValueItems, { color: theme.colors.income }]}>
                            ${totals.income}
                        </Text>
                        <Text style={[styles.headerValueItems, { color: theme.colors.spending }]}>
                            ${totals.spending}
                        </Text>
                        <Text style={[styles.headerValueItems, { color: total < 0 ? theme.colors.spending : theme.colors.income }]}>
                            {`$${Math.abs(total)}`}
                        </Text>
                    </View>
                </View>

                {/* Transactions */}
                <ScrollView style={{ paddingTop: 10 }}>
                    {transactions.map((transaction, idx) => (
                        <TransactionItem
                            key={idx}
                            setDetails={setDetails}
                            setIsVisible={setIsVisible}
                            transaction={transaction}
                            theme={theme}
                            removeTransaction={removeTransaction}
                        />
                    ))}
                    <TransactionModal
                        isVisibleState={[isVisible, setIsVisible]}
                        detailsState={[details, setDetails]}
                        onSubmit={() => {
                            editTransaction(details);
                            setIsVisible(false);
                        }} />
                </ScrollView>
            </View>
        </Reanimated.View>
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
        textAlign: "right",
        paddingLeft: 8,
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
        alignItems: 'center',
        height: 30,
        paddingHorizontal: 10
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
