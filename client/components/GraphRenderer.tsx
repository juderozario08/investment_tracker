import { Dimensions, View } from "react-native";
import { ChartTypeNames } from "./ChartSelectionDropdown";
import { BarChart, PieChart, barDataItem, pieDataItem } from "react-native-gifted-charts";
import { ThemedText } from "./ThemedText";
import { PieDataItemWithLabelType } from "../screens/Statistics/screens/Daily";
import { Legends } from "./Legends";

export type GraphComponentProps = {
    mode: ChartTypeNames;
    data: any[];
    donut?: boolean;
};

export const GraphRenderer: React.FC<GraphComponentProps> = ({ mode, data, donut }) => {
    return (
        <View>
            {mode === "Bar" && (
                <BarChartComponent
                    data={data}
                    numOfSections={6}
                    numOfBars={data.length}
                />
            )}
            {mode === "Pie" && (
                <View style={{ alignItems: "center" }}>
                    <PieChartComponent
                        data={data}
                        donut={donut ?? false}
                    />
                </View>
            )}
        </View>
    );
};

const BarChartComponent: React.FC<{
    data: barDataItem[];
    numOfSections: number;
    numOfBars: number;
}> = ({ data, numOfSections, numOfBars }) => {
    return (
        <View style={{ paddingVertical: 10 }}>
            <BarChart
                data={data}
                frontColor={"white"}
                yAxisTextStyle={{ color: "white" }}
                xAxisLabelTextStyle={{ color: "white" }}
                yAxisColor={"white"}
                xAxisColor={"white"}
                barWidth={Dimensions.get("window").width / (2 * numOfBars)}
                dashWidth={1}
                noOfSections={numOfSections}
                isAnimated
                animationDuration={100}
                autoCenterTooltip
                stepValue={175}
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
    data: PieDataItemWithLabelType[];
    centerLabelComponent?: Function;
    donut?: boolean;
}> =
    ({ data, centerLabelComponent, donut }) => {
        return (
            <View style={{
                alignItems: "center",
            }}>
                <PieChart
                    data={data.map<pieDataItem>(d => d.item)}
                    focusOnPress
                    donut={donut ?? true}
                    showGradient
                    innerRadius={80}
                    innerCircleColor={'#232B5D'}
                    centerLabelComponent={centerLabelComponent}
                />
                <Legends legendsLabels={data.map(d => d.label)} />
            </View>
        )
    }

