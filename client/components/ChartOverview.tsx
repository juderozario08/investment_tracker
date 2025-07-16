/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, View } from 'react-native';
import { ChartSelectionDropdown, ChartTypeNames } from './ChartSelectionDropdown';
import { ThemedText } from './ThemedText';
import { GraphRenderer } from './GraphRenderer';

export const ChartOverview: React.FC<{
    title?: string;
    selectedChart: ChartTypeNames;
    selectedChartData: any[];
    setSelectedChart: React.Dispatch<React.SetStateAction<ChartTypeNames>>;
    chartSelectionList: ChartTypeNames[];
    customGraphRenderer?: () => React.JSX.Element;
}> = ({ title, selectedChart, setSelectedChart, selectedChartData, chartSelectionList, customGraphRenderer }) => {
    return (
        <View style={{ paddingVertical: 10 }}>
            {title && <View style={{ paddingVertical: 10 }}>
                <ThemedText style={styles.title}>
                    {title}
                </ThemedText>
            </View>}
            <View style={{
                alignItems: 'center',
                paddingVertical: 20,
                flex: 1,
            }}>
                <ChartSelectionDropdown
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartSelectionList={chartSelectionList} />
                {customGraphRenderer ? customGraphRenderer() :
                    <GraphRenderer
                        mode={selectedChart}
                        data={selectedChartData} />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
