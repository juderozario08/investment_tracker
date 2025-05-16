import type { DropdownMenuType, TransactionDataType } from "../types";

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

export const TransactionCategoryOptions: DropdownMenuType[] = [
    { label: "Income", value: "income" },
    { label: "Spending", value: "spending" },
    { label: "Investment", value: "investment" },
];

export const TransactionSpendingTagOptions: DropdownMenuType[] = [
    { label: "Food", value: "Food" },
    { label: "Household", value: "Household" },
    { label: "Transport", value: "Transport" },
    { label: "Bills and Utilities", value: "Bills and Utilities" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Hobby", value: "Hobby" },
    { label: "Gift", value: "Gift" },
    { label: "Hobby", value: "Hobby" },
    { label: "Other", value: "Other" },
];

export const TransactionIncomeTagOptions: DropdownMenuType[] = [
    { label: "Salary", value: "Salary" },
    { label: "Freelance", value: "Freelance" },
    { label: "Allowance", value: "Allowance" },
    { label: "Refunds", value: "Refunds" },
    { label: "Gift", value: "Gift" },
    { label: "Other", value: "Other" },
];

export const TransactionInvestTagOptions: DropdownMenuType[] = [
    { label: "ETF", value: "etf" },
    { label: "Stock", value: "stock" },
    { label: "Crypto", value: "crypto" },
    { label: "Stock", value: "stock" },
];

export const DefaultTransactionValues: TransactionDataType = {
    category: "spending",
    tag: "",
    name: "",
    amount: "0",
    date: new Date(),
    note: ''
}
