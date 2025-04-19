import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTheme } from "../theming/ThemeProvider"
import { ChevronLeft, ChevronRight } from "react-native-feather";
import { useState } from "react";

const Months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
]

export const MonthSwitcher = () => {
    const [monthNum, setMonthNum] = useState<number>(new Date().getMonth());
    const { theme } = useTheme();
    const prevMonth = () => {
        setMonthNum((monthNum + 1) % 12)
    }
    const nextMonth = () => {
        setMonthNum((monthNum + 1) % 12)
    }
    return (
        <View style={[{ backgroundColor: theme.colors.muted }, styles.container]}>
            <View style={[styles.flex]}>
                <TouchableOpacity style={[styles.center]} onPress={prevMonth}>
                    <ChevronLeft color={'white'} />
                </TouchableOpacity>
                <Text style={[{ color: theme.colors.text }, styles.textCenter, styles.center]}>{Months[monthNum]}</Text>
                <TouchableOpacity style={[styles.center]} onPress={nextMonth}>
                    <ChevronRight color={'white'} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'absolute',
        top: 25,
        padding: 10
    },
    textCenter: {
        textAlign: 'center',
        fontSize: 17,
        paddingLeft: 5,
        paddingRight: 5
    },
    center: {
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    flex: {
        flex: 1,
        flexDirection: 'row'
    },
    justifyCenter: {
        justifyContent: 'center'
    }
})
