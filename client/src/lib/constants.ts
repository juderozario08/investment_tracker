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
    'Dec'
]

export const Days: string[] = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
]

export const TransactionCategoryOptions: {
    name: string;
    value: string;
}[] = [
        { name: 'Income', value: 'income' },
        { name: 'Spending', value: 'spending' },
        { name: 'Investment', value: 'investment' }
    ]

export const TransactionSpendingTagOptions: {
    name: string;
    value: string;
}[] = [
        { name: 'Food', value: 'Food' },
        { name: 'Household', value: 'Household' },
        { name: 'Transport', value: 'Transport' },
        { name: 'Bills and Utilities', value: 'Bills and Utilities' },
        { name: 'Entertainment', value: 'Entertainment' },
        { name: 'Hobby', value: 'Hobby' },
        { name: 'Gift', value: 'Gift' },
        { name: 'Hobby', value: 'Hobby' },
        { name: 'Other', value: 'Other' },
    ]

export const TransactionIncomeTagOptions: {
    name: string;
    value: string;
}[] = [
        { name: 'Salary', value: 'Salary' },
        { name: 'Allowance', value: 'Allowance' },
        { name: 'Refunds', value: 'Refunds' },
        { name: 'Gift', value: 'Gift' },
        { name: 'Other', value: 'Other' },
    ]

export const TransactionInvestTagOptions: {
    name: string;
    value: string;
}[] = [
        { name: '', value: '' }
    ]
