import { MMKVLoader } from 'react-native-mmkv-storage';
import { TransactionDataType } from './types';

const storage = new MMKVLoader().initialize();
const TRANSACTION_STORAGE_KEY = 'transactions';

export async function loadTransactionsFromStorage() {
    try {
        const rawData = await storage.getArrayAsync<any>(TRANSACTION_STORAGE_KEY) ?? [];
        return rawData.map((d: any): TransactionDataType => ({
            id: d.id,
            category: d.category,
            tag: d.tag,
            name: d.name,
            amount: d.amount,
            date: new Date(d.date),
            note: d.note
        }));
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching data from following key in storage: " + TRANSACTION_STORAGE_KEY);
    }
};

export async function addTransactionToStorage(transaction: TransactionDataType) {
    try {
        const existing = await loadTransactionsFromStorage();
        const updatedTransaction = { ...transaction, date: transaction.date.toISOString() };
        const updated = [...existing, updatedTransaction];
        await storage.setArrayAsync(TRANSACTION_STORAGE_KEY, updated);
    } catch (err) {
        console.error(err);
        throw new Error("Error adding to transaction!");
    }
};

export async function removeTransactionFromLocalStorage(transactionId: string) {
    try {
        const existing = await storage.getArrayAsync<any>(TRANSACTION_STORAGE_KEY) ?? [];
        const filtered = existing.filter((t: any) => t.id !== transactionId);
        await storage.setArrayAsync(TRANSACTION_STORAGE_KEY, filtered);
    } catch (err) {
        console.error(err);
        throw new Error("Remove transaction from local storage failed!");
    }
};

export async function editTransactionInLocalStorage(details: TransactionDataType) {
    try {
        const existing = await storage.getArrayAsync<any>(TRANSACTION_STORAGE_KEY) ?? [];
        const updated = existing.map((t: any) => {
            if (t.id === details.id) {
                return { ...details, date: details.date.toISOString() };
            }
            return t;
        });
        await storage.setArrayAsync(TRANSACTION_STORAGE_KEY, updated);
    } catch (err) {
        console.error(err);
        throw new Error("Edit transaction from local storage failed!");
    }
};

export function clearTransactionsFromStorage() {
    const success = storage.removeItem(TRANSACTION_STORAGE_KEY);
    console.log(success);
};

