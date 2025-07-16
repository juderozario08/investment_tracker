import { barDataItem, pieDataItem } from 'react-native-gifted-charts';
import { chartColors } from '../../../library/constants';
import { capitalizeString } from '../../../library/helper';
import { CategoryTypes, IncomeTagTypes, InvestmentTagTypes, SpendingTagTypes } from '../../../library/types';
import { RangeTypes } from '../types';

export const generatePieData = <T extends SpendingTagTypes | IncomeTagTypes | InvestmentTagTypes | CategoryTypes>(
    value: number,
    tag: T,
    onPress?: Function
): pieDataItem => ({
    value,
    gradientCenterColor: chartColors[`${tag}Gradient` as keyof typeof chartColors],
    color: chartColors[tag as keyof typeof chartColors],
    onPress: onPress,
});

export function generateBarData<T extends SpendingTagTypes | IncomeTagTypes | InvestmentTagTypes | CategoryTypes>(
    value: number,
    tag: T,
    onPress?: Function
): barDataItem {
    return ({
        value,
        gradientColor: chartColors[`${tag}Gradient`],
        frontColor: chartColors[tag],
        label: capitalizeString(tag),
        onPress: onPress,
    });
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
