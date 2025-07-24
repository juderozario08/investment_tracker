import { barDataItem, pieDataItem } from 'react-native-gifted-charts';
import { RangeTypes } from '../types';
import { Alert } from 'react-native';
import { capitalizeString } from '../../../library/helper';
import { ChartColors } from '../../../library/constants';
import { AllTagTypes } from '../../../library/types';

export const generatePieData = (value: number, tag: AllTagTypes, onPress?: Function): pieDataItem => ({
    value,
    gradientCenterColor: ChartColors[`${tag}Gradient`],
    color: ChartColors[tag],
    onPress: onPress,
});

export function generateBarData(
    value: number,
    tag: AllTagTypes,
    onPress?: (t: AllTagTypes) => void
): barDataItem {
    return {
        value,
        gradientColor: ChartColors[`${tag}Gradient`],
        frontColor: ChartColors[tag],
        label: capitalizeString(tag),
        onPress: onPress ? () => onPress(tag) : undefined,
    };
}

function getFirstDateForRange(range: RangeTypes) {
    const now = new Date();
    switch (range) {
        case 'Daily':
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        case 'Weekly':
            return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0);
        case 'YTD':
            return new Date(now.getFullYear(), 0, 1, 0, 0, 0);
        default:
            return undefined;
    }
}

export function getDatesInRange(range: RangeTypes): Date[] {
    const result: Date[] = [];
    const start = getFirstDateForRange(range);
    const now = new Date();
    if (start) {
        let current = new Date(start);
        while (current <= now) {
            result.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }
    }
    return result;
}

export function getDateSelectionAlert(previousRangeSelected: RangeTypes, onOkayPress: () => void) {
    Alert.alert(
        'Date(s) Required',
        `Please select a date or multiple dates and press "Submit" in order to continue or press Okay if you want to go back to your ${previousRangeSelected} view.`,
        [
            {
                text: 'Cancel',
                style: 'destructive',
            },
            {
                text: 'Okay',
                style: 'default',
                onPress: () => onOkayPress(),
            },
        ]
    );
}


export function getMonthDates(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const result: Date[] = [];
    let current = new Date(firstDay);
    while (current <= lastDay) {
        result.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return result;
}

export function getYearDates(year: number): Date[] {
    const dates: Date[] = [];
    const date = new Date(year, 0, 1);

    while (date.getFullYear() === year) {
        dates.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    return dates;
}
