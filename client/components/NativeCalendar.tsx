/* eslint-disable react-native/no-inline-styles */
import { KeyboardAvoidingView, Modal, StyleSheet, View } from 'react-native';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import { FadingPressable } from './FadingPressable';
import { ThemedText } from './ThemedText';
import { useTheme } from '../theming';
import { useState } from 'react';

type NativeCalendarProps = {
    mode: 'single' | 'multiple';
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setDate?: React.Dispatch<React.SetStateAction<DateType>>;
    setDates?: React.Dispatch<React.SetStateAction<DateType[]>>;
};

export const NativeCalendar: React.FC<NativeCalendarProps> = ({ mode, isVisible, setIsVisible, setDates, setDate }) => {
    const theme = useTheme();
    const [modalDates, setModalDates] = useState<DateType[]>();
    const [modalDate, setModalDate] = useState<DateType>();
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
                    {/* TODO: Make it so that it can support both Single and Multiple as options */}
                    {mode === 'multiple' &&
                        <MultipleModeCalendar
                            modalDates={modalDates || []}
                            setModalDates={setModalDates} />}
                    {mode === 'single' &&
                        <SingleModeCalendar
                            modalDate={modalDate}
                            setModalDate={setModalDate} />}
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
                                setIsVisible(false);
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
                                if (modalDates) {
                                    setDates && setDates(modalDates);
                                } else if (modalDate) {
                                    setDate && setDate(modalDate);
                                }
                                setIsVisible(false);
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

type MultipleModeCalendarProps = {
    modalDates: DateType[];
    setModalDates: React.Dispatch<React.SetStateAction<DateType[]>>;
}

const MultipleModeCalendar: React.FC<MultipleModeCalendarProps> = ({ modalDates, setModalDates }) => {
    const theme = useTheme();
    const defaultStyle = useDefaultStyles();
    return (
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
            onChange={({ dates }) => {
                setModalDates(dates);
            }}
        />
    );
};

type SingleModeCalendarProps = {
    modalDate: DateType;
    setModalDate: React.Dispatch<React.SetStateAction<DateType>>;
}

const SingleModeCalendar: React.FC<SingleModeCalendarProps> = ({ modalDate, setModalDate }) => {
    const theme = useTheme();
    const defaultStyle = useDefaultStyles();
    return (
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
            onChange={({ date }) => {
                setModalDate(date);
            }}
        />
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
