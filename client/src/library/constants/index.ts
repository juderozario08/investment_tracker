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
    { label: "ETF", value: "ETF" },
    { label: "Stock", value: "Stock" },
    { label: "Crypto", value: "Crypto" },
    { label: "Savings", value: "Savings" }
];

// NOTE: THIS IS SUPER TEMPORARY AND WILL BE REMOVED ONCE THE TESTING IS DONE
export const DATA: TransactionDataType[] = [
    {
        id: 0,
        category: "spending",
        tag: "Food",
        name: "Eats",
        amount: "10",
        date: new Date(),
    },
    {
        id: 1,
        category: "income",
        tag: "Salary",
        name: "PHRI",
        amount: "1000",
        date: new Date(),
    },
    {
        id: 2,
        category: "spending",
        tag: "Household",
        name: "Metro",
        amount: "50",
        date: new Date(),
    },
    {
        id: 3,
        category: "investment",
        tag: "ETF",
        name: "VFV",
        amount: "100",
        date: new Date(),
    },
    {
        id: 4,
        category: "spending",
        tag: "Entertainment",
        name: "Netflix",
        amount: "15.99",
        date: new Date("2025-03-15"),
    },
    {
        id: 5,
        category: "income",
        tag: "Freelance",
        name: "Upwork",
        amount: "250",
        date: new Date("2025-04-05"),
    },
    {
        id: 6,
        category: "spending",
        tag: "Transport",
        name: "Presto",
        amount: "30",
        date: new Date("2025-04-10"),
    },
    {
        id: 7,
        category: "investment",
        tag: "Crypto",
        name: "Bitcoin",
        amount: "200",
        date: new Date("2025-02-20"),
    },
    {
        id: 8,
        category: "spending",
        tag: "Food",
        name: "Tim Hortons",
        amount: "8.5",
        date: new Date("2025-04-02"),
    },
    {
        id: 9,
        category: "income",
        tag: "Gift",
        name: "Parents",
        amount: "100",
        date: new Date("2025-01-01"),
    },
    {
        id: 10,
        category: "spending",
        tag: "Utilities",
        name: "Hydro",
        amount: "60",
        date: new Date("2025-03-22"),
    },
    {
        id: 11,
        category: "investment",
        tag: "Stock",
        name: "TSLA",
        amount: "150",
        date: new Date("2025-04-18"),
    },
]

export const DefaultTransactionValues: TransactionDataType = {
    id: DATA.length,
    category: "spending",
    tag: "",
    name: "",
    amount: "0",
    date: new Date(),
    note: ''
}

