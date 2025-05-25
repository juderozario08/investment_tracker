import DatePicker from "react-native-date-picker";

export const TimePicker: React.FC<{
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    date: Date;
    setDate: (val: Date) => void;
}> = ({ visible, setVisible, date, setDate }) => {

    const timePickerOnConfirm = (d: Date) => {
        setVisible(false);
        const x = date;
        x.setHours(date.getUTCHours());
        x.setMinutes(date.getUTCMinutes());
        setDate(d);
    }

    return (
        <DatePicker
            mode="time"
            modal
            open={visible}
            date={date}
            onConfirm={timePickerOnConfirm}
            onCancel={() => { setVisible(false) }}
        />
    )
}
