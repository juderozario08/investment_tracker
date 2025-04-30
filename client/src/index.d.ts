export interface TransactionDateType {
    category: 'investment' | 'income' | 'spending',
    transactionType: string,
    name: string,
    amount: number,
    date: Date,
    note?: string,
    description?: string
}

export interface DropdownMenuType {
    label: string;
    value: string;
}
