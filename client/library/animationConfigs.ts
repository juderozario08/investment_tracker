import { ReduceMotion } from "react-native-reanimated";
import { SpringConfig } from "react-native-reanimated/lib/typescript/animation/springUtils";

export const springConfig: SpringConfig = {
    duration: 1500,
    dampingRatio: 0.3,
    stiffness: 1,
    overshootClamping: false,
    restDisplacementThreshold: 96.7,
    restSpeedThreshold: 0.01,
    reduceMotion: ReduceMotion.System,
};

