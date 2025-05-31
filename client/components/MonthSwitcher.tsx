import { View, Text, StyleSheet } from "react-native"
import { useTheme } from "../theming"
import { ChevronLeft, ChevronRight } from "react-native-feather";
import React from "react";
import { Months } from "../library/constants";
import { useDateContext } from "../context/DateContext";
import { FadingPressable } from "./FadingPressable";

export const MonthSwitcher = () => {
    const theme = useTheme();
    const { date, nextMonth, prevMonth } = useDateContext();
    return (
        <View style={[styles.flex, { paddingLeft: 10, paddingRight: 10 }]}>
            <FadingPressable onPress={prevMonth}>
                <ChevronLeft color={theme.colors.text} />
            </FadingPressable>
            <Text style={[{ color: theme.colors.text, marginTop: 2 }, styles.text]}>{`${Months[date.getMonth()]} ${date.getFullYear()}`}</Text>
            {
                new Date().getUTCMonth() === date.getMonth() && new Date().getUTCFullYear() === date.getFullYear() ? null : (
                    <FadingPressable onPress={nextMonth}>
                        <ChevronRight color={theme.colors.text} />
                    </FadingPressable>
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
