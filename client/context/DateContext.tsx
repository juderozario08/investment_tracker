import { ReactNode, createContext, useContext, useState } from "react"

type DateContextType = {
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
}

const Context = createContext<DateContextType | undefined>(undefined);

export const DateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [date, setDate] = useState<Date>(new Date());
    return (
        <Context.Provider value={{ date, setDate }}>
            {children}
        </Context.Provider>
    )
}

export const useDateContext = () => {
    const context = useContext(Context);
    if (!context) throw new Error("useDataContext must be used within a DateProvider");
    return context;
};
