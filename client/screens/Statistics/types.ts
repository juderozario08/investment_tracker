import { pieDataItem } from 'react-native-gifted-charts';
import { CategoryTypes, IncomeTagTypes, InvestmentTagTypes, SpendingTagTypes, TransactionDataType } from '../../library/types';

export type RangeTypes = 'Daily' | 'Weekly' | 'Monthly' | 'YTD' | 'Yearly' | 'Range';

export interface GroupType<T> {
    amount: number;
    data: T[];
    label?: string;
}

export type TransactionGroupType = GroupType<TransactionDataType>;

export type AmountBreakdownType = {
    income: TransactionGroupType;
    spending: TransactionGroupType;
    investment: TransactionGroupType;
}

export type PieDataItemWithLabelType = {
    label: CategoryTypes | SpendingTagTypes | InvestmentTagTypes | IncomeTagTypes;
    item: pieDataItem;
}

