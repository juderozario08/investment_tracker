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
    groupedByDate: Map<string, TransactionDataType[]>,
    setGroupedByDate: React.Dispatch<React.SetStateAction<Map<string, TransactionDataType[]>>>;
    addTransaction: (t: TransactionDataType) => void;
    removeTransaction: (id: string) => void;
    editTransaction: (t: TransactionDataType) => void;
    clearTransaction: () => void;
};

const Context = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<TransactionDataType[]>([]);
    const [groupedByDate, setGroupedByDate] = useState(new Map<string, TransactionDataType[]>());

    const { date } = useDateContext();

    // Organizing all the data to group by date
    const groupByDate = (): Map<string, TransactionDataType[]> => {
        const result: Map<string, TransactionDataType[]> = new Map<string, TransactionDataType[]>();
        for (const transaction of data) {
            const key = transaction.date.toString();
            if (!result.has(key)) {
                result.set(key, []);
            }
            result.get(key)!.push(transaction);
        }
        return result;
    };

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

    const hasInitialized = useRef<boolean>(false);

    useEffect(() => {
        setData(loadTransactionsFromStorage());
    }, []);

    /* Setting date groups */
    useEffect(() => {
        const grouped = groupByDate();
        setGroupedByDate(grouped);
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
        console.log({
            totalIncome, totalInvestment, totalSpending
        })
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
