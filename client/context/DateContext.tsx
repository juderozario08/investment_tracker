import { ReactNode, createContext, useContext, useState } from "react"

type DateContextType = {
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
    prevMonth: () => void;
    nextMonth: () => void;
}

const Context = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [date, setDate] = useState<Date>((() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    })());

    const prevMonth = () => {
        setDate((d) => {
            let newMonth = d.getMonth() - 1;
            let newYear = d.getFullYear();

            if (newMonth < 0) {
                newMonth = 11;
                newYear -= 1;
            }

            return new Date(newYear, newMonth);
        });
    };

    const nextMonth = () => {
        setDate((d) => {
            let newMonth = d.getMonth() + 1;
            let newYear = d.getFullYear();

            if (newMonth > 11) {
                newMonth = 0;
                newYear += 1;
            }

            return new Date(newYear, newMonth);
        });
    };

    return (
        <Context.Provider value={{ date, setDate, nextMonth, prevMonth }}>
            {children}
        </Context.Provider>
    )
}

export const useDateContext = () => {
    const context = useContext(Context);
    if (!context) throw new Error("useDataContext must be used within a DateProvider");
    return context;
};
