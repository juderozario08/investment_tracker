import { ReactNode } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { GestureResponderEvent, PressableStateCallbackType, StyleProp, ViewStyle } from "react-native/types";
import { Pressable } from 'react-native';

export const FadingPressable: React.FC<{
    children: ReactNode;
    style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
    onPress: ((event: GestureResponderEvent) => void) | null | undefined
}> = ({ children, style, onPress }) => {
    const opacity = useSharedValue(1);
    const opacityAnimatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))
    return (
        <Animated.View style={opacityAnimatedStyle}>
            <Pressable
                style={style}
                onPressIn={() => {
                    opacity.value = withTiming(0.4, { duration: 100 });
                }}
                onPressOut={() => {
                    opacity.value = withTiming(1, { duration: 100 });
                }}
                onPress={onPress}
            >
                {children}
            </Pressable>
        </Animated.View>
    )
}
