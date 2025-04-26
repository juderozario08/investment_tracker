import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../theming/ThemeProvider"
import { ChevronLeft, ChevronRight } from "react-native-feather";
import React from "react";
import { Months } from "../lib/constants";

interface MonthSwitcherProps {
    month: number;
    year: number;
    prevMonth: () => void;
    nextMonth: () => void;
}

export const MonthSwitcher: React.FC<MonthSwitcherProps> = ({ month, prevMonth, nextMonth, year }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.flex, { paddingLeft: 10, paddingRight: 10 }]}>
            <TouchableOpacity onPress={prevMonth}>
                <ChevronLeft color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[{ color: theme.colors.text, marginTop: 4 }, styles.text]}>{`${Months[month]} ${year}`}</Text>
            <TouchableOpacity onPress={nextMonth}>
                <ChevronRight color={theme.colors.text} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        paddingLeft: 5,
        paddingRight: 5
    },
    flex: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
})
