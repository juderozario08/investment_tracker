import { MMKVLoader } from 'react-native-mmkv-storage';
import { TransactionDataType } from './types';

const storage = new MMKVLoader().initialize();
const TRANSACTION_STORAGE_KEY = 'transactions';

export const loadTransactionsFromStorage = (): TransactionDataType[] => {
    const rawData = storage.getArray<any>(TRANSACTION_STORAGE_KEY) ?? [];
    return rawData.map((d: any): TransactionDataType => ({
        id: d.id,
        category: d.category,
        tag: d.tag,
        name: d.name,
        amount: d.amount,
        date: new Date(d.date),
        note: d.note
    }));
};

export const addTransactionToStorage = (transaction: TransactionDataType) => {
    const existing = loadTransactionsFromStorage();
    const updatedTransaction = { ...transaction, date: transaction.date.toISOString() };
    const updated = [...existing, updatedTransaction];
    storage.setArray(TRANSACTION_STORAGE_KEY, updated);
};

export const removeTransactionFromLocalStorage = (transactionId: string) => {
    const existing = storage.getArray<any>(TRANSACTION_STORAGE_KEY) ?? [];
    const filtered = existing.filter((t: any) => t.id !== transactionId);
    storage.setArray(TRANSACTION_STORAGE_KEY, filtered);
};

export const editTransactionInLocalStorage = (details: TransactionDataType) => {
    const existing = storage.getArray<any>(TRANSACTION_STORAGE_KEY) ?? [];
    const updated = existing.map((t: any) => {
        if (t.id === details.id) {
            return { ...details, date: details.date.toISOString() };
        }
        return t;
    });
    storage.setArray(TRANSACTION_STORAGE_KEY, updated);
};

export const clearTransactionsFromStorage = () => {
    const success = storage.removeItem(TRANSACTION_STORAGE_KEY);
    console.log(success);
};

