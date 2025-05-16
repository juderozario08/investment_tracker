import { DatePickerModal } from "react-native-paper-dates"
import { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";

export const SingleDatePicker: React.FC<{
    visible: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDate: (val: Date) => void;
    date: Date;
}> = ({ visible, date, setOpen, setDate }) => {

    const datePickerOnConfirm = (params: { date: CalendarDate }) => {
        setOpen(false);
        if (params.date) {
            setDate(params.date);
        }
    }

    return (
        <DatePickerModal
            locale="en"
            saveLabel="Save"
            mode="single"
            visible={visible}
            onDismiss={() => setOpen(false)}
            date={date}
            onConfirm={datePickerOnConfirm}
            validRange={{ endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0) }}
            label="Select Date"
            presentationStyle="pageSheet"
        />
    )
}
