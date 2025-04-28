import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native"
import { useTheme } from "../theming/ThemeProvider"
import { Days } from "../lib/constants";
import { TransactionDateType } from "..";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../theming/types";
import { ArrowLeft, X } from "react-native-feather";

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: 'rgba(255, 70, 28, 0.7)', fontSize: 20, width: 30 }}>{date.getDate()}</Text>
                <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: '600' }}>{Days[date.getDay()]}</Text>
            </View>
            <View style={[styles.headerValues]}>
                <Text style={[{ width: 55, textAlign: 'right', color: theme.colors.investment }]}>{`$${investments}`}</Text>
                <Text style={[{ width: 55, textAlign: 'right', color: theme.colors.income }]}>{`$${income}`}</Text>
                <Text style={[{ width: 55, textAlign: 'right', color: theme.colors.spending }]}>{`$${spending}`}</Text>
                <Text style={[{ width: 55, textAlign: 'right', color: total < 0 ? theme.colors.spending : theme.colors.income }]}>{`$${Math.abs(total)}`}</Text>
            </View>
        </View>
    )
}

const CustomModal: React.FC<{
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    theme: Theme;
    details: TransactionDateType;
}> = ({ isVisible, setIsVisible, theme, details }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}>
            <View style={[styles.centeredView, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.modalView, { backgroundColor: theme.colors.muted, shadowColor: theme.colors.accent }]}>
                    <View style={{ position: 'absolute', left: 10, top: 10 }}>
                        <TouchableOpacity
                            onPress={() => setIsVisible(!isVisible)}>
                            <ArrowLeft color={'grey'} width={19} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalFields}>
                        <Text style={{ color: theme.colors.text, marginTop: 10, width: 100 }}>Category: </Text>
                        <Text style={{ color: theme.colors[details.category], marginTop: 10, width: 100 }}>{details.category[0].toUpperCase() + details.category.slice(1)}</Text>
                    </View>
                    <View style={styles.modalFields}>
                        <Text style={{ color: theme.colors.text, marginTop: 10, width: 100 }}>Tag: </Text>
                        <Text style={{ color: theme.colors.text, marginTop: 10, width: 100 }}>{details.transactionType}</Text>
                    </View>
                    <View style={styles.modalFields}>
                        <Text style={{ color: theme.colors.text, marginTop: 10, width: 100 }}>Name: </Text>
                        <Text style={{ color: theme.colors.text, marginTop: 10, width: 100 }}>{details.name}</Text>
                    </View>
                    <View style={styles.modalFields}>
                        <Text style={{ color: theme.colors.text, marginTop: 10, width: 100 }}>Amount: </Text>
                        <Text style={{ color: theme.colors[details.category], marginTop: 10, width: 100 }}>${details.amount}</Text>
                    </View>
                    <View style={styles.modalFields}>
                        <Text style={{ color: theme.colors.text, marginTop: 10, width: 100 }}>Description: </Text>
                        <Text style={{ color: theme.colors.text, marginTop: 10 }}>{details.description}</Text>
                    </View>
                    <View style={styles.modalFields}>
                        <Text style={{ color: theme.colors.text, marginTop: 10, width: 100 }}>Note: </Text>
                        <Text style={{ color: theme.colors.text, marginTop: 10 }}>{details.note}</Text>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const Transaction: React.FC<{ transaction: TransactionDateType }> = ({ transaction }) => {
    const { theme } = useTheme();
    const [isVisible, setIsVisible] = useState<boolean>(false);
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <CustomModal isVisible={isVisible} setIsVisible={setIsVisible} theme={theme} details={transaction} />
                <TouchableOpacity style={[styles.transaction, { paddingRight: 5 }]} onPress={() => setIsVisible(true)}>
                    <View style={{ flexDirection: 'row', gap: 10, paddingLeft: 5 }}>
                        <Text style={[{ color: theme.colors.text, width: 100 }]}>{transaction.transactionType}</Text>
                        <Text style={[{ color: theme.colors.text, width: 100 }]}>{transaction.name}</Text>
                    </View>
                    <Text style={[{ color: theme.colors[transaction.category] }]}>{`$${transaction.amount}`}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export const DailyCard: React.FC<{ transactions: TransactionDateType[], date: Date }> = ({ transactions, date }) => {
    const { theme } = useTheme();
    const totals = transactions.reduce((acc, transaction) => {
        if (transaction.category === 'income') acc.income += transaction.amount;
        if (transaction.category === 'spending') acc.spending += transaction.amount;
        if (transaction.category === 'investment') acc.investments += transaction.amount;
        return acc;
    }, { income: 0, spending: 0, investments: 0 });

    return (
        <View style={[{ backgroundColor: theme.colors.muted }, styles.container]}>
            <CardHeader date={date} investments={totals.investments} income={totals.income} spending={totals.spending} />
            <View style={{ paddingTop: 10, gap: 10 }}>
                {transactions.map((transaction, idx) => (
                    <Transaction key={idx} transaction={transaction} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
        marginBottom: 5
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
    headerValues: {
        flexDirection: 'row',
    },
    transaction: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 20
    },
    modalView: {
        marginTop: 20,
        marginBottom: 20,
        marginRight: 5,
        marginLeft: 5,
        borderRadius: 10,
        padding: 35,
        shadowRadius: 4,
        elevation: 10,
    },
    modalFields: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'rgba(128, 128, 128, 0.7)',
        paddingBottom: 5
    }
})
