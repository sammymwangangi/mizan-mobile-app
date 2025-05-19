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
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
  value: number; // 0-100
  size?: number;
}

const CIRCLE_SIZE = 220;
const WAVE_AMPLITUDE_1 = 18;
const WAVE_AMPLITUDE_2 = 12;
const WAVE_FREQUENCY_1 = 1.7;
const WAVE_FREQUENCY_2 = 2.2;

const COLORS = {
  background: '#E7E3F2',
  
  gradient1: [
    { offset: '0%', color: '#8BB4F2', opacity: 1 },
    { offset: '50%', color: '#974BEB', opacity: 0.5 },
    { offset: '100%', color: '#DE52D0', opacity: 0.5 },
  ],
  gradient2: [
    { offset: '0%', color: '#8BB4F2', opacity: 1 },
    { offset: '50%', color: '#974BEB', opacity: 0.5 },
    { offset: '100%', color: '#DE52D0', opacity: 0.5 },
  ],
};

function getWavePath(
  percentage: number,
  phase: number,
  amplitude: number,
  frequency: number,
  size: number
): string {
  'worklet';
  const width = size;
  const height = size;
  const waveHeight = height * (1 - percentage / 100);

  let path = `M0,${waveHeight}`;
  for (let i = 0; i <= width; i++) {
    const y =
      waveHeight +
      amplitude * Math.sin(((i / width) * Math.PI * 2 * frequency) + phase);
    path += ` L${i},${y}`;
  }
  path += ` L${width},${height}`;
  path += ` L0,${height} Z`;
  return path;
}

const LiquidProgressCircle: React.FC<Props> = ({
  value,
  size = CIRCLE_SIZE,
}) => {
  // Shared values for animation
  const phase1 = useSharedValue(0);
  const phase2 = useSharedValue(Math.PI); // offset phase for 2nd wave

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
  }, [phase1, phase2]);

  const animatedProps1 = useAnimatedProps(() => {
    'worklet';
    return {
      d: getWavePath(
        value,
        phase1.value,
        WAVE_AMPLITUDE_1,
        WAVE_FREQUENCY_1,
        size
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
        size
      ),
    };
  });

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
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
              cx={size / 2}
              cy={size / 2}
              r={size / 2}
            />
          </ClipPath>
        </Defs>
        {/* Main background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2}
          fill={COLORS.background}
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
          opacity={0.82}
        />
      </Svg>
      {/* Percentage Text */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none" >
        <View style={styles.textContainer}>
          <Text style={styles.percentText}>{`${Math.round(value)}%`}</Text>
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
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#0001',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default LiquidProgressCircle;
