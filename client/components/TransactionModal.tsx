/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import { TransactionCategoryOptions, TransactionIncomeTagOptions, TransactionInvestTagOptions, TransactionSpendingTagOptions } from '../library/constants';
import { ThemedModal } from './ThemedModal';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { ThemedDropdown } from './ThemedDropdown';
import { validateAmount, validateCategory, validateName, validateTag } from '../library/validation';
import { DropdownMenuType, IncomeTagTypes, InvestmentTagTypes, SpendingTagTypes, TransactionDataType } from '../library/types';
import { useTheme } from '../theming';
import { FadingPressable } from './FadingPressable';
import { Calendar } from 'react-native-feather';
import { ThemedText } from './ThemedText';
import { NativeCalendarModeSingle } from './NativeCalendar';
import { DateType } from 'react-native-ui-datepicker';

interface TransactionModalProps {
    isVisibleState: [boolean, React.Dispatch<SetStateAction<boolean>>];
    transactionState: [TransactionDataType, React.Dispatch<SetStateAction<TransactionDataType>>];
    onSubmit: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    isVisibleState,
    transactionState,
    onSubmit,
}) => {
    const theme = useTheme();

    const [isVisible, setIsVisible] = isVisibleState;
    const [details, setDetails] = transactionState;

    const [visible, setVisible] = useState(false);

    const [errors, setErrors] = useState({
        category: true,
        tag: true,
        name: true,
        amount: true,
    });

    const tagList = useMemo((): DropdownMenuType<SpendingTagTypes | InvestmentTagTypes | IncomeTagTypes>[] => {
        if (details.category === 'spending') { return TransactionSpendingTagOptions; }
        if (details.category === 'income') { return TransactionIncomeTagOptions; }
        return TransactionInvestTagOptions;
    }, [details.category]);

    const handleUpdate = (key: keyof TransactionDataType, value: any) => {
        setDetails((prev) => ({ ...prev, [key]: value }));
    };

    const handleValidation = (key: keyof typeof errors, isValid: boolean) => {
        setErrors((prev) => ({ ...prev, [key]: isValid }));
    };

    const getFormattedDate = (d: Date) => `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

    useEffect(() => {
        handleUpdate('tag', details.tag);
    }, [tagList]);

    const [modalDate, setModalDate] = useState<DateType>();

    useEffect(() => {
        setModalDate(details.date);
    }, [details.date]);

    return (
        <ThemedModal isVisible={isVisible} setIsVisible={setIsVisible}>
            {/* Date & Time Section */}
            <View style={styles.modalFields}>
                <ThemedText style={styles.modalText}>Date:</ThemedText>
                <FadingPressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { setVisible(true); }}>
                    <Text style={{ color: theme.colors.text, marginRight: 10, marginTop: 5 }}>{getFormattedDate(details.date)}</Text>
                    <Calendar color={'gray'} />
                </FadingPressable>
                <NativeCalendarModeSingle
                    modalDate={modalDate}
                    setModalDate={setModalDate}
                    isVisible={visible}
                    setIsVisible={setVisible}
                    onPressCancel={() => {
                        setVisible(false);
                    }}
                    onPressSubmit={() => {
                        if (modalDate) {
                            handleUpdate('date', new Date(modalDate.toString()));
                        }
                        setVisible(false);
                    }} />
            </View>

            {/* Category Dropdown */}
            <View style={styles.modalFields}>
                <ThemedText style={styles.modalText}>Category:</ThemedText>
                <ThemedDropdown
                    data={TransactionCategoryOptions}
                    value={details.category}
                    onChange={(cat) => {
                        const value = cat.value;
                        handleValidation('category', validateCategory(value));
                        handleUpdate('category', value);
                    }}

                    style={{ width: 150 }}
                />
            </View>

            {/* Tag Dropdown */}
            <View style={styles.modalFields}>
                <ThemedText style={[styles.modalText]}>Tag:</ThemedText>
                <ThemedDropdown
                    data={tagList}
                    search
                    searchPlaceholder="Search"
                    value={details.tag}
                    onChange={(tag) => {
                        const value = tag.value;
                        handleValidation('tag', validateTag(value));
                        handleUpdate('tag', value);
                    }}
                    placeholder="Select Tag"
                />
            </View>

            {/* Name Input */}
            <View style={styles.modalFields}>
                <ThemedText style={styles.modalText}>Name:</ThemedText>
                <TextInput
                    value={details.name}

                    style={{ color: theme.colors.text, width: 140, marginBottom: -7, paddingHorizontal: 0 }}
                    onChangeText={(text) => {
                        handleValidation('name', validateName(text));
                        handleUpdate('name', text);
                    }}
                />
            </View>

            {/* Amount Input */}
            <View style={styles.modalFields}>
                <ThemedText style={styles.modalText}>Amount:</ThemedText>
                {}
                {details.amount && <ThemedText style={{ marginTop: 10 }}>$</ThemedText>}
                <TextInput
                    keyboardType="numeric"
                    value={details.amount}
                    placeholder="Enter Amount"
                    placeholderTextColor={theme.colors.textSubtle}

                    style={{ color: theme.colors.text, width: 140, marginBottom: -7 }}
                    onChangeText={(amount) => {
                        handleValidation('amount', validateAmount(amount));
                        handleUpdate('amount', amount);
                    }}
                />
            </View>

            {/* Note Input */}
            <View>
                <ThemedText style={styles.modalText}>Note:</ThemedText>
                <TextInput

                    style={{
                        marginTop: 10,
                        color: theme.colors.text,
                        width: '100%',
                        backgroundColor: theme.colors.background,
                        borderRadius: 5,
                        padding: 5,
                    }}
                    multiline
                    numberOfLines={5}
                    onChangeText={(text) => handleUpdate('note', text)}
                    defaultValue={details.note}
                    placeholder="Type here..."
                    placeholderTextColor={theme.colors.textSubtle}
                />
            </View>

            {/* Errors */}

            {/* Submit Button */}
            <FadingPressable

                style={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: 10,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginHorizontal: 'auto',
                    marginTop: 20,
                }}
                onPress={onSubmit}
            >
                <ThemedText

                    style={{ textAlign: 'center', fontSize: 16 }}>
                    Submit
                </ThemedText>
            </FadingPressable>
        </ThemedModal>
    );
};

const styles = StyleSheet.create({
    modalFields: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'rgba(128, 128, 128, 0.7)',
        paddingBottom: 5,
    },
    modalText: {
        marginTop: 10,
        width: 100,
    },
});
