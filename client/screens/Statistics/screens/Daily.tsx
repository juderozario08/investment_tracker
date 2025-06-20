import { Dimensions, StyleSheet, View } from "react-native"
import { useTheme } from "../../../theming"
import { useEffect, useState } from "react";
import { useDataContext } from "../../../context/DataContext";
import { TransactionDataType } from "../../../library/types";
import { BarChart, PieChart, barDataItem, pieDataItem } from "react-native-gifted-charts";
import { ScrollView } from "react-native-gesture-handler";
import { ThemedText } from "../../../components/ThemedText";
import { ThemedDropdown } from "../../../components/ThemedDropdown";

const chartColors = {
    "income": "#009FFF",
    "incomeGradient": "#006DFF",
    "spending": "#FFA5BA",
    "spendingGradient": "#FF7F97",
    "investment": "#B38BFF",
    "investmentGradient": "#9B5DE5"
}

const getStepValue = (max: number, numOfSections: number) => {
    return Math.round(((max + 150) / numOfSections) / 10) * 10;
}

type AmountBreakdownType = {
    income: { "amount": number; "data": TransactionDataType[] };
    spending: { "amount": number; "data": TransactionDataType[] };
    investment: { "amount": number; "data": TransactionDataType[] };
}

export const Daily = () => {
    const theme = useTheme();
    const { groupedByDate } = useDataContext();
    const currentDate = (() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    })()

    const [amountBreakdown, setAmountBreakdown] = useState<AmountBreakdownType>({
        income: { amount: 0, data: [] },
        spending: { amount: 0, data: [] },
        investment: { amount: 0, data: [] },
    });

    const [spendingGroupedByTags, setSpendingGroupedByTags] = useState<Map<string, { total: number; data: TransactionDataType[] }>>(new Map());
    const [incomeGroupedByTags, setIncomeGroupedByTags] = useState<Map<string, { total: number; data: TransactionDataType[] }>>(new Map());
    const [investmentGroupedByTags, setInvestmentGroupedByTags] = useState<Map<string, { total: number; data: TransactionDataType[] }>>(new Map());

    const [investmentPieData, setInvestmentPieData] = useState<pieDataItem[]>([]);
    const [transactionPieData, setTransactionPieData] = useState<pieDataItem[]>([]);
    const [investmentBarData, setInvestmentBarData] = useState<barDataItem[]>([]);
    const [transactionBarData, setTransactionBarData] = useState<barDataItem[]>([]);

    // Calculates the amounts for each category
    const calculateAllAmountsFromLogs = () => {
        const addToMap = (map: Map<string, { total: number; data: TransactionDataType[] }>, tx: TransactionDataType) => {
            if (!map.has(tx.tag)) {
                map.set(tx.tag, {
                    total: Number(tx.amount),
                    data: [tx]
                });
            } else {
                const currentValue = map.get(tx.tag);
                if (currentValue) {
                    map.set(tx.tag, {
                        total: currentValue.total + Number(tx.amount),
                        data: [...currentValue.data, tx]
                    });
                }
            }
        }
        let spending = 0;
        let spendingList: TransactionDataType[] = [];
        let incomeList: TransactionDataType[] = [];
        let investmentList: TransactionDataType[] = [];
        let income = 0;
        let investment = 0;
        let transactions = groupedByDate.get(currentDate.toString());
        let spendingGroup = new Map<string, { total: number; data: TransactionDataType[] }>();
        let incomeGroup = new Map<string, { total: number; data: TransactionDataType[] }>();
        let investmentGroup = new Map<string, { total: number; data: TransactionDataType[] }>();
        if (transactions) {
            for (const tx of transactions) {
                if (tx.category === "spending") {
                    spending += Number(tx.amount);
                    spendingList.push(tx);
                    addToMap(spendingGroup, tx);
                } else if (tx.category === "income") {
                    income += Number(tx.amount);
                    incomeList.push(tx);
                    addToMap(incomeGroup, tx);
                } else {
                    investment += Number(tx.amount);
                    investmentList.push(tx);
                    addToMap(investmentGroup, tx);
                }
            }
        }
        setAmountBreakdown({
            income: { amount: income, data: incomeList },
            spending: { amount: spending, data: spendingList },
            investment: { amount: investment, data: investmentList }
        });
        setSpendingGroupedByTags(spendingGroup);
        setIncomeGroupedByTags(incomeGroup);
        setInvestmentGroupedByTags(investmentGroup);
    }

    const [transactionDoesExist, setTransactionDoesExist] = useState<boolean>(false);

    useEffect(() => {
        // Ensures calculation is only done when there is at least one recorded transaction for the day
        if (groupedByDate.has(currentDate.toString()) && groupedByDate.get(currentDate.toString())) {
            calculateAllAmountsFromLogs();
            setTransactionDoesExist(true);
        }
    }, [groupedByDate]);
    return (
        <ScrollView style={[{
            backgroundColor: theme.colors.background
        }, styles.container]}>
            {transactionDoesExist ?
                <View>
                    <View style={{ paddingVertical: 10 }}>
                        <ThemedText style={styles.title}>
                            Transactions Overview
                        </ThemedText>
                    </View>
                    <View style={{
                        alignItems: "center",
                        paddingVertical: 20,
                        flex: 1
                    }}>
                        <GraphRenderingComponent
                            amountBreakdown={amountBreakdown}
                            typeArray={["income", "spending"]} />
                    </View>
                    <ThemedText style={styles.title}>Investment Overview</ThemedText>
                    <View style={{
                        alignItems: "center",
                        paddingVertical: 20,
                        flex: 1
                    }}>
                        <GraphRenderingComponent
                            amountBreakdown={amountBreakdown}
                            typeArray={["investment", "income"]} />
                    </View>
                </View> :
                <ThemedText style={{
                    textAlign: "center",
                    marginVertical: "auto",
                    fontSize: 20
                }}>No transactions for the day</ThemedText>
            }
        </ScrollView>
    )
}

type GraphTypes = "Bar" | "Pie"

const GraphRenderingComponent: React.FC<{
    amountBreakdown: AmountBreakdownType,
    typeArray: ("spending" | "income" | "investment")[],
}> = ({ amountBreakdown, typeArray }) => {

    const [pieData, setPieData] = useState<pieDataItem[]>([]);
    const [barData, setBarData] = useState<barDataItem[]>([]);
    const [stepValue, setStepValue] = useState<number>(0);

    const theme = useTheme();
    const [selectedChart, setSelectedChart] = useState<GraphTypes>("Bar");

    useEffect(() => {
        setBarData(() =>
            typeArray.map<barDataItem>(t => ({
                value: amountBreakdown[t].amount,
                gradientColor: chartColors[`${t}Gradient`],
                frontColor: chartColors[t],
                label: capitalizeString(t)
            })));
        setPieData(() =>
            typeArray.map(t => ({
                value: amountBreakdown[t].amount,
                gradientCenterColor: chartColors[`${t}Gradient`],
                color: chartColors[t]
            })));
        setStepValue(getStepValue(
            Math.max(...typeArray.map(t => amountBreakdown[t].amount ?? 0)),
            6
        ));
    }, [amountBreakdown, typeArray])

    return (
        <View>
            <View style={{
                flexDirection: "row",
                gap: 20,
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 10
            }}>
                <ThemedText>Graph Type</ThemedText>
                <ThemedDropdown
                    theme={theme}
                    data={[
                        { label: "Bar Chart", value: "Bar" },
                        { label: "Pie Chart", value: "Pie" }
                    ]}
                    value={selectedChart}
                    onChange={(item: any) => {
                        setSelectedChart(item.value);
                    }} />
            </View>
            {selectedChart === "Bar" ? (
                <BarChartComponent
                    data={barData}
                    numOfSections={6}
                    stepValue={stepValue}
                />
            ) : (
                <View style={{ alignItems: "center" }}>
                    <PieChartComponent
                        data={pieData}
                        amountBreakdown={amountBreakdown}
                    />
                    <Legends typeArray={typeArray} />
                </View>
            )}
        </View>
    )
}

const BarChartComponent: React.FC<{
    data: barDataItem[];
    numOfSections: number;
    stepValue: number;
}> = ({ data, numOfSections, stepValue }) => {
    return (
        <View style={{ paddingVertical: 10 }}>
            <BarChart
                data={data}
                frontColor={"white"}
                yAxisTextStyle={{ color: "white" }}
                xAxisLabelTextStyle={{ color: "white" }}
                yAxisColor={"white"}
                xAxisColor={"white"}
                barWidth={Dimensions.get("window").width / 4}
                dashWidth={1}
                noOfSections={numOfSections}
                isAnimated
                animationDuration={100}
                autoCenterTooltip
                showGradient
                stepValue={stepValue}
                gradientColor={"white"}
                renderTooltip={(item: any) => {
                    return <View
                        style={{
                            marginBottom: 10,
                            marginLeft: -6,
                            paddingHorizontal: 6,
                            backgroundColor: "#232B5D",
                            paddingVertical: 4,
                            borderRadius: 4,
                        }}>
                        <ThemedText>${item.value}</ThemedText>
                    </View>
                }}
            />
        </View>
    )
}

const PieChartComponent: React.FC<{
    data: pieDataItem[];
    amountBreakdown: AmountBreakdownType;
}> = ({ data, amountBreakdown }) => {
    return (
        <View style={{
            alignItems: "center",
        }}>
            <PieChart
                data={data}
                focusOnPress
                donut
                showGradient
                innerRadius={80}
                innerCircleColor={'#232B5D'}
                centerLabelComponent={() =>
                    <View style={{ alignItems: "center" }}>
                        <ThemedText style={styles.donutText}>
                            Income: ${amountBreakdown.income.amount}
                        </ThemedText>
                        <ThemedText style={styles.donutText}>
                            Spending: ${amountBreakdown.spending.amount}
                        </ThemedText>
                    </View>
                }
            />
        </View>
    )
}

const Legends: React.FC<{
    typeArray: ("spending" | "income" | "investment")[]
}> = ({ typeArray }) => {
    return (
        <View style={{
            flexDirection: "row",
            gap: 30,
            paddingVertical: 5,
        }}>
            {
                typeArray.map((t, index) => {
                    return (
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: Dimensions.get("window").width / 3
                        }} key={index}>
                            <View style={{
                                height: 10,
                                width: 10,
                                borderRadius: 5,
                                marginRight: 10,
                                backgroundColor: chartColors[t]
                            }}></View>
                            <ThemedText>{capitalizeString(t)}</ThemedText>
                        </View>
                    )
                })
            }
        </View>
    )
}

function capitalizeString(str: string): string {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center"
    },
    donutText: {
        fontSize: 14,
        fontWeight: "bold"
    }
})
