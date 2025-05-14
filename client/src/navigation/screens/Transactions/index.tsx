import {
    Text,
    TouchableOpacity,
    View,
    TextInput,
} from "react-native";
import { useTheme } from "../../../theming/ThemeProvider";
import { MonthSwitcher } from "../../../components/MonthSwitcher";
import { useEffect, useRef, useState } from "react";
import { TopMenu } from "../../../components/TopMenu";
import { DailyCard } from "../../../components/DailyCard";
import {
    GestureHandlerRootView,
    ScrollView,
} from "react-native-gesture-handler";
import { MonthSummary } from "../../../components/MonthTotal";
import { PlusCircle } from "react-native-feather";
import type { Theme } from "../../../theming/types";
import CustomModal from "../../../components/CustomModal";
import { ThemedDropdown } from "../../../components/ThemedDropdown";
import type { TransactionDataType } from "../../../library/types";
import {
    TransactionCategoryOptions,
    TransactionIncomeTagOptions,
    TransactionInvestTagOptions,
    TransactionSpendingTagOptions,
} from "../../../library/constants";
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import styles from "./styles"

const data: TransactionDataType[] = [
    {
        category: "spending",
        transactionType: "Food",
        name: "Eats",
        amount: 10,
        date: new Date(),
    },
    {
        category: "income",
        transactionType: "Salary",
        name: "PHRI",
        amount: 1000,
        date: new Date(),
    },
    {
        category: "spending",
        transactionType: "Household",
        name: "Metro",
        amount: 50,
        date: new Date(),
    },
    {
        category: "investment",
        transactionType: "ETF",
        name: "VFV",
        amount: 100,
        date: new Date(),
    },
    {
        category: "spending",
        transactionType: "Entertainment",
        name: "Netflix",
        amount: 15.99,
        date: new Date("2025-03-15"),
    },
    {
        category: "income",
        transactionType: "Freelance",
        name: "Upwork",
        amount: 250,
        date: new Date("2025-04-05"),
    },
    {
        category: "spending",
        transactionType: "Transport",
        name: "Presto",
        amount: 30,
        date: new Date("2025-04-10"),
    },
    {
        category: "investment",
        transactionType: "Crypto",
        name: "Bitcoin",
        amount: 200,
        date: new Date("2025-02-20"),
    },
    {
        category: "spending",
        transactionType: "Food",
        name: "Tim Hortons",
        amount: 8.5,
        date: new Date("2025-04-02"),
    },
    {
        category: "income",
        transactionType: "Gift",
        name: "Parents",
        amount: 100,
        date: new Date("2025-01-01"),
    },
    {
        category: "spending",
        transactionType: "Utilities",
        name: "Hydro",
        amount: 60,
        date: new Date("2025-03-22"),
    },
    {
        category: "investment",
        transactionType: "Stocks",
        name: "TSLA",
        amount: 150,
        date: new Date("2025-04-18"),
    },
];

// Organizing all the data to group by date
const groupByDate = (): Map<Date, TransactionDataType[]> => {
    const map = new Map<string, { key: Date; items: TransactionDataType[] }>();
    for (const tx of data) {
        const year = tx.date.getUTCFullYear();
        const month = tx.date.getUTCMonth();
        const day = tx.date.getUTCDate();

        const normalizedKey = `${year}-${month}-${day}`;

        if (!map.has(normalizedKey)) {
            map.set(normalizedKey, { key: new Date(year, month, day), items: [] });
        }
        map.get(normalizedKey)!.items.push(tx);
    }
    const result = new Map<Date, TransactionDataType[]>();
    for (const { key, items } of map.values()) {
        result.set(key, items);
    }
    return result;
};

// This will be the Material top navigator
export const Transactions = () => {
    const { theme } = useTheme();
    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [investing, setInvestment] = useState<number>(0);
    const [spending, setSpending] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [groupedByDate, setGroupedByDate] = useState(new Map<Date, TransactionDataType[]>());
    const [sortedDateArray, setSortedDateArray] = useState<Date[]>([]);

    const prevMonth = () => {
        const newMonth = month - 1;
        if (newMonth < 0) {
            setYear(year - 1);
        }
        setMonth(((newMonth % 12) + 12) % 12);
    };

    const nextMonth = () => {
        const newMonth = month + 1;
        if (newMonth > 11) {
            setYear(year + 1);
        }
        setMonth(((newMonth % 12) + 12) % 12);
    };

    const setAmounts = () => {
        console.log("set amounts")
        let totalInvestment = 0;
        let totalSpending = 0;
        let totalIncome = 0;
        for (const d of sortedDateArray) {
            if (d.getMonth() === month && d.getFullYear() === year) {
                const transactions = groupedByDate.get(d);
                if (transactions) {
                    for (const t of transactions) {
                        if (t.category === "spending") totalSpending += t.amount;
                        else if (t.category === "investment") totalInvestment += t.amount;
                        else totalIncome += t.amount;
                    }
                }
            }
        }
        setSpending(totalSpending);
        setInvestment(totalInvestment);
        setIncome(totalIncome);
    };

    const hasInitialized = useRef<boolean>(false);

    /* Setting date groups */
    useEffect(() => {
        const grouped = groupByDate();
        setGroupedByDate(grouped);

        const sorted = Array.from(grouped.keys()).sort((a, b) => b.getTime() - a.getTime());
        setSortedDateArray(sorted);
    }, [data]);

    /* Setting total amounts each time months or data changes */
    useEffect(() => {
        if (!hasInitialized.current) {
            if (groupedByDate.size > 0) {
                setAmounts();
                hasInitialized.current = true;
            }
        } else {
            setAmounts();
        }
    }, [month, year, groupedByDate]);

    return (
        <View
            style={[styles.container, { backgroundColor: theme.colors.background }]}
        >
            {/* Tob Bar */}
            <TopMenu>
                <MonthSwitcher
                    month={month}
                    prevMonth={prevMonth}
                    nextMonth={nextMonth}
                    year={year}
                />
                <MonthSummary amounts={{ investing, income, spending }} />
            </TopMenu>

            {/* Daily Transaction Cards Per Month */}
            <GestureHandlerRootView>
                <ScrollView style={{ padding: 10 }}>
                    {sortedDateArray.map((val, idx) => {
                        return val.getMonth() === month && val.getFullYear() === year ? (
                            <DailyCard
                                key={idx}
                                transactions={groupedByDate.get(val) || []}
                                date={val}
                            />
                        ) : null;
                    })}
                </ScrollView>
            </GestureHandlerRootView>

            {/* Add transaction button */}
            <TouchableOpacity
                style={{
                    position: "absolute",
                    right: 10,
                    bottom: 10,
                }}
                onPress={() => setIsVisible(true)}
            >
                <PlusCircle
                    fill={theme.colors.secondary}
                    color={theme.colors.background}
                    width={50}
                    height={50}
                />
            </TouchableOpacity>
            <AddTransactionModal
                isVisible={isVisible}
                setIsVisible={setIsVisible}
                theme={theme}
            />
        </View>
    );
};

const AddTransactionModal: React.FC<{
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    theme: Theme;
}> = ({ isVisible, setIsVisible, theme }) => {
    const [category, setCategory] = useState<string>("spending");
    const [tag, setTag] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [note, setNote] = useState<string>("");

    const [date, setDate] = useState<Date>(new Date());
    const [open, setOpen] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false)

    const getTagList = (cat: string) => {
        if (cat === "spending") return TransactionSpendingTagOptions;
        else if (cat === "income") return TransactionIncomeTagOptions;
        else return TransactionInvestTagOptions;
    };

    const [tagList, setTagList] = useState<{ label: string; value: string }[]>(
        getTagList(category),
    );

    const getFormattedDate = (d: Date) => {
        return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
    }

    const getFormattedTime = (d: Date) => {
        return `${d.getHours()}:${d.getMinutes()}`
    }

    return (
        <CustomModal
            isVisible={isVisible}
            setIsVisible={setIsVisible}
            theme={theme}
        >
            {/* Date Section */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>Date:</Text>
                <TouchableOpacity style={{ marginTop: 10, width: "30%" }}
                    onPress={() => {
                        setOpen(true);
                    }}>
                    <Text style={{ color: theme.colors.text }}>
                        {getFormattedDate(date)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 10 }}
                    onPress={() => {
                        setVisible(true);
                    }}>
                    <Text style={{ color: theme.colors.text }}>
                        {getFormattedTime(date)}
                    </Text>
                </TouchableOpacity>
            </View>
            <DatePickerModal
                locale="en"
                mode="single"
                visible={open}
                onDismiss={() => {
                    setOpen(false);
                }}
                date={date}
                onConfirm={(params) => {
                    setOpen(false);
                    if (params.date) {
                        setDate(params.date);
                    }
                }}
                validRange={{
                    endDate: (() => {
                        const d = new Date();
                        return new Date(d.getFullYear(), d.getMonth() + 1, 0);
                    })()
                }}
                label="Select Date"
                presentationStyle="pageSheet"
            />
            <TimePickerModal
                visible={visible}
                onDismiss={() => {
                    setVisible(false);
                }}
                onConfirm={({ hours, minutes }) => {
                    setVisible(false);
                    const d = date;
                    d.setHours(hours);
                    d.setMinutes(minutes);
                    setDate(d);
                }}
            />
            {/* Category Section */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>
                    Category:{" "}
                </Text>
                <ThemedDropdown
                    theme={theme}
                    data={TransactionCategoryOptions}
                    value={category}
                    onChange={(cat) => {
                        setCategory(cat.value);
                        setTagList(getTagList(cat.value));
                        setTag("");
                    }}
                />
            </View>

            {/* Tag Section */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>
                    Tag:{" "}
                </Text>
                <ThemedDropdown
                    data={tagList}
                    search={true}
                    searchPlaceholder="Search"
                    onChange={(t) => setTag(t.value)}
                    theme={theme}
                    value={tag}
                    placeholder="Select Tag"
                />
            </View>

            {/* Name Section */}
            <View style={styles.modalFields}>
                <Text style={[styles.modalText, { color: theme.colors.text }]}>
                    Name:{" "}
                </Text>
                <TextInput
                    value={name}
                    style={{ color: theme.colors.text, width: 140, marginBottom: -7, }}
                    onChangeText={(text) => setName(text)}
                />
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
                    style={{ color: theme.colors.text, width: 140, marginBottom: -7 }}
                    onChangeText={(text) => setAmount(Number(text))}
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
                    }}
                    multiline={true}
                    numberOfLines={5}
                    onChangeText={(text) => setNote(text)}
                    defaultValue={note}
                    placeholder="Type here..."
                    placeholderTextColor={theme.colors.textSubtle}
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
                    data.push({
                        category,
                        transactionType: tag,
                        name,
                        amount,
                        date: new Date(),
                    })
                    setIsVisible(false);
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
