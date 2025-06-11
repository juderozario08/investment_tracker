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
        <View style={[{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10
        }]}>
            <FadingPressable onPress={prevMonth} style={styles.touchArea}>
                <ChevronLeft color={theme.colors.text} />
            </FadingPressable>
            <Text style={{
                color: theme.colors.text,
                fontSize: 16,
                paddingHorizontal: 3,
            }}>
                {`${Months[date.getMonth()]} ${date.getFullYear()}`}
            </Text>
            <FadingPressable onPress={nextMonth} style={styles.touchArea}>
                <ChevronRight color={theme.colors.text} />
            </FadingPressable>
        </View>
    );
};

const styles = StyleSheet.create({
    touchArea: {
        paddingVertical: 6,
    },
});
