export interface DropdownMenuType {
    label: string;
    value: string;
}

export interface TransactionDataType {
    category: string;
    tag: string;
    name: string;
    amount: string;
    date: Date;
    note?: string;
}
