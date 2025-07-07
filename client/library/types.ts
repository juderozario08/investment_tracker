export interface DropdownMenuType<T> {
    label: string | number;
    value: T;
}

export interface TransactionDataType {
    id: string;
    category: string;
    tag: SpendingTagTypes | InvestmentTagTypes | IncomeTagTypes;
    name: string;
    amount: string;
    date: Date;
    note?: string;
}

export type CategoryTypes = "income" | "spending" | "investment";
export type SpendingTagTypes = "Food" | "Household" | "Transport" | "Bills & Utilities" | "Entertainment" | "Hobby" | "Gift" | "Other";
export type IncomeTagTypes = "Salary" | "Allowance" | "Freelance" | "Refunds" | "Gift" | "Other";
export type InvestmentTagTypes = "ETF" | "Stock" | "Crypto" | "Savings";
