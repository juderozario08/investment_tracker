import { Easing, ReduceMotion, WithTimingConfig } from 'react-native-reanimated';
import { SpringConfig } from 'react-native-reanimated/lib/typescript/animation/springUtils';

export const getSpringConfig = (animationDuration: number): SpringConfig => {
    return {
        duration: animationDuration,
        dampingRatio: 0.3,
        stiffness: 1,
        overshootClamping: false,
        restDisplacementThreshold: 96.7,
        restSpeedThreshold: 0.01,
        reduceMotion: ReduceMotion.System,
    };
};

export const getTimingConfig = (animationDuration: number): WithTimingConfig => ({
    duration: animationDuration,
    easing: Easing.inOut(Easing.quad),
    reduceMotion: ReduceMotion.System,
});

export const FAST_ANIMATION_DURATION = 100;
export const STANDARD_ANIMATION_DURATION = 300;
export const SLOW_ANIMATION_DURATION = 500;

export const FAST_SPRING_ANIMATION_DURATION = 1500;
export const STANDARD_SPRING_ANIMATION_DURATION = 3000;
export const SLOW_SPRING_ANIMATION_DURATION = 4500;
