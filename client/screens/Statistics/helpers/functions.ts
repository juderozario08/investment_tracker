import { barDataItem, pieDataItem } from "react-native-gifted-charts";
import { chartColors } from "../../../library/constants";
import { capitalizeString } from "../../../library/helper";
import { CategoryTypes, IncomeTagTypes, InvestmentTagTypes, SpendingTagTypes } from "../../../library/types";

export const generatePieData = <T extends SpendingTagTypes | IncomeTagTypes | InvestmentTagTypes | CategoryTypes>(
    value: number,
    tag: T,
    onPress?: Function
): pieDataItem => ({
    value,
    gradientCenterColor: chartColors[`${tag}Gradient` as keyof typeof chartColors],
    color: chartColors[tag as keyof typeof chartColors],
    onPress: onPress
});

export const generateBarData = <T extends SpendingTagTypes | IncomeTagTypes | InvestmentTagTypes | CategoryTypes>(
    value: number,
    tag: T,
    onPress?: Function
): barDataItem => {
    return ({
        value,
        gradientColor: chartColors[`${tag}Gradient`],
        frontColor: chartColors[tag],
        label: capitalizeString(tag),
        onPress: onPress
    });
};

