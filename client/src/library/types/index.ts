export interface DropdownMenuType {
    label: string;
    value: string;
}

export interface TransactionDataType {
    category: string;
    transactionType: string;
    name: string;
    amount: number;
    date: Date;
    note?: string;
}
