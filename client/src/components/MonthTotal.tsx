import { View, Text } from "react-native"
import { useTheme } from "../theming/ThemeProvider";

export const MonthTotal: React.FC<{
    amounts: {
        investing: number;
        income: number;
        spending: number;
    }
}> = ({ amounts }) => {
    const { theme } = useTheme();
    return (
        <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 15,
            paddingBottom: 10,
            marginTop: 15,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: 'rgba(128, 128, 128, 0.5)',
        }}>
            <View>
                <Text style={[{ color: theme.colors.text, textAlign: 'center', paddingBottom: 10 }]}>Investing</Text>
                <Text style={[{ color: theme.colors.investment, textAlign: 'center' }]}>${amounts.investing}</Text>
            </View>
            <View>
                <Text style={[{ color: theme.colors.text, textAlign: 'center', paddingBottom: 10 }]}>Income</Text>
                <Text style={[{ color: theme.colors.income, textAlign: 'center' }]}>${amounts.income}</Text>
            </View>
            <View>
                <Text style={[{ color: theme.colors.text, textAlign: 'center', paddingBottom: 10 }]}>Spending</Text>
                <Text style={[{ color: theme.colors.spending, textAlign: 'center' }]}>${amounts.spending}</Text>
            </View>
        </View>
    )
}
