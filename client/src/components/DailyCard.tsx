import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../theming/ThemeProvider";
import {
    Days,
    TransactionCategoryOptions,
    TransactionIncomeTagOptions,
    TransactionInvestTagOptions,
    TransactionSpendingTagOptions,
} from "../library/constants";
import type { TransactionDataType } from "../library/types";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import type { Theme } from "../theming/types";
import { TextInput } from "react-native-gesture-handler";
import CustomModal from "./CustomModal";
import { ThemedDropdown } from "./ThemedDropdown";
import {
    validateAmount,
    validateCategory,
    validateName,
    validateTag,
} from "../library/validation";
import { CheckCircle, XCircle } from "react-native-feather";

const TransactionModal: React.FC<{
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    theme: Theme;
    details: TransactionDataType;
}> = ({ isVisible, setIsVisible, theme, details }) => {
    const [category, setCategory] = useState<string>(details.category);
    const [tag, setTag] = useState<string | null>(details.transactionType);
    const [name, setName] = useState<string>(details.name);
    const [amount, setAmount] = useState<number>(details.amount);
    const [note, setNote] = useState<string>(details.note ?? "");

    const [isValidCategory, setIsValidCategory] = useState<boolean>(false);
    const [isValidTag, setIsValidTag] = useState<boolean>(false);
    const [isValidName, setIsValidName] = useState<boolean>(false);
    const [isValidAmount, setIsValidAmount] = useState<boolean>(false);

    const getTagList = (cat: string) => {
        if (cat === "spending") return TransactionSpendingTagOptions;
        else if (cat === "income") return TransactionIncomeTagOptions;
        else return TransactionInvestTagOptions;
    };

    const [tagList, setTagList] = useState<{ label: string; value: string }[]>(
        getTagList(category),
    );

    return (
        <CustomModal
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            theme={theme}
        >
            {/* Category Section */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>
                    Category:{" "}
                </Text>
                <ThemedDropdown
                    data={TransactionCategoryOptions}
                    value={category}
                    onChange={(cat) => {
                        setIsValidCategory(validateCategory(cat.value));
                        setCategory(cat.value);
                        setTagList(getTagList(cat.value));
                        setTag(
                            cat.value === details.category ? details.transactionType : null,
                        );
                    }}
                    theme={theme}
                />
            </View>

            {/* Tag Section */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>
                    Tag:{" "}
                </Text>
                <ThemedDropdown
                    data={tagList}
                    search
                    searchPlaceholder="Search"
                    placeholder="Select Tag"
                    value={tag}
                    onChange={(t) => {
                        setIsValidTag(validateTag(t.value));
                        setTag(t.value);
                    }}
                    theme={theme}
                />
            </View>

            {/* Name Section */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>
                    Name:{" "}
                </Text>
                <TextInput
                    value={name}
                    style={{ color: theme.colors.text, marginTop: 10, width: "44%" }}
                    onChangeText={(text) => {
                        setIsValidName(validateName(text));
                        setName(text);
                    }}
                />
                {name ? (
                    !isValidName ? (
                        <XCircle
                            color={"red"}
                            width={15}
                            style={{
                                marginTop: 10,
                                marginLeft: 12,
                                backgroundColor: "white",
                            }}
                        />
                    ) : (
                        <CheckCircle color={"green"} width={15} style={{ marginTop: 10 }} />
                    )
                ) : null}
            </View>

            {/* Amount Section */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>
                    Amount:{" "}
                </Text>
                <Text style={{ color: theme.colors.text, marginTop: 10 }}>$</Text>
                <TextInput
                    keyboardType="numeric"
                    value={amount.toString()}
                    placeholder="Enter amount"
                    style={{ color: theme.colors.text, marginTop: 10, width: "50%" }}
                    onChangeText={(amnt) => {
                        const x = Number(amnt);
                        setIsValidAmount(validateAmount(x));
                        setAmount(x);
                    }}
                />
            </View>

            {/* Note Section */}
            <View>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>
                    Note:{" "}
                </Text>
                <TextInput
                    style={{
                        marginTop: 10,
                        color: theme.colors.text,
                        width: "100%",
                        backgroundColor: theme.colors.background,
                        borderRadius: 5,
                        padding: 5,
                        height: 135,
                    }}
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={(text) => setNote(text)}
                    defaultValue={note}
                    placeholder="Type here..."
                />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                style={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginHorizontal: "auto",
                    marginTop: 20,
                }}
                onPress={() => {
                    if (isValidCategory && isValidName && isValidTag && isValidAmount) {
                        // NOTE: DO SOMETHING HERE WITH THE SUBMISSION OF THE UPDATE
                    }
                }}
            >
                <Text
                    style={{
                        color: theme.colors.text,
                        textAlign: "center",
                        fontSize: 16,
                    }}
                >
                    Submit
                </Text>
            </TouchableOpacity>
        </CustomModal>
    );
};

export const DailyCard: React.FC<{
    transactions: TransactionDataType[];
    date: Date;
}> = ({ transactions, date }) => {
    const { theme } = useTheme();
    const totals = transactions.reduce(
        (acc, transaction) => {
            if (transaction.category === "income") acc.income += transaction.amount;
            if (transaction.category === "spending")
                acc.spending += transaction.amount;
            if (transaction.category === "investment")
                acc.investments += transaction.amount;
            return acc;
        },
        { income: 0, spending: 0, investments: 0 },
    );
    const total = totals.income - totals.spending;

    const [isVisible, setIsVisible] = useState<boolean>(false);

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
                    <SafeAreaProvider key={idx}>
                        <SafeAreaView>
                            <TransactionModal
                                isVisible={isVisible}
                                setIsVisible={setIsVisible}
                                theme={theme}
                                details={transaction}
                            />
                            <TouchableOpacity
                                style={[styles.transaction, { paddingRight: 5 }]}
                                onPress={() => setIsVisible(true)}
                            >
                                <View style={{ flexDirection: "row", gap: 10, paddingLeft: 5 }}>
                                    <Text style={[{ color: theme.colors.text, width: 100 }]}>
                                        {transaction.transactionType}
                                    </Text>
                                    <Text style={[{ color: theme.colors.text, width: 100 }]}>
                                        {transaction.name}
                                    </Text>
                                </View>
                                <Text
                                    style={[{ color: theme.colors[transaction.category] }]}
                                >{`$${transaction.amount}`}</Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </SafeAreaProvider>
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
