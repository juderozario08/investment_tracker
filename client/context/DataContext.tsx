import { createContext, useContext, useState, useEffect, useRef, PropsWithChildren, useMemo } from "react";
import { TransactionDataType } from "../library/types";
import {
    addTransactionToStorage,
    editTransactionInLocalStorage,
    loadTransactionsFromStorage,
    removeTransactionFromLocalStorage,
    clearTransactionsFromStorage
} from "../library/storage";
import { useDateContext } from "./DateContext";

type AmountsType = {
    investments: number;
    income: number;
    spending: number;
}

export type DataContextType = {
    data: TransactionDataType[];
    setData: React.Dispatch<React.SetStateAction<TransactionDataType[]>>;
    monthlyAmounts: AmountsType;
    setMonthlyAmounts: React.Dispatch<React.SetStateAction<AmountsType>>;
    groupedByDate: Map<string, TransactionDataType[]>,
    addTransaction: (t: TransactionDataType) => void;
    removeTransaction: (id: string) => void;
    editTransaction: (t: TransactionDataType) => void;
    clearTransaction: () => void;
};

const Context = createContext<DataContextType | undefined>(undefined);

export function convertToGroupedMap(data: TransactionDataType[]): Map<string, TransactionDataType[]> {
    const map = new Map<string, TransactionDataType[]>();
    for (const tx of data) {
        const key = tx.date.toISOString();
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key)!.push(tx);
    }
    return map;
}

export const DataProvider = ({ children }: PropsWithChildren) => {
    const { date } = useDateContext();

    const [data, setData] = useState<TransactionDataType[]>([]);
    const groupedByDate = useMemo(() => convertToGroupedMap(data), [data]);

    const addTransaction = async (t: TransactionDataType) => {
        await addTransactionToStorage(t);
        setData(prev => [...prev, t]);
    };

    const removeTransaction = async (id: string) => {
        await removeTransactionFromLocalStorage(id);
        setData(prev => prev.filter(t => t.id !== id));
    };

    const editTransaction = async (updated: TransactionDataType) => {
        await editTransactionInLocalStorage(updated);
        setData(prev => prev.map(t => t.id === updated.id ? updated : t));
    };

    const clearTransaction = () => {
        clearTransactionsFromStorage();
        setData([]);
    }

    const hasInitialized = useRef<boolean>(false);

    useEffect(() => {
        loadTransactionsFromStorage()
            .then((data) => {
                setData(data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const [monthlyAmounts, setMonthlyAmounts] = useState<AmountsType>({
        income: 0,
        spending: 0,
        investments: 0
    });

    /* Setting total amounts each time months or data changes */
    useEffect(() => {
        if (!hasInitialized.current) {
            if (groupedByDate.size > 0) {
                calculateAndSetMonthlyAmounts();
                hasInitialized.current = true;
            }
        } else {
            calculateAndSetMonthlyAmounts();
        }
    }, [date, groupedByDate]);

    const calculateAndSetMonthlyAmounts = () => {
        let totalInvestment = 0;
        let totalSpending = 0;
        let totalIncome = 0;
        for (const d of groupedByDate.keys()) {
            const tempDate = new Date(d);
            if (tempDate.getMonth() === date.getMonth() && tempDate.getFullYear() === date.getFullYear()) {
                const transactions = groupedByDate.get(d);
                if (transactions) {
                    for (const t of transactions) {
                        if (t.category === "spending") totalSpending += Number(t.amount);
                        else if (t.category === "investment") totalInvestment += Number(t.amount);
                        else totalIncome += Number(t.amount);
                    }
                }
            }
        }
        setMonthlyAmounts({
            income: totalIncome,
            investments: totalInvestment,
            spending: totalSpending
        })
    };

    const contextValue = useMemo(() => ({
        data,
        setData,
        addTransaction,
        removeTransaction,
        editTransaction,
        clearTransaction,
        groupedByDate,
        monthlyAmounts,
        setMonthlyAmounts
    }), [data, groupedByDate, monthlyAmounts]);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(Context);
    if (!context) throw new Error("useDataContext must be used within a DataProvider");
    return context;
};
