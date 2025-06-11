import {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {
  barDataItem,
  lineDataItem,
  pieDataItem,
} from 'react-native-gifted-charts';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ThemedDropdown} from '../../components/ThemedDropdown';
import {useDataContext} from '../../context/DataContext';
import {useDateContext} from '../../context/DateContext';
import {DropdownMenuType} from '../../library/types';
import {useTheme} from '../../theming';

const dataDropdownOptions: DropdownMenuType[] = [
  {value: 'transactions', label: 'Transactions'},
  {value: 'investment', label: 'Investment'},
];
const timeframeDropdownOptions: DropdownMenuType[] = [
  {value: 'daily', label: 'Daily'},
  {value: 'monthly', label: 'Monthly'},
  {value: 'YTD', label: 'YTD'},
  {value: 'yearly', label: 'Yearly'},
];

export const Statistics = () => {
  const theme = useTheme();
  const {date} = useDateContext();
  const {data} = useDataContext();

  const [transactionPieData, setTransactionPieData] = useState<pieDataItem[]>(
    [],
  );
  const [transactionBarData, setTransactionBarData] = useState<barDataItem[]>(
    [],
  );

  const [investmentLineChart, setInvestmentLineChart] = useState<
    lineDataItem[]
  >([]);
  const [investmentBarChart, setInvestmentBarChart] = useState<barDataItem[]>(
    [],
  );

  const [selectedDataOption, setSelectedDataOption] =
    useState<string>('transactions');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('monthly');

  useEffect(() => {
    if (data && date) {
      // NOTE: ADD FUNCTIONALITY HERE!!
    }
  }, [data, date]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        justifyContent: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          paddingVertical: 10,
        }}>
        <View
          style={{
            marginTop: 7,
          }}>
          <Text style={{color: theme.colors.text}}>Timeframe:</Text>
        </View>
        <ThemedDropdown
          theme={theme}
          data={dataDropdownOptions}
          selectedTextStyle={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
          }}
          value={selectedDataOption}
          onChange={item => {
            setSelectedDataOption(item.value);
          }}
        />
      </View>
    </SafeAreaView>
  );
};
