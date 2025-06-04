import Reanimated, { SharedValue, runOnJS, useAnimatedStyle } from "react-native-reanimated";
import { TransactionDataType } from "../library/types";
import { Theme } from "../theming/types";
import { FadingPressable } from "./FadingPressable";
import { Trash } from "react-native-feather";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { Text, View } from "react-native";

export const TransactionItem: React.FC<{
    setDetails: React.Dispatch<React.SetStateAction<TransactionDataType>>,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    transaction: TransactionDataType,
    removeTransaction: (id: string) => void,
    theme: Theme
}> = ({ setDetails, transaction, setIsVisible, theme, removeTransaction }) => {

    const renderRightActions = (_: SharedValue<number>, drag: SharedValue<number>) => {
        'worklet';
        const animatedStyles = useAnimatedStyle(() => {
            return { transform: [{ translateX: drag.value + 40 }] }
        })
        return (
            <Reanimated.View style={animatedStyles}>
                <FadingPressable
                    style={{
                        backgroundColor: 'red',
                        paddingHorizontal: 10,
                        height: '100%',
                        justifyContent: 'center',
                        borderRadius: 5,
                    }}
                    onPress={() => runOnJS(removeTransaction)(transaction.id)}
                >
                    <Trash stroke="white" />
                </FadingPressable>
            </Reanimated.View>
        );
    };

    return (
        <ReanimatedSwipeable renderRightActions={renderRightActions} friction={2}>
            <FadingPressable
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    height: 30,
                    paddingHorizontal: 10
                }}
                onPress={() => {
                    setDetails(transaction);
                    setIsVisible(true);
                }}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={[{ color: theme.colors.text, width: 100 }]}>
                        {transaction.tag}
                    </Text>
                    <Text style={[{ color: theme.colors.text, width: 100 }]}>
                        {transaction.name}
                    </Text>
                </View>
                <Text
                    style={[{
                        color: transaction.category === 'spending' ?
                            theme.colors.spending : transaction.category === 'income' ?
                                theme.colors.income : theme.colors.investment
                    }]}
                >{`$${transaction.amount}`}</Text>
            </FadingPressable>
        </ReanimatedSwipeable>
    )
}

