/* eslint-disable react-native/no-inline-styles */
import { KeyboardAvoidingView, Modal, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import { FadingPressable } from './FadingPressable';
import { ThemedText } from './ThemedText';
import { useTheme } from '../theming';

type NativeCalendarBaseProps = {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    onPressCancel: () => void;
    onPressSubmit: () => void;
}

interface NativeCalendarProps extends NativeCalendarBaseProps {
    children?: React.ReactNode;
}

interface MultipleModeNativeCalendarProps extends NativeCalendarBaseProps {
    modalDates: DateType[];
    setModalDates: React.Dispatch<React.SetStateAction<DateType[]>>;
}

interface SingleModeNativeCalendarProps extends NativeCalendarBaseProps {
    modalDate: DateType;
    setModalDate: React.Dispatch<React.SetStateAction<DateType>>;
}

const NativeCalendar: React.FC<NativeCalendarProps> = ({ isVisible, setIsVisible, onPressCancel, onPressSubmit, children }) => {
    const theme = useTheme();
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => {
                setIsVisible(!isVisible);
            }}>
            <KeyboardAvoidingView style={[styles.centeredView]}>
                <View style={[styles.modalView, { backgroundColor: theme.colors.background }]}>
                    {children}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                    }}>
                        <FadingPressable
                            style={{
                                backgroundColor: '#FF4135',
                                padding: 10,
                                borderRadius: 10,
                            }}
                            onPress={() => {
                                onPressCancel();
                            }}
                        >
                            <ThemedText style={{ fontSize: 16 }}>Cancel</ThemedText>
                        </FadingPressable>
                        <FadingPressable
                            style={{
                                backgroundColor: '#087CD8',
                                padding: 10,
                                borderRadius: 10,
                            }}
                            onPress={() => {
                                onPressSubmit();
                            }}
                        >
                            <ThemedText style={{ fontSize: 16 }}>Submit</ThemedText>
                        </FadingPressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export const NativeCalendarModeMultiple: React.FC<MultipleModeNativeCalendarProps> = ({ modalDates, setModalDates, ...props }) => {
    const theme = useTheme();
    const defaultStyle = useDefaultStyles();
    return (
        <NativeCalendar {...props}>
            <DateTimePicker
                mode="multiple"
                dates={modalDates}
                style={{
                    backgroundColor: theme.colors.background,
                    borderRadius: 10,
                    padding: 5,
                    marginTop: 10,
                }}
                styles={{
                    ...defaultStyle,
                    today: { borderColor: 'white', borderWidth: 1 },
                    range_fill: { backgroundColor: '#222222' },
                    range_start: { backgroundColor: 'white', color: 'black' },
                    range_end: { backgroundColor: 'white', color: 'black' },
                }}
                multiRangeMode
                maxDate={new Date()}
                onChange={({ dates }) => setModalDates(dates)}
            />
        </NativeCalendar>
    );
};

export const NativeCalendarModeSingle: React.FC<SingleModeNativeCalendarProps> = ({ modalDate, setModalDate, ...props }) => {
    const theme = useTheme();
    const defaultStyle = useDefaultStyles();
    return (
        <NativeCalendar {...props}>
            <DateTimePicker
                mode="single"
                date={modalDate}
                style={{
                    backgroundColor: theme.colors.background,
                    borderRadius: 10,
                    padding: 5,
                    marginTop: 10,
                }}
                styles={{
                    ...defaultStyle,
                    today: { borderColor: 'white', borderWidth: 1 },
                }}
                maxDate={new Date()}
                onChange={({ date }) => setModalDate(date)}
            />
        </NativeCalendar>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        shadowRadius: 4,
        elevation: 10,
        maxHeight: '90%',
        marginVertical: 10,
        marginHorizontal: 5,
        paddingBottom: 20,
    },
});
