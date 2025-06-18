import Reanimated, { SharedValue, runOnJS, useAnimatedStyle } from "react-native-reanimated";
import { TransactionDataType } from "../library/types";
import { Theme } from "../theming/types";
import { FadingPressable } from "./FadingPressable";
import { Trash } from "react-native-feather";
import { Text, View } from "react-native";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { ThemedText } from "./ThemedText";

export const TransactionItem: React.FC<{
    setDetails: React.Dispatch<React.SetStateAction<TransactionDataType>>,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
    transaction: TransactionDataType,
    removeTransaction: (id: string) => void,
    theme: Theme
}> = ({ setDetails, transaction, setIsVisible, theme, removeTransaction }) => {

    const renderRightActions = (_: SharedValue<number>, drag: SharedValue<number>) => {
        'worklet'
        return (
            <RightActions
                drag={drag}
                onPress={() => runOnJS(removeTransaction)(transaction.id)}
            />
        );
    };

    return (
        <Swipeable renderRightActions={renderRightActions} friction={2}>
            <FadingPressable
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    margin: 10,
                }}
                onPress={() => {
                    setDetails(transaction);
                    setIsVisible(true);
                }}>
                <View style={{ flexDirection: "row" }}>
                    <ThemedText style={{ width: 100 }}>
                        {transaction.tag}
                    </ThemedText>
                    <ThemedText style={{ width: 100 }}>
                        {transaction.name}
                    </ThemedText>
                </View>
                <Text
                    style={[{
                        color: transaction.category === 'spending' ?
                            theme.colors.spending : transaction.category === 'income' ?
                                theme.colors.income : theme.colors.investment
                    }]}
                >{`$${transaction.amount}`}</Text>
            </FadingPressable>
        </Swipeable>
    )
}


const RightActions = ({ drag, onPress }: { drag: SharedValue<number>, onPress: () => void }) => {
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: drag.value + 40 }],
    }));

    return (
        <Reanimated.View style={animatedStyles}>
            <FadingPressable
                style={{
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    borderRadius: 5,
                    paddingVertical: 3
                }}
                onPress={onPress}
            >
                <Trash stroke="white" style={{ paddingHorizontal: 20 }} height={22} />
            </FadingPressable>
        </Reanimated.View>
    );
};
