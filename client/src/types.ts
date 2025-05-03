export interface DropdownMenuType {
    label: string;
    value: string;
}

export interface TransactionDateType {
    category: 'income' | 'spending' | 'investment'
    transactionType: string,
    name: string,
    amount: number,
    date: Date,
    note?: string,
}

