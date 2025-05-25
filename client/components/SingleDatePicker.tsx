import DatePicker from "react-native-date-picker";

export const SingleDatePicker: React.FC<{
    visible: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDate: (val: Date) => void;
    date: Date;
}> = ({ visible, date, setOpen, setDate }) => {

    return (
        <DatePicker
            mode="date"
            modal
            open={visible}
            date={date}
            onConfirm={(date) => {
                setOpen(false)
                setDate(date)
            }}
            onCancel={() => {
                setOpen(false)
            }}
        />
    )
}
