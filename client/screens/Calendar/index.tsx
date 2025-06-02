import { StyleSheet, View } from "react-native"
import { useTheme } from "../../theming"
import { SafeAreaView } from "react-native-safe-area-context";
import { TopMenu } from "../../components/TopMenu";
import { MonthSummary } from "../../components/MonthTotal";
import { useEffect, useState } from "react";
import { MonthSwitcher } from "../../components/MonthSwitcher";
import { useDateContext } from "../../context/DateContext";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "react-native";
import { FadingPressable } from "../../components/FadingPressable";
import { useDataContext } from "../../context/DataContext";

type AmountsType = {
    investments: number;
    income: number;
    spending: number;
}

export const Calendar = () => {
    const theme = useTheme();

    const { date } = useDateContext();
    const { sortedDateArray, groupedByDate } = useDataContext();

    const [dates, setDates] = useState<number[]>([]);

    const [amounts, setAmounts] = useState<AmountsType[]>([]);
    const setDailyAmounts = () => {
        const result = Array.from({ length: amounts.length }, () => {
            const d: AmountsType = {
                investments: 0,
                income: 0,
                spending: 0
            }
            return d
        })
        sortedDateArray.forEach((d) => {
            if (date.getMonth() === d.getMonth() && date.getFullYear() === d.getFullYear()) {
                const index = d.getDate() - 1;
                const newValuesList = groupedByDate.get(date);
                newValuesList?.forEach((val) => {
                    if (val.category === 'spending') {
                        result[index].spending += Number(val.amount);
                    } else if (val.category === 'income') {
                        result[index].income += Number(val.amount);
                    } else if (val.category === 'investing') {
                        result[index].investments += Number(val.amount);
                    }
                })
            }
        });
        setAmounts(result);
    }

    useEffect(() => {
        const dateArr = Array.from(
            { length: new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate() },
            (_, i) => i)
        setDates(dateArr);
    }, [date]);

    useEffect(() => {
        setDailyAmounts();
    }, [dates]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Tob Bar */}
            <TopMenu>
                <MonthSwitcher />
                <MonthSummary />
            </TopMenu>
            <ScrollView>
                <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
                    {amounts.map((val, idx) => (
                        <FadingPressable
                            key={idx}
                            style={{ width: 100, margin: 4 }}
                            onPress={() => { }}
                        >
                            <View style={{ backgroundColor: theme.colors.muted, padding: 5 }}>
                                <Text style={{
                                    color: theme.colors.text,
                                    backgroundColor: theme.colors.border,
                                    paddingHorizontal: 5,
                                    paddingVertical: 2,
                                    borderWidth: 1,
                                    borderColor: date.getDate() === (idx + 1) ? 'white' : 'transparent'
                                }}>{idx + 1}</Text>
                                <View>
                                    <Text style={{ color: theme.colors.investment, textAlign: "center" }}>${val.investments}</Text>
                                    <Text style={{ color: theme.colors.income, textAlign: "center" }}>${val.income}</Text>
                                    <Text style={{ color: theme.colors.spending, textAlign: "center" }}>${val.spending}</Text>
                                </View>
                            </View>
                        </FadingPressable>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10,
    },
});
