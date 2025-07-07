import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import type { CategoryTypes, DropdownMenuType, IncomeTagTypes, InvestmentTagTypes, SpendingTagTypes, TransactionDataType } from "./types";

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

export const TransactionCategoryOptions: DropdownMenuType<CategoryTypes>[] = [
    { label: "Income", value: "income" },
    { label: "Spending", value: "spending" },
    { label: "Investment", value: "investment" },
];

export const TransactionSpendingTagOptions: DropdownMenuType<SpendingTagTypes>[] = [
    { label: "Food", value: "Food" },
    { label: "Household", value: "Household" },
    { label: "Transport", value: "Transport" },
    { label: "Bills & Utilities", value: "Bills & Utilities" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Hobby", value: "Hobby" },
    { label: "Gift", value: "Gift" },
    { label: "Other", value: "Other" },
];

export const TransactionIncomeTagOptions: DropdownMenuType<IncomeTagTypes>[] = [
    { label: "Salary", value: "Salary" },
    { label: "Freelance", value: "Freelance" },
    { label: "Allowance", value: "Allowance" },
    { label: "Refunds", value: "Refunds" },
    { label: "Gift", value: "Gift" },
    { label: "Other", value: "Other" },
];

export const TransactionInvestTagOptions: DropdownMenuType<InvestmentTagTypes>[] = [
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
        tag: "Other",
        name: "",
        amount: "",
        date: d,
        note: ''
    }
}

export const chartColors = {
    // Categories
    "income": "#009FFF",
    "incomeGradient": "#006DFF",
    "spending": "#FFA5BA",
    "spendingGradient": "#FF7F97",
    "investment": "#B38BFF",
    "investmentGradient": "#9B5DE5",

    // Spending tags
    "Food": "#FF9F1C",
    "FoodGradient": "#FF7C00",
    "Household": "#B5E48C",
    "HouseholdGradient": "#99D98C",
    "Transport": "#6A4C93",
    "TransportGradient": "#8E6BB4",
    "Bills & Utilities": "#80CED7",
    "Bills & UtilitiesGradient": "#4DB8C4",
    "Entertainment": "#FF6F91",
    "EntertainmentGradient": "#FF4D6D",
    "Hobby": "#F3CA40",
    "HobbyGradient": "#F9A620",
    "Gift": "#F15BB5",
    "GiftGradient": "#FF85C1",
    "Other": "#A0C4FF",
    "OtherGradient": "#89B6FF",

    // Income tags
    "Salary": "#00BBF9",
    "SalaryGradient": "#0096C7",
    "Freelance": "#3F88C5",
    "FreelanceGradient": "#2667A0",
    "Allowance": "#AACC00",
    "AllowanceGradient": "#94C600",
    "Refunds": "#FFBC42",
    "RefundsGradient": "#FFA600",

    // Investment tags
    "ETF": "#845EC2",
    "ETFGradient": "#7A57D1",
    "Stock": "#00C9A7",
    "StockGradient": "#00B29B",
    "Crypto": "#FF5E5B",
    "CryptoGradient": "#FF3B30",
    "Savings": "#4D96FF",
    "SavingsGradient": "#256DFF"
};
