import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
} from 'react-native-reanimated';
import { FONTS } from 'constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  value: number; // 0-100
  size?: number;
}

const CIRCLE_SIZE = 150;
const WAVE_AMPLITUDE_1 = 12;
const WAVE_AMPLITUDE_2 = 10;
const WAVE_FREQUENCY_1 = 1.2;
const WAVE_FREQUENCY_2 = 1.2;

const COLORS = {
  background: '#EADFFB',
  gradient1: [
    { offset: '0%', color: '#FF7AE2', opacity: 1 },
    { offset: '100%', color: '#AC68FF', opacity: 1 },
  ],
  gradient2: [
    { offset: '0%', color: '#AC68FF', opacity: 1 },
    { offset: '100%', color: '#FF7AE2', opacity: 1 },
  ],
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

const LiquidProgress: React.FC<Props> = ({
  value,
  size = CIRCLE_SIZE,
}) => {
  const halfSize = size / 2;
  const strokeWidth = 3; // Stroke width of the progress ring
  const radius = halfSize + 10 // Radius for the progress ring (to create a gap)
  const circumference = 2 * Math.PI * radius;
  const padding = strokeWidth + 10; // Extra padding to account for stroke width and gap
  const svgSize = size + 2 * padding; // Increase SVG size to fit the circle and stroke
  const offset = padding; // Offset to center content within larger SVG

  // Shared values for animation
  const phase1 = useSharedValue(0);
  const phase2 = useSharedValue(Math.PI); // offset phase for 2nd wave
  const progress = useSharedValue(0); // For the progress ring animation

  useEffect(() => {
    // Animate the waves
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
    // Animate the progress ring to the target value
    progress.value = withSpring(value, { damping: 20, stiffness: 100 });
  }, [phase1, phase2, progress, value]);

  const animatedProps1 = useAnimatedProps(() => {
    'worklet';
    return {
      d: getWavePath(
        value,
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
        value,
        phase2.value,
        WAVE_AMPLITUDE_2,
        WAVE_FREQUENCY_2,
        size,
        offset
      ),
    };
  });

  // Animate the strokeDashoffset for the progress ring
  const progressProps = useAnimatedProps(() => {
    'worklet';
    const dashOffset = circumference * (1 - progress.value / 100);
    return {
      strokeDashoffset: dashOffset,
    };
  });

  return (
    <View style={{ width: svgSize, height: svgSize, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={svgSize} height={svgSize}>
        <Defs>
          {/* Two gradients for waves */}
          <LinearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            {COLORS.gradient1.map((stop, i) => (
              <Stop
                key={i}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </LinearGradient>
          <LinearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            {COLORS.gradient2.map((stop, i) => (
              <Stop
                key={i}
                offset={stop.offset}
                stopColor={stop.color}
                stopOpacity={stop.opacity}
              />
            ))}
          </LinearGradient>
          {/* ClipPath for circle */}
          <ClipPath id="clip">
            <Circle
              cx={halfSize + offset}
              cy={halfSize + offset}
              r={halfSize}
            />
          </ClipPath>
        </Defs>
        {/* Main background circle */}
        <Circle
          cx={halfSize + offset}
          cy={halfSize + offset}
          r={halfSize}
          fill={COLORS.background}
        />
        {/* Circular stroke - animated to show progress */}
        <AnimatedCircle
          cx={halfSize + offset}
          cy={halfSize + offset}
          r={radius}
          fill="none"
          stroke="#6B3BA6"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference} // Will be animated
          strokeLinecap="round"
          transform={`rotate(-90 ${halfSize + offset} ${halfSize + offset})`} // Start from the top
          animatedProps={progressProps}
        />
        {/* Animated waves, clipped to circle */}
        <AnimatedPath
          animatedProps={animatedProps1}
          fill="url(#gradient1)"
          clipPath="url(#clip)"
        />
        <AnimatedPath
          animatedProps={animatedProps2}
          fill="url(#gradient2)"
          clipPath="url(#clip)"
          opacity={0.85}
        />
      </Svg>
      {/* Percentage Text */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View style={styles.textContainer}>
          <Text style={styles.percentText}>{`${Math.round(value)}%`}</Text>
          <Text style={styles.labelText}>Target 100%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    ...FONTS.semibold(20),
    color: 'white',
    textShadowColor: '#0001',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  labelText: {
    ...FONTS.bold(9),
    color: 'white',
  },
});

export default LiquidProgress;