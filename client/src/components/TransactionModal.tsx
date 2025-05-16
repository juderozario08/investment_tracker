import { SetStateAction, useEffect, useMemo, useState } from "react";
import { Theme } from "../theming/types";
import {
    TransactionCategoryOptions,
    TransactionIncomeTagOptions,
    TransactionInvestTagOptions,
    TransactionSpendingTagOptions,
} from "../library/constants";
import ThemedModal from "./ThemedModal";
import { View, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
import { SingleDatePicker } from "./SingleDatePicker";
import { ThemedDropdown } from "./ThemedDropdown";
import {
    validateAmount,
    validateCategory,
    validateName,
    validateTag,
} from "../library/validation";
import { TransactionDataType } from "../library/types";
import { TimePicker } from "./TimePicker";

interface TransactionModalProps {
    theme: Theme;
    isVisibleState: [boolean, React.Dispatch<SetStateAction<boolean>>];
    detailsState: [TransactionDataType, React.Dispatch<SetStateAction<TransactionDataType>>];
    onSubmit: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    theme,
    isVisibleState,
    detailsState,
    onSubmit,
}) => {
    const [isVisible, setIsVisible] = isVisibleState;
    const [details, setDetails] = detailsState;

    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    const [errors, setErrors] = useState({
        category: true,
        tag: true,
        name: true,
        amount: true,
    });

    const tagList = useMemo(() => {
        if (details.category === "spending") return TransactionSpendingTagOptions;
        if (details.category === "income") return TransactionIncomeTagOptions;
        return TransactionInvestTagOptions;
    }, [details.category]);

    const handleUpdate = (key: keyof TransactionDataType, value: any) => {
        setDetails((prev) => ({ ...prev, [key]: value }));
    };

    const handleValidation = (key: keyof typeof errors, isValid: boolean) => {
        setErrors((prev) => ({ ...prev, [key]: isValid }));
    };

    const getFormattedDate = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    const getFormattedTime = (d: Date) => `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;

    useEffect(() => {
        handleUpdate("tag", details.tag);
    }, [details.category, tagList]);

    return (
        <ThemedModal isVisible={isVisible} setIsVisible={setIsVisible} theme={theme}>
            {/* Date & Time Section */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>Date:</Text>
                <TouchableOpacity style={{ marginTop: 10, marginRight: 5 }} onPress={() => setOpen(true)}>
                    <Text style={{ color: theme.colors.text }}>{getFormattedDate(details.date)}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 10, marginLeft: 5 }} onPress={() => setVisible(true)}>
                    <Text style={{ color: theme.colors.text }}>{getFormattedTime(details.date)}</Text>
                </TouchableOpacity>
                <SingleDatePicker
                    visible={open}
                    setOpen={setOpen}
                    setDate={(val: Date) => handleUpdate("date", val)}
                    date={details.date}
                />
                <TimePicker
                    visible={visible}
                    setVisible={setVisible}
                    date={details.date}
                    setDate={(val: Date) => handleUpdate("date", val)}
                />
            </View>

            {/* Category Dropdown */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>Category:</Text>
                <ThemedDropdown
                    theme={theme}
                    data={TransactionCategoryOptions}
                    value={details.category}
                    onChange={(cat) => {
                        const value = cat.value;
                        handleValidation("category", validateCategory(value));
                        handleUpdate("category", value);
                    }}
                />
            </View>

            {/* Tag Dropdown */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>Tag:</Text>
                <ThemedDropdown
                    data={tagList}
                    search
                    searchPlaceholder="Search"
                    value={details.tag}
                    onChange={(tag) => {
                        const value = tag.value;
                        handleValidation("tag", validateTag(value));
                        handleUpdate("tag", value);
                    }}
                    theme={theme}
                    placeholder="Select Tag"
                />
            </View>

            {/* Name Input */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>Name:</Text>
                <TextInput
                    value={details.name}
                    style={{ color: theme.colors.text, width: 140, marginBottom: -7, paddingHorizontal: 0 }}
                    onChangeText={(text) => {
                        handleValidation("name", validateName(text));
                        handleUpdate("name", text);
                    }}
                />
            </View>

            {/* Amount Input */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>Amount:</Text>
                {details.amount && <Text style={{ color: theme.colors.text, marginTop: 10 }}>$</Text>}
                <TextInput
                    keyboardType="numeric"
                    value={details.amount}
                    placeholder="Enter Amount"
                    placeholderTextColor={theme.colors.textSubtle}
                    style={{ color: theme.colors.text, width: 140, marginBottom: -7 }}
                    onChangeText={(amount) => {
                        handleValidation("amount", validateAmount(amount));
                        handleUpdate("amount", amount);
                    }}
                />
            </View>

            {/* Note Input */}
            <View>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>Note:</Text>
                <TextInput
                    style={{
                        marginTop: 10,
                        color: theme.colors.text,
                        width: "100%",
                        backgroundColor: theme.colors.background,
                        borderRadius: 5,
                        padding: 5,
                    }}
                    multiline
                    numberOfLines={5}
                    onChangeText={(text) => handleUpdate("note", text)}
                    defaultValue={details.note}
                    placeholder="Type here..."
                    placeholderTextColor={theme.colors.textSubtle}
                />
            </View>

            {/* Errors */}
            {!errors.category && details.category && (
                <Text style={{ color: "red" }}>Check category</Text>
            )}
            {!errors.tag && details.tag && <Text style={{ color: "red" }}>Check tag</Text>}
            {!errors.name && details.name && <Text style={{ color: "red" }}>Check name</Text>}
            {!errors.amount && details.amount && <Text style={{ color: "red" }}>Check amount</Text>}

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
                onPress={onSubmit}
            >
                <Text style={{ color: theme.colors.text, textAlign: "center", fontSize: 16 }}>
                    Submit
                </Text>
            </TouchableOpacity>
        </ThemedModal>
    );
};

const styles = StyleSheet.create({
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
});
