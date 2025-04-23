import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../theming/ThemeProvider"
import { ChevronLeft, ChevronRight } from "react-native-feather";
import React from "react";
import { Months } from "../lib/constants";

interface MonthSwitcherProps {
    month: number;
    setMonth: React.Dispatch<React.SetStateAction<number>>;
    prevMonth: () => void;
    nextMonth: () => void;
}

export const MonthSwitcher: React.FC<MonthSwitcherProps> = ({ month, prevMonth, nextMonth }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.flex]}>
            <TouchableOpacity style={[styles.center]} onPress={prevMonth}>
                <ChevronLeft color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[{ color: theme.colors.text }, styles.text, styles.center]}>{Months[month]}</Text>
            <TouchableOpacity style={[styles.center]} onPress={nextMonth}>
                <ChevronRight color={theme.colors.text} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'absolute',
        top: 25,
        padding: 10
    },
    text: {
        fontSize: 17,
        paddingLeft: 5,
        paddingRight: 5
    },
    center: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    flex: {
        flex: 1,
        flexDirection: 'row'
    },
    justifyCenter: {
        justifyContent: 'center'
    }
})
