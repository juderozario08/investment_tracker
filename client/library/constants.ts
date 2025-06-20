import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import type { DropdownMenuType, TransactionDataType } from "./types";

export const Months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export const Days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const TransactionCategoryOptions: DropdownMenuType<string>[] = [
    { label: "Income", value: "income" },
    { label: "Spending", value: "spending" },
    { label: "Investment", value: "investment" },
];

export const TransactionSpendingTagOptions: DropdownMenuType<string>[] = [
    { label: "Food", value: "Food" },
    { label: "Household", value: "Household" },
    { label: "Transport", value: "Transport" },
    { label: "Bills & Utilities", value: "Bills & Utilities" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Hobby", value: "Hobby" },
    { label: "Gift", value: "Gift" },
    { label: "Hobby", value: "Hobby" },
    { label: "Other", value: "Other" },
];

export const TransactionIncomeTagOptions: DropdownMenuType<string>[] = [
    { label: "Salary", value: "Salary" },
    { label: "Freelance", value: "Freelance" },
    { label: "Allowance", value: "Allowance" },
    { label: "Refunds", value: "Refunds" },
    { label: "Gift", value: "Gift" },
    { label: "Other", value: "Other" },
];

export const TransactionInvestTagOptions: DropdownMenuType<string>[] = [
    { label: "ETF", value: "ETF" },
    { label: "Stock", value: "Stock" },
    { label: "Crypto", value: "Crypto" },
    { label: "Savings", value: "Savings" }
];

export const getDefaultTransactionValue = (date: Date): TransactionDataType => {
    const d = new Date(date.getFullYear(), date.getMonth(), new Date().getDate());
    return {
        id: uuidv4(),
        category: "spending",
        tag: "",
        name: "",
        amount: "",
        date: d,
        note: ''
    }
}
