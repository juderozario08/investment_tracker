import { ReactNode, useRef } from "react";
import { PanResponder, StyleProp, View, ViewStyle } from "react-native";

export const GestureView: React.FC<{
    onLeftSwipe: () => void;
    onRightSwipe: () => void;
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
}> = ({ onLeftSwipe, onRightSwipe, children, style }) => {

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gesture) => {
                // Prevent conflict: don't set PanResponder if horizontal swipe starts on a Swipeable
                const target = evt.target as any;
                const isFromSwipeable = target?._internalFiberInstanceHandleDEV?.type?.name === 'Swipeable';
                return !isFromSwipeable && Math.abs(gesture.dx) > Math.abs(gesture.dy);
            },
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx < -50) {
                    onLeftSwipe(); // in carousel format would show the next image
                } else if (gesture.dx > 50) {
                    onRightSwipe(); // in carousel format would show the prev image
                }
            },
        })
    ).current;

    return (
        <View {...panResponder.panHandlers} style={style}>
            {children}
        </View>

    )
}
