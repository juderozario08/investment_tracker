export interface DropdownMenuType {
    label: string | number;
    value: string | number;
}

export interface TransactionDataType {
    id: string;
    category: string;
    tag: string;
    name: string;
    amount: string;
    date: Date;
    note?: string;
}
