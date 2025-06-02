import { ScrollView } from "react-native-gesture-handler";
import { ReactNode, useRef } from "react";
import { PanResponder } from "react-native";

export const GestureScrollView: React.FC<{
    onLeftSwipe: () => void;
    onRightSwipe: () => void;
    children?: ReactNode;
}> = ({ onLeftSwipe, onRightSwipe, children }) => {

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
        <ScrollView {...panResponder.panHandlers} style={{ padding: 10 }}>
            {children}
        </ScrollView>

    )
}
