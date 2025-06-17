import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { PressableProps } from "react-native/types";
import { Pressable } from 'react-native';

export const FadingPressable: React.FC<PressableProps> = (props) => {
    const opacity = useSharedValue(1);
    const opacityAnimatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))
    return (
        <Animated.View style={opacityAnimatedStyle}>
            <Pressable
                style={props.style}
                onPressIn={() => opacity.value = withTiming(0.4, { duration: 100 })}
                onPressOut={() => opacity.value = withTiming(1, { duration: 100 })}
                onPress={props.onPress}
            >
                {props.children}
            </Pressable>
        </Animated.View>
    )
}
