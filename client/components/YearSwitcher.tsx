/* eslint-disable react-native/no-inline-styles */
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../theming';
import { ChevronLeft, ChevronRight } from 'react-native-feather';
import React from 'react';
import { FadingPressable } from './FadingPressable';
import { ThemedText } from './ThemedText';

type YearSwitcherProps = {
    year: number;
    setYear: React.Dispatch<React.SetStateAction<number>>;
}

export const YearSwitcher: React.FC<YearSwitcherProps> = ({ year, setYear }) => {
    const theme = useTheme();
    const currentYear = new Date().getFullYear();
    function nextYear() {
        setYear(year + 1);
    }
    function prevYear() {
        setYear(year - 1);
    }
    return (
        <View style={[{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
        }]}>
            <FadingPressable onPress={prevYear} style={styles.touchArea}>
                <ChevronLeft color={theme.colors.text} />
            </FadingPressable>
            <ThemedText style={{
                fontSize: 16,
                paddingHorizontal: 3,
            }}>
                {year}
            </ThemedText>
            {year < currentYear && <FadingPressable onPress={nextYear} style={styles.touchArea}>
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
