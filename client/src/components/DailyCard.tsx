import { StyleSheet, View, Text, TouchableOpacity, Modal } from "react-native"
import { useTheme } from "../theming/ThemeProvider"
import { Days, TransactionCategoryOptions, TransactionIncomeTagOptions, TransactionInvestTagOptions, TransactionSpendingTagOptions } from "../lib/constants";
import { TransactionDateType } from "../types";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Theme } from "../theming/types";
import { ArrowLeft } from "react-native-feather";
import { TextInput } from "react-native-gesture-handler";
import { Dropdown } from "react-native-element-dropdown";

/*TODO: ADD VALIDATION LATER FOR EACH FIELD. CLIENT SIDE */

const TransactionModal: React.FC<{
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    theme: Theme;
    details: TransactionDateType;
}> = ({ isVisible, setIsVisible, theme, details }) => {
    const [category, setCategory] = useState<string>(details.category);
    const [tag, setTag] = useState<string | null>(details.transactionType);
    const [name, setName] = useState<string>(details.name);
    const [amount, setAmount] = useState<number>(details.amount);
    const [note, setNote] = useState<string>(details.note ?? '');

    const getTagList = (cat: string) => {
        if (cat === 'spending') return TransactionSpendingTagOptions
        else if (cat === 'income') return TransactionIncomeTagOptions
        else return TransactionInvestTagOptions
    }

    const [tagList, setTagList] = useState<{ label: string; value: string; }[]>(getTagList(category));

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}>
            <View style={[styles.centeredView]}>
                <View style={[styles.modalView, { backgroundColor: theme.colors.muted }]}>

                    {/* Close Modal Button */}
                    <View style={{ position: 'absolute', left: 10, top: 10 }}>
                        <TouchableOpacity
                            onPress={() => setIsVisible(!isVisible)}>
                            <ArrowLeft color={'grey'} width={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Category Section */}
                    <View style={styles.modalFields}>
                        <Text style={[styles.modalText, { color: theme.colors.text }]}>Category: </Text>
                        <Dropdown
                            style={[styles.dropdown]}
                            selectedTextStyle={{ color: theme.colors.text, fontSize: 14, backgroundColor: theme.colors.muted }}
                            data={TransactionCategoryOptions}
                            containerStyle={{ backgroundColor: theme.colors.card, borderRadius: 5 }}
                            itemTextStyle={{ color: theme.colors.text }}
                            labelField="label"
                            valueField="value"
                            value={category}
                            onChange={cat => {
                                setCategory(cat.value)
                                setTagList(getTagList(cat.value))
                                setTag(cat.value === details.category ? details.transactionType : null)
                            }}
                            renderItem={(item, selected) => (
                                <View style={{
                                    backgroundColor: selected ? theme.colors.muted : theme.colors.background,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    padding: 8,
                                }}>
                                    <Text style={{ color: theme.colors.text }}>{item.label}</Text>
                                </View>
                            )} />
                    </View>

                    {/* Tag Section */}
                    <View style={styles.modalFields}>
                        <Text style={[styles.modalText, { color: theme.colors.text }]}>Tag: </Text>
                        <Dropdown
                            style={[styles.dropdown]}
                            selectedTextStyle={{ color: theme.colors.text, fontSize: 14, backgroundColor: theme.colors.muted }}
                            data={tagList}
                            containerStyle={{ backgroundColor: theme.colors.card, borderRadius: 5 }}
                            itemTextStyle={{ color: theme.colors.text }}
                            labelField="label"
                            valueField="value"
                            search
                            searchPlaceholder="Search"
                            inputSearchStyle={{ color: theme.colors.text, height: 40 }}
                            placeholder="Select Tag"
                            value={tag}
                            placeholderStyle={{ color: theme.colors.textSubtle, fontSize: 14 }}
                            onChange={t => setTag(t.value)}
                            renderItem={(item, selected) => (
                                <View style={{
                                    backgroundColor: selected ? theme.colors.muted : theme.colors.background,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    padding: 8,
                                }}>
                                    <Text style={{ color: theme.colors.text }}>{item.label}</Text>
                                </View>
                            )} />
                    </View>

                    {/* Name Section */}
                    <View style={styles.modalFields}>
                        <Text style={[styles.modalText, { color: theme.colors.text }]}>Name: </Text>
                        <TextInput
                            value={name}
                            style={{ color: theme.colors.text, marginTop: 10, width: 100 }}
                            onChangeText={text => setName(text)} />
                    </View>

                    {/* Amount Section */}
                    <View style={styles.modalFields}>
                        <Text style={[styles.modalText, { color: theme.colors.text }]}>Amount: </Text>
                        <TextInput
                            keyboardType="numeric"
                            value={'$' + amount.toString()}
                            style={{ color: theme.colors.text, marginTop: 10, width: 100 }}
                            onChangeText={text => setAmount(parseFloat(text.substring(1)) || 0)} />
                    </View>

                    {/* Note Section */}
                    <View>
                        <Text style={[styles.modalText, { color: theme.colors.text }]}>Note: </Text>
                        <TextInput
                            style={{
                                marginTop: 10,
                                color: theme.colors.text,
                                width: '100%',
                                backgroundColor: theme.colors.background,
                                borderRadius: 5,
                                padding: 5,
                                height: 135
                            }}
                            multiline={true}
                            numberOfLines={5}
                            onChangeText={text => setNote(text)}
                            defaultValue={note}
                            placeholder="Type here..."
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity style={{
                        backgroundColor: theme.colors.primary,
                        borderRadius: 10,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        marginHorizontal: 'auto',
                        marginTop: 20
                    }}>
                        <Text style={{ color: theme.colors.text, textAlign: 'center', fontSize: 16 }}>Submit</Text>
                    </TouchableOpacity>
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
                <TransactionModal isVisible={isVisible} setIsVisible={setIsVisible} theme={theme} details={transaction} />
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
    const total = totals.income - totals.spending;
    return (
        <View style={[{ backgroundColor: theme.colors.muted }, styles.container]}>

            {/* Card Header */}
            <View style={[styles.header]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'rgba(255, 70, 28, 0.8)', fontSize: 20, width: 30 }}>{date.getDate()}</Text>
                    <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: 600 }}>{Days[date.getDay()]}</Text>
                </View>
                <View style={[styles.headerValues]}>
                    <Text style={[styles.headerValueItems, { color: theme.colors.investment }]}>{`$${totals.investments}`}</Text>
                    <Text style={[styles.headerValueItems, { color: theme.colors.income }]}>{`$${totals.income}`}</Text>
                    <Text style={[styles.headerValueItems, { color: theme.colors.spending }]}>{`$${totals.spending}`}</Text>
                    <Text style={[styles.headerValueItems, { color: total < 0 ? theme.colors.spending : theme.colors.income }]}>{`$${Math.abs(total)}`}</Text>
                </View>
            </View>

            {/* Transactions */}
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
    headerValueItems: {
        width: 55,
        textAlign: 'right'
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
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        paddingHorizontal: 35,
        paddingTop: 35,
        paddingBottom: 25,
        shadowRadius: 4,
        elevation: 10,
        maxHeight: '90%',
    },
    modalFields: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'rgba(128, 128, 128, 0.7)',
        paddingBottom: 5
    },
    modalText: {
        marginTop: 10,
        width: 100
    },
    dropdown: {
        marginTop: 8,
        height: 'auto',
        width: 150,
        borderColor: 'transparent',
        borderWidth: 0.5,
        paddingRight: 10,
    },
})
