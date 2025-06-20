export interface DropdownMenuType<T> {
    label: string | number;
    value: T;
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
