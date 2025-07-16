import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theming';
import { ChevronLeft, ChevronRight } from 'react-native-feather';
import React from 'react';
import { Months } from '../library/constants';
import { useDateContext } from '../context/DateContext';
import { FadingPressable } from './FadingPressable';
import { ThemedText } from './ThemedText';

export const MonthSwitcher = () => {
    const theme = useTheme();
    const { date, nextMonth, prevMonth } = useDateContext();
    const currentDate = new Date();

    return (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={[{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
        }]}>
            <FadingPressable onPress={prevMonth} style={styles.touchArea}>
                <ChevronLeft color={theme.colors.text} />
            </FadingPressable>
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            <ThemedText style={{
                fontSize: 16,
                paddingHorizontal: 3,
            }}>
                {`${Months[date.getMonth()]} ${date.getFullYear()}`}
            </ThemedText>
            {!(currentDate.getFullYear() === date.getFullYear() && currentDate.getMonth() === date.getMonth()) &&
                <FadingPressable onPress={nextMonth} style={styles.touchArea}>
                    <ChevronRight color={theme.colors.text} />
                </FadingPressable>}
        </View>
    );
};

const styles = StyleSheet.create({
    touchArea: {
        paddingVertical: 6,
    },
});
