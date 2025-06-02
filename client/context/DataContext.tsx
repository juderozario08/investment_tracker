import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
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

type DataContextType = {
    data: TransactionDataType[];
    setData: React.Dispatch<React.SetStateAction<TransactionDataType[]>>;
    monthlyAmounts: AmountsType;
    setMonthlyAmounts: React.Dispatch<React.SetStateAction<AmountsType>>;
    groupedByDate: Map<Date, TransactionDataType[]>,
    setGroupedByDate: React.Dispatch<React.SetStateAction<Map<Date, TransactionDataType[]>>>;
    sortedDateArray: Date[];
    setSortedDateArray: React.Dispatch<React.SetStateAction<Date[]>>;
    addTransaction: (t: TransactionDataType) => void;
    removeTransaction: (id: string) => void;
    editTransaction: (t: TransactionDataType) => void;
    clearTransaction: () => void;
};

// Organizing all the data to group by date
const groupByDate = (data: TransactionDataType[]): Map<Date, TransactionDataType[]> => {
    const map = new Map<string, { key: Date; items: TransactionDataType[] }>();
    for (const tx of data) {
        const year = tx.date.getFullYear();
        const month = tx.date.getMonth();
        const day = tx.date.getDate();

        const normalizedKey = `${year}-${month}-${day}`;

        if (!map.has(normalizedKey)) {
            map.set(normalizedKey, { key: new Date(year, month, day), items: [] });
        }
        map.get(normalizedKey)!.items.push(tx);
    }
    const result = new Map<Date, TransactionDataType[]>();
    for (const { key, items } of map.values()) {
        result.set(key, items);
    }
    return result;
};

const Context = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<TransactionDataType[]>([]);
    const { date } = useDateContext();

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

    const [groupedByDate, setGroupedByDate] = useState(new Map<Date, TransactionDataType[]>());
    const [sortedDateArray, setSortedDateArray] = useState<Date[]>([]);

    const hasInitialized = useRef<boolean>(false);

    /* Setting date groups */
    useEffect(() => {
        const grouped = groupByDate(data);
        setGroupedByDate(grouped);

        const sorted = Array.from(grouped.keys()).sort((a, b) => b.getTime() - a.getTime());
        setSortedDateArray(sorted);
    }, [data]);

    const [monthlyAmounts, setMonthlyAmounts] = useState<AmountsType>({
        income: 0,
        spending: 0,
        investments: 0
    });

    const calculateAndSetMonthlyAmounts = () => {
        let totalInvestment = 0;
        let totalSpending = 0;
        let totalIncome = 0;
        for (const d of sortedDateArray) {
            if (d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()) {
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


    return (
        <Context.Provider value={{
            data,
            setData,
            addTransaction,
            removeTransaction,
            editTransaction,
            clearTransaction,
            groupedByDate,
            setGroupedByDate,
            sortedDateArray,
            setSortedDateArray,
            monthlyAmounts,
            setMonthlyAmounts
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
