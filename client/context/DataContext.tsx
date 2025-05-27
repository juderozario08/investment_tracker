import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { TransactionDataType } from "../library/types";
import {
    addTransactionToStorage,
    editTransactionInLocalStorage,
    loadTransactionsFromStorage,
    removeTransactionFromLocalStorage,
    clearTransactionsFromStorage
} from "../library/storage";

type DataContextType = {
    data: TransactionDataType[];
    setData: React.Dispatch<React.SetStateAction<TransactionDataType[]>>;
    addTransaction: (t: TransactionDataType) => void;
    removeTransaction: (id: string) => void;
    editTransaction: (t: TransactionDataType) => void;
    clearTransaction: () => void;
};

const Context = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<TransactionDataType[]>([]);

    useEffect(() => {
        setData(loadTransactionsFromStorage());
    }, []);

    const addTransaction = (t: TransactionDataType) => {
        addTransactionToStorage(t);
        setData(prev => [...prev, t]);
    };

    const removeTransaction = (id: string) => {
        removeTransactionFromLocalStorage(id);
        setData(prev => prev.filter(t => t.id !== id));
    };

    const editTransaction = (updated: TransactionDataType) => {
        editTransactionInLocalStorage(updated);
        setData(prev => prev.map(t => t.id === updated.id ? updated : t));
    };

    const clearTransaction = () => {
        clearTransactionsFromStorage();
        setData([]);
    }

    return (
        <Context.Provider value={{
            data,
            setData,
            addTransaction,
            removeTransaction,
            editTransaction,
            clearTransaction
        }}>
            {children}
        </Context.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(Context);
    if (!context) throw new Error("useDataContext must be used within a DataProvider");
    return context;
};
