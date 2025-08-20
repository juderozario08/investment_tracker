/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from 'react';
import { useTheme } from '../theming';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { STANDARD_ANIMATION_DURATION } from '../library/animationConfigs';
import { FadingPressable } from './FadingPressable';
import { X } from 'react-native-feather';

const AnimatedView = Animated.createAnimatedComponent(View);

export const SlideUpView: React.FC<{
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    deps: React.DependencyList;
    children?: ReactNode;
}> = ({ visible, setVisible, deps, children }) => {
    const theme = useTheme();

    // Slide Animation
    const screenHeight = Dimensions.get('screen').height;
    const translateY = useSharedValue<number>(screenHeight);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    useEffect(() => {
        if (!visible) { return; }
        translateY.value = withSequence(
            withTiming(screenHeight, { duration: STANDARD_ANIMATION_DURATION }),
            withTiming(0, { duration: STANDARD_ANIMATION_DURATION })
        );
    }, [deps]);

    return (
        <AnimatedView
            pointerEvents={visible ? 'auto' : 'none'}
            style={[
                { backgroundColor: theme.colors.muted },
                styles.slideViewTransactionView,
                animatedStyle,
            ]}>
            <View style={{ flexDirection: 'row-reverse', paddingBottom: 10 }}>
                <FadingPressable onPress={() => {
                    translateY.value = withTiming(500, { duration: STANDARD_ANIMATION_DURATION }, () => {
                        'worklet';
                        runOnJS(setVisible)(false);
                    });
                }}>
                    <X color={'grey'} width={20} style={{ padding: 5 }} />
                </FadingPressable>
            </View>
            {children}
        </AnimatedView>
    );
};

const styles = StyleSheet.create({
    slideViewTransactionView: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        padding: 16,
        paddingBottom: 30,
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#fff',
        shadowOpacity: 0.5,
        shadowRadius: 20,
        maxHeight: '50%',
    },
});
