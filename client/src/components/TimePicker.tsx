import { TimePickerModal } from "react-native-paper-dates"

export const TimePicker: React.FC<{
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    date: Date;
    setDate: (val: Date) => void;
}> = ({ visible, setVisible, date, setDate }) => {

    const timePickerOnConfirm = (params: {
        hours: number;
        minutes: number
    }) => {
        setVisible(false);
        const d = date;
        d.setHours(params.hours);
        d.setMinutes(params.minutes);
        setDate(d);
    }

    return (
        <TimePickerModal
            visible={visible}
            onDismiss={() => setVisible(false)}
            onConfirm={timePickerOnConfirm} />
    )
}
