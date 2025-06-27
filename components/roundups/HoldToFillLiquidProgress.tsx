import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  ClipPath,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { FONTS, COLORS } from '../../constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  amount: number; // Amount to display (e.g., 10 for $10)
  size?: number;
  onComplete?: () => void; // Callback when hold-to-fill completes
  onReset?: () => void; // Callback when progress resets
}

const CIRCLE_SIZE = 200;
const WAVE_AMPLITUDE_1 = 15;
const WAVE_AMPLITUDE_2 = 12;
const WAVE_FREQUENCY_1 = 1.2;
const WAVE_FREQUENCY_2 = 1.2;
const HOLD_DURATION = 2000; // 2 seconds to complete

const LIQUID_COLORS = {
  background: '#F3EEFF',
  gradient1: [
    { offset: '0%', color: '#D155FF', opacity: 1 },
    { offset: '100%', color: '#8A2BE2', opacity: 1 },
  ],
  gradient2: [
    { offset: '0%', color: '#8A2BE2', opacity: 1 },
    { offset: '100%', color: '#D155FF', opacity: 1 },
  ],
  progressRing: '#8A2BE2',
};

function getWavePath(
  percentage: number,
  phase: number,
  amplitude: number,
  frequency: number,
  size: number,
  offset: number
): string {
  'worklet';
  const width = size;
  const height = size;
  const waveHeight = height * (1 - percentage / 100);

  let path = `M${offset},${waveHeight + offset}`;
  for (let i = 0; i <= width; i++) {
    const y =
      waveHeight +
      amplitude * Math.sin(((i / width) * Math.PI * 2 * frequency) + phase);
    path += ` L${i + offset},${y + offset}`;
  }
  path += ` L${width + offset},${height + offset}`;
  path += ` L${offset},${height + offset} Z`;
  return path;
}

const HoldToFillLiquidProgress: React.FC<Props> = ({
  amount,
  size = CIRCLE_SIZE,
  onComplete,
  onReset,
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const halfSize = size / 2;
  const strokeWidth = 4;
  const radius = halfSize + 15;
  const circumference = 2 * Math.PI * radius;
  const padding = strokeWidth + 20;
  const svgSize = size + 2 * padding;
  const offset = padding;

  // Shared values for animation
  const phase1 = useSharedValue(0);
  const phase2 = useSharedValue(Math.PI);
  const holdProgress = useSharedValue(0); // 0-100 for hold progress
  const liquidProgress = useSharedValue(0); // 0-100 for liquid fill
  const ringProgress = useSharedValue(0); // 0-100 for ring progress

  // Wave animations
  useEffect(() => {
    phase1.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 3200 }),
      -1,
      false
    );
    phase2.value = withRepeat(
      withTiming(2 * Math.PI + Math.PI, { duration: 4000 }),
      -1,
      false
    );
  }, []);

  // Reset function
  const resetProgress = () => {
    'worklet';
    holdProgress.value = withSpring(0, { damping: 20, stiffness: 100 });
    liquidProgress.value = withSpring(0, { damping: 20, stiffness: 100 });
    ringProgress.value = withSpring(0, { damping: 20, stiffness: 100 });
    runOnJS(setIsCompleted)(false);
    runOnJS(setIsHolding)(false);
    if (onReset) {
      runOnJS(onReset)();
    }
  };

  // Complete function
  const completeProgress = () => {
    'worklet';
    runOnJS(setIsCompleted)(true);
    runOnJS(setIsHolding)(false);
    if (onComplete) {
      runOnJS(onComplete)();
    }
  };

  // Gesture handling
  const holdGesture = Gesture.LongPress()
    .minDuration(50)
    .onStart(() => {
      'worklet';
      if (isCompleted) {
        resetProgress();
        return;
      }
      
      runOnJS(setIsHolding)(true);
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      
      // Animate progress over HOLD_DURATION
      holdProgress.value = withTiming(100, { duration: HOLD_DURATION }, (finished) => {
        if (finished) {
          completeProgress();
          runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
        }
      });
      
      liquidProgress.value = withTiming(100, { duration: HOLD_DURATION });
      ringProgress.value = withTiming(100, { duration: HOLD_DURATION });
    })
    .onEnd(() => {
      'worklet';
      if (!isCompleted) {
        // If released before completion, reset
        runOnJS(setIsHolding)(false);
        holdProgress.value = withSpring(0, { damping: 20, stiffness: 100 });
        liquidProgress.value = withSpring(0, { damping: 20, stiffness: 100 });
        ringProgress.value = withSpring(0, { damping: 20, stiffness: 100 });
      }
    });

  // Animated props for waves
  const animatedProps1 = useAnimatedProps(() => {
    'worklet';
    return {
      d: getWavePath(
        liquidProgress.value,
        phase1.value,
        WAVE_AMPLITUDE_1,
        WAVE_FREQUENCY_1,
        size,
        offset
      ),
    };
  });

  const animatedProps2 = useAnimatedProps(() => {
    'worklet';
    return {
      d: getWavePath(
        liquidProgress.value,
        phase2.value,
        WAVE_AMPLITUDE_2,
        WAVE_FREQUENCY_2,
        size,
        offset
      ),
    };
  });

  // Animated props for progress ring
  const progressRingProps = useAnimatedProps(() => {
    'worklet';
    const dashOffset = circumference * (1 - ringProgress.value / 100);
    return {
      strokeDashoffset: dashOffset,
    };
  });

  // Animated style for container scaling
  const containerStyle = useAnimatedProps(() => {
    'worklet';
    const scale = interpolate(
      holdProgress.value,
      [0, 50, 100],
      [1, 1.05, 1],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }],
    };
  });

  return (
    <GestureDetector gesture={holdGesture}>
      <Animated.View style={[{ width: svgSize, height: svgSize, alignItems: 'center', justifyContent: 'center' }, containerStyle]}>
        <Svg width={svgSize} height={svgSize}>
          <Defs>
            <LinearGradient id="liquidGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              {LIQUID_COLORS.gradient1.map((stop, i) => (
                <Stop
                  key={i}
                  offset={stop.offset}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity}
                />
              ))}
            </LinearGradient>
            <LinearGradient id="liquidGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              {LIQUID_COLORS.gradient2.map((stop, i) => (
                <Stop
                  key={i}
                  offset={stop.offset}
                  stopColor={stop.color}
                  stopOpacity={stop.opacity}
                />
              ))}
            </LinearGradient>
            <ClipPath id="circleClip">
              <Circle
                cx={halfSize + offset}
                cy={halfSize + offset}
                r={halfSize}
              />
            </ClipPath>
          </Defs>
          
          {/* Background circle */}
          <Circle
            cx={halfSize + offset}
            cy={halfSize + offset}
            r={halfSize}
            fill={LIQUID_COLORS.background}
          />
          
          {/* Progress ring */}
          <AnimatedCircle
            cx={halfSize + offset}
            cy={halfSize + offset}
            r={radius}
            fill="none"
            stroke={LIQUID_COLORS.progressRing}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            strokeLinecap="round"
            transform={`rotate(-90 ${halfSize + offset} ${halfSize + offset})`}
            animatedProps={progressRingProps}
          />
          
          {/* Liquid waves */}
          <AnimatedPath
            animatedProps={animatedProps1}
            fill="url(#liquidGradient1)"
            clipPath="url(#circleClip)"
          />
          <AnimatedPath
            animatedProps={animatedProps2}
            fill="url(#liquidGradient2)"
            clipPath="url(#circleClip)"
            opacity={0.7}
          />
        </Svg>
        
        {/* Text overlay */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <View style={styles.textContainer}>
            <Text style={styles.amountText}>${amount}</Text>
            <Text style={styles.actionText}>
              {isCompleted ? 'Tap to Reset' : isHolding ? 'Hold to Add...' : 'Hold to Add'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountText: {
    ...FONTS.semibold(32),
    color: COLORS.text,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionText: {
    ...FONTS.medium(14),
    color: COLORS.textLight,
    marginTop: 4,
  },
});

export default HoldToFillLiquidProgress;
