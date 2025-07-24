/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import { Dimensions, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ChartTypes } from '../library/enums';
import { ThemedDropdown } from './ThemedDropdown';
import { DropdownMenuType, AllTagTypes, TransactionDataType, ChartTypeNames } from '../library/types';
import { useEffect, useState } from 'react';
import { capitalizeString } from '../library/helper';
import { ChartColors } from '../library/constants';
import { BarChart, PieChart, barDataItem, lineDataItem, pieDataItem } from 'react-native-gifted-charts';
import { generateBarData, generatePieData } from '../screens/Statistics/helpers/functions';

interface GraphComponentProps {
    mode: ChartTypeNames;
    lookupType: 'category' | 'tag';
    data: TransactionDataType[];
    chartSelectionList: ChartTypeNames[];
    noOfSections?: number;
    donut?: boolean;
    centerLabelComponent?: Function;
    legends?: AllTagTypes[];
    onPress?: (t: AllTagTypes) => void;
}

interface BarChartComponentProps {
    data: TransactionDataType[];
    lookupType: 'category' | 'tag';
    noOfSections: number;
    onPress?: (t: AllTagTypes) => void;
}

interface PieChartComponentProps {
    data: TransactionDataType[];
    lookupType: 'category' | 'tag';
    donut?: boolean;
    centerLabelComponent?: Function;
    onPress?: (t: AllTagTypes) => void;
}

interface LineChartComponentProps {
    data: TransactionDataType[];
}

export const GraphComponent: React.FC<GraphComponentProps> = ({ mode, ...props }) => {
    const [selectedChart, setSelectedChart] = useState<ChartTypeNames>(mode);
    return (
        <View style={{ paddingVertical: 20 }}>
            <ChartSelectionDropdown
                selectedChart={selectedChart}
                setSelectedChart={setSelectedChart}
                {...props} />
            {selectedChart === 'Bar' &&
                <BarChartComponent
                    noOfSections={props.noOfSections ?? 5}
                    {...props}
                />}

            {selectedChart === 'Pie' &&
                <PieChartComponent {...props} />}
        </View>
    );
};

const BarChartComponent: React.FC<BarChartComponentProps> = (props) => {
    const [barData, setBarData] = useState<barDataItem[]>([]);
    const [numOfBars, setNumOfBars] = useState<number>(1);

    useEffect(() => {
        const result = new Map<AllTagTypes, number>();

        props.data.forEach(d => {
            const current = result.get(d[props.lookupType]) || 0;
            result.set(d[props.lookupType], current + Number(d.amount));
        });

        setNumOfBars(Array.from(result.keys()).length);

        const newBarData = Array.from(result.keys()).map(t =>
            generateBarData(result.get(t) ?? 0, t, () => props.onPress?.(t))
        );

        setBarData(newBarData);
    }, [props.data]);

    return (
        <View style={{ paddingVertical: 10, paddingRight: 20, alignSelf: 'center' }}>
            <BarChart
                data={barData}
                frontColor={'white'}
                yAxisTextStyle={{ color: 'white' }}
                xAxisLabelTextStyle={{ color: 'white' }}
                yAxisColor={'white'}
                xAxisColor={'white'}
                barWidth={Dimensions.get('window').width / (2 * numOfBars)}
                dashWidth={1}
                isAnimated
                autoCenterTooltip
                gradientColor={'white'}
                renderTooltip={(item: any) => {
                    return (
                        <View style={styles.barChartToopTipStyle}>
                            <ThemedText>${item.value}</ThemedText>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const PieChartComponent: React.FC<PieChartComponentProps> = (props) => {
    const [pieData, setPieData] = useState<pieDataItem[]>([]);
    const [legendLabels, setLegendLabels] = useState<AllTagTypes[]>([]);

    useEffect(() => {
        const result = new Map<AllTagTypes, number>();

        props.data.forEach(d => {
            const current = result.get(d[props.lookupType]) || 0;
            result.set(d[props.lookupType], current + Number(d.amount));
        });

        const labels: AllTagTypes[] = [];

        const newBarData = Array.from(result.keys()).map(t => {
            labels.push(t);
            return generatePieData(result.get(t) ?? 0, t, () => props.onPress?.(t));
        });

        setPieData(newBarData);
        setLegendLabels(labels);
    }, [props.data]);

    return (
        <View style={{ alignItems: 'center' }}>
            <PieChart
                data={pieData}
                focusOnPress
                donut={props.donut ?? false}
                showGradient
                innerRadius={80}
                innerCircleColor={'#232B5D'}
                centerLabelComponent={props.centerLabelComponent}
            />
            <Legends legendLabels={legendLabels} />
        </View>
    );
};

const LineChartComponent: React.FC<LineChartComponentProps> = (props) => {
    const [lineData, setLineData] = useState<lineDataItem[]>([]);

    useEffect(() => {
    }, [props.data]);

    return (
        <View />
    );
};


interface ChartSelectionDropdownProps {
    selectedChart: ChartTypeNames;
    setSelectedChart: React.Dispatch<React.SetStateAction<ChartTypeNames>>;
    chartSelectionList: ChartTypeNames[];
}

const ChartSelectionDropdown: React.FC<ChartSelectionDropdownProps> = ({ selectedChart, setSelectedChart, chartSelectionList }) => {
    return (
        <View style={styles.chartView}>
            <ThemedText>Graph Type</ThemedText>
            <ThemedDropdown
                data={chartSelectionList.map<DropdownMenuType<ChartTypeNames>>(t => ({ label: ChartTypes[t], value: t }))}
                selectedTextStyle={styles.chartSelectedTextStyle}
                value={selectedChart}
                onChange={(item: any) => { setSelectedChart(item.value); }} />
        </View>
    );
};

type LegendProps = { legendLabels: AllTagTypes[]; }
const Legends: React.FC<LegendProps> = ({ legendLabels }) => (
    <View style={styles.legendView}>
        {legendLabels.map((t, index) => {
            return (
                <View style={styles.legendCenter} key={index}>
                    <View style={[styles.legendCircle, { backgroundColor: ChartColors[t] }]} />
                    <ThemedText>{capitalizeString(t)}</ThemedText>
                </View>
            );
        })}
    </View>
);

const styles = StyleSheet.create({
    legendView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 30,
        paddingVertical: 10,
        justifyContent: 'center',
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    legendCircle: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    legendCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chartView: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    chartSelectedTextStyle: {
        paddingVertical: 3,
        paddingHorizontal: 5,
    },
    barChartToopTipStyle: {
        marginBottom: 10,
        marginLeft: -6,
        paddingHorizontal: 6,
        backgroundColor: '#232B5D',
        paddingVertical: 4,
        borderRadius: 4,
    },
});
