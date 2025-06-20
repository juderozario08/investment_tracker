import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { PressableProps } from "react-native/types";
import { Pressable } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FadingPressable: React.FC<PressableProps> = ({ style, ...props }) => {
    const opacity = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    return (
        <AnimatedPressable
            {...props}
            style={[animatedStyle, style]}
            onPressIn={(e) => {
                if (!props.disabled) {
                    opacity.value = withTiming(0.4, { duration: 100 });
                }
                props.onPressIn?.(e);
            }}
            onPressOut={(e) => {
                if (!props.disabled) {
                    opacity.value = withTiming(1, { duration: 100 });
                }
                props.onPressOut?.(e);
            }}
        >
            {props.children}
        </AnimatedPressable>
    );
};
