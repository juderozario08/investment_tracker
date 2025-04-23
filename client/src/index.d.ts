export interface TransactionDateType {
    category: 'investment' | 'income' | 'spending',
    transactionType: string,
    name: string,
    amount: number,
    date: Date,
    note?: string,
    description?: string
}
