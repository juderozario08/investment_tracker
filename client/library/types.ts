import { ChartTypes } from './enums';

export interface DropdownMenuType<T> {
    label: string | number;
    value: T;
}

export interface TransactionDataType {
    id: string;
    category: CategoryTypes;
    tag: SpendingTagTypes | InvestmentTagTypes | IncomeTagTypes;
    name: string;
    amount: string;
    date: Date;
    note?: string;
}

export type AllTagTypes = CategoryTypes | SpendingTagTypes | IncomeTagTypes | InvestmentTagTypes;
export type CategoryTypes = 'income' | 'spending' | 'investment';
export type SpendingTagTypes = 'Food' | 'Household' | 'Transport' | 'Bills & Utilities' | 'Entertainment' | 'Hobby' | 'Gift' | 'Other';
export type IncomeTagTypes = 'Salary' | 'Allowance' | 'Freelance' | 'Refunds' | 'Gift' | 'Other';
export type InvestmentTagTypes = 'ETF' | 'Stock' | 'Crypto' | 'Savings';
export type ChartTypeNames = keyof typeof ChartTypes;
