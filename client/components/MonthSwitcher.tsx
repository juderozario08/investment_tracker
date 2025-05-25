import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../theming"
import { ChevronLeft, ChevronRight } from "react-native-feather";
import React from "react";
import { Months } from "../library/constants";

interface MonthSwitcherProps {
    dateState: { month: number; year: number };
    prevMonth: () => void;
    nextMonth: () => void;
}

export const MonthSwitcher: React.FC<MonthSwitcherProps> = ({ dateState, prevMonth, nextMonth }) => {
    const theme = useTheme();
    return (
        <View style={[styles.flex, { paddingLeft: 10, paddingRight: 10 }]}>
            <TouchableOpacity onPress={prevMonth}>
                <ChevronLeft color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[{ color: theme.colors.text, marginTop: 2 }, styles.text]}>{`${Months[dateState.month]} ${dateState.year}`}</Text>
            {
                new Date().getUTCMonth() === dateState.month && new Date().getUTCFullYear() === dateState.year ? null : (
                    <TouchableOpacity onPress={nextMonth}>
                        <ChevronRight color={theme.colors.text} />
                    </TouchableOpacity>
                )
            }
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
        flexDirection: 'row',
    }
})
