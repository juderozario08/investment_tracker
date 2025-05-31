import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "../theming";
import { Days, getDefaultTransactionValue } from "../library/constants";
import type { TransactionDataType } from "../library/types";
import { useState } from "react";
import { TransactionModal } from "./TransactionModal";
import { Theme } from "../theming/types";
import { useDataContext } from "../context/DataContext";
import { runOnJS, useAnimatedStyle } from "react-native-reanimated";
import { SharedValue } from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { GestureHandlerRootView, RectButton } from "react-native-gesture-handler";
import Reanimated from "react-native-reanimated";
import { Trash } from "react-native-feather";
import { FadingPressable } from "./FadingPressable";

const TransactionItem: React.FC<{
    setDetails: React.Dispatch<React.SetStateAction<TransactionDataType>>,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    transaction: TransactionDataType,
    removeTransaction: (id: string) => void,
    theme: Theme
}> = ({ setDetails, transaction, setIsVisible, theme, removeTransaction }) => {

    const renderRightActions = (_: SharedValue<number>, drag: SharedValue<number>) => {
        'worklet';
        const animatedStyles = useAnimatedStyle(() => {
            return { transform: [{ translateX: drag.value + 40 }] }
        })
        return (
            <Reanimated.View style={animatedStyles}>
                <FadingPressable
                    style={{
                        backgroundColor: 'red',
                        paddingHorizontal: 10,
                        height: '100%',
                        justifyContent: 'center',
                        borderRadius: 5,
                    }}
                    onPress={() => runOnJS(removeTransaction)(transaction.id)}
                >
                    <Trash stroke="white" />
                </FadingPressable>
            </Reanimated.View>
        );
    };

    return (
        <ReanimatedSwipeable renderRightActions={renderRightActions} friction={2}>
            <FadingPressable
                style={[styles.transaction]}
                onPress={() => {
                    setDetails(transaction);
                    setIsVisible(true);
                }}>
                <View style={{ flexDirection: "row" }}>
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
            </FadingPressable>
        </ReanimatedSwipeable>
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
    const [details, setDetails] = useState<TransactionDataType>(getDefaultTransactionValue());

    return (
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
            <GestureHandlerRootView style={{ paddingTop: 10 }}>
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
            </GestureHandlerRootView>
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
