/* eslint-disable react-native/no-inline-styles */
import { View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedDropdown } from './ThemedDropdown';
import { DropdownMenuType } from '../library/types';
import { ChartTypes } from '../library/enums';

export type ChartTypeNames = keyof typeof ChartTypes;
interface ChartSelectionDropdownProps {
    selectedChart: ChartTypeNames;
    setSelectedChart: React.Dispatch<React.SetStateAction<ChartTypeNames>>;
    chartSelectionList: (ChartTypeNames)[];
}
export const ChartSelectionDropdown: React.FC<ChartSelectionDropdownProps> = ({ selectedChart, setSelectedChart, chartSelectionList }) => {
    return (
        <View style={{
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 10,
        }}>
            <ThemedText>Graph Type</ThemedText>
            <ThemedDropdown
                data={chartSelectionList.map<DropdownMenuType<ChartTypeNames>>((t) => ({
                    label: ChartTypes[t],
                    value: t,
                }))}
                selectedTextStyle={{ paddingVertical: 3, paddingHorizontal: 5 }}
                value={selectedChart}
                onChange={(item: any) => {
                    setSelectedChart(item.value);
                }} />
        </View>
    );
};

