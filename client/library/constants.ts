import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import type { CategoryTypes, DropdownMenuType, IncomeTagTypes, InvestmentTagTypes, SpendingTagTypes, TransactionDataType } from './types';

export const Months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

export const Days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const TransactionCategoryOptions: DropdownMenuType<CategoryTypes>[] = [
    { label: 'Income', value: 'income' },
    { label: 'Spending', value: 'spending' },
    { label: 'Investment', value: 'investment' },
];

export const TransactionSpendingTagOptions: DropdownMenuType<SpendingTagTypes>[] = [
    { label: 'Food', value: 'Food' },
    { label: 'Household', value: 'Household' },
    { label: 'Transport', value: 'Transport' },
    { label: 'Bills & Utilities', value: 'Bills & Utilities' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Hobby', value: 'Hobby' },
    { label: 'Gift', value: 'Gift' },
    { label: 'Other', value: 'Other' },
];

export const TransactionIncomeTagOptions: DropdownMenuType<IncomeTagTypes>[] = [
    { label: 'Salary', value: 'Salary' },
    { label: 'Freelance', value: 'Freelance' },
    { label: 'Allowance', value: 'Allowance' },
    { label: 'Refunds', value: 'Refunds' },
    { label: 'Gift', value: 'Gift' },
    { label: 'Other', value: 'Other' },
];

export const TransactionInvestTagOptions: DropdownMenuType<InvestmentTagTypes>[] = [
    { label: 'ETF', value: 'ETF' },
    { label: 'Stock', value: 'Stock' },
    { label: 'Crypto', value: 'Crypto' },
    { label: 'Savings', value: 'Savings' },
];

export const getDefaultTransactionValue = (date: Date): TransactionDataType => {
    const d = new Date(date.getFullYear(), date.getMonth(), new Date().getDate());
    return {
        id: uuidv4(),
        category: 'spending',
        tag: 'Other',
        name: '',
        amount: '',
        date: d,
        note: '',
    };
};

export const ChartColors = {
    // Categories
    'income': '#009FFF',
    'incomeGradient': '#004CB3',
    'spending': '#FFA5BA',
    'spendingGradient': '#FF4D6D',
    'investment': '#B38BFF',
    'investmentGradient': '#6C3FCC',

    // Spending tags
    'Food': '#FF9F1C',
    'FoodGradient': '#FF6200',
    'Household': '#B5E48C',
    'HouseholdGradient': '#7FB800',
    'Transport': '#6A4C93',
    'TransportGradient': '#311D63',
    'Bills & Utilities': '#80CED7',
    'Bills & UtilitiesGradient': '#329BA0',
    'Entertainment': '#FF6F91',
    'EntertainmentGradient': '#C70039',
    'Hobby': '#F3CA40',
    'HobbyGradient': '#D19A00',
    'Gift': '#F15BB5',
    'GiftGradient': '#AA1C8B',
    'Other': '#A0C4FF',
    'OtherGradient': '#3B73D9',

    // Income tags
    'Salary': '#00BBF9',
    'SalaryGradient': '#005F99',
    'Freelance': '#3F88C5',
    'FreelanceGradient': '#24588A',
    'Allowance': '#AACC00',
    'AllowanceGradient': '#6A9900',
    'Refunds': '#FFBC42',
    'RefundsGradient': '#D99100',

    // Investment tags
    'ETF': '#845EC2',
    'ETFGradient': '#4C2882',
    'Stock': '#00C9A7',
    'StockGradient': '#007A5E',
    'Crypto': '#FF5E5B',
    'CryptoGradient': '#990000',
    'Savings': '#4D96FF',
    'SavingsGradient': '#0047AB',
};
