import React, { useRef } from 'react';
import { TouchableOpacity, Dimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSequence,
  withTiming,
  withRepeat
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
// @ts-ignore
import ConfettiCannon from 'react-native-confetti-cannon';
import { ANIMATION_DURATIONS, CONFETTI_CONFIG } from '../../constants/qamar';

import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface AnimatedSwatchProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
}

export const AnimatedSwatch: React.FC<AnimatedSwatchProps> = ({ 
  children, 
  onPress, 
  style 
}) => {
  const scale = useSharedValue(1);
  
  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePress = () => {
    // Swatch tap animation: scale 1→1.15→1
    scale.value = withSequence(
      withTiming(1.15, { duration: ANIMATION_DURATIONS.SWATCH_TAP }),
      withTiming(1, { duration: ANIMATION_DURATIONS.SWATCH_TAP })
    );
    
    Haptics.selectionAsync();
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[rStyle, style]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

interface AnimatedCardHeroProps {
  children: React.ReactNode;
  style?: any;
}

export const AnimatedCardHero: React.FC<AnimatedCardHeroProps> = ({ 
  children, 
  style 
}) => {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    // Hero cards subtle yo-yo scale 1→1.03 (withRepeat 5s)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: ANIMATION_DURATIONS.CARD_SCALE / 2 }),
        withTiming(1, { duration: ANIMATION_DURATIONS.CARD_SCALE / 2 })
      ),
      -1, // infinite repeat
      false
    );
  }, [scale]);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View style={[rStyle, style]}>
      {children}
    </Animated.View>
  );
};

interface ConfettiBurstProps {
  visible: boolean;
  onComplete?: () => void;
  colors?: string[];
}

export const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ 
  visible, 
  onComplete,
  colors = CONFETTI_CONFIG.colors
}) => {
  const confettiRef = useRef<any>(null);

  React.useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      if (confettiRef.current) {
        confettiRef.current.start();
      }

      // Auto-complete after delay
      if (onComplete) {
        setTimeout(onComplete, ANIMATION_DURATIONS.CONFETTI_DELAY);
      }
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <ConfettiCannon
      ref={confettiRef}
      count={CONFETTI_CONFIG.count}
      origin={{ x: width / 2, y: CONFETTI_CONFIG.origin.y }}
      fadeOut={CONFETTI_CONFIG.fadeOut}
      colors={colors}
      autoStart={false}
    />
  );
};

interface AnimatedSuccessCheckProps {
  visible: boolean;
  size?: number;
  color?: string;
}

export const AnimatedSuccessCheck: React.FC<AnimatedSuccessCheckProps> = ({ 
  visible, 
  size = 60,
  color = '#10B981'
}) => {
  const scale = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      // Check-mark scale 1→1.1→1 (200ms) + Haptic.success
      scale.value = withSequence(
        withTiming(1, { duration: ANIMATION_DURATIONS.SUCCESS_SCALE / 2 }),
        withTiming(1.1, { duration: ANIMATION_DURATIONS.SUCCESS_SCALE / 4 }),
        withTiming(1, { duration: ANIMATION_DURATIONS.SUCCESS_SCALE / 4 })
      );
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      scale.value = 0;
    }
  }, [visible, scale]);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center'
        },
        rStyle
      ]}
    >
      <Animated.Text
        style={{
          color: 'white',
          fontSize: size * 0.4,
          fontWeight: 'bold'
        }}
      >
        ✓
      </Animated.Text>
    </Animated.View>
  );
};

interface AnimatedProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string; // kept for compatibility but we use gradient by default
}

export const AnimatedProgressRing: React.FC<AnimatedProgressRingProps> = ({
  progress,
  size = 110,
  strokeWidth = 8,
  color = '#7B5CFF'
}) => {
  const pct = useSharedValue(0);

  React.useEffect(() => {
    pct.value = withTiming(progress, { duration: 500 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animated props for the progress stroke
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - pct.value / 100),
  }));

  // Animated SVG circle
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgLinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#C5B9FF" />
            <Stop offset="50%" stopColor={color} />
            <Stop offset="100%" stopColor="#9F7AFF" />
          </SvgLinearGradient>
        </Defs>

        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EFEAFE"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference}, ${circumference}`}
          animatedProps={animatedProps}
          // start at 12 o'clock
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center text (overlaid) */}
      <Animated.Text
        style={{
          position: 'absolute',
          fontSize: 24,
          fontWeight: 'bold',
          color: '#111827'
        }}
      >
        {`${Math.round(progress)}%`}
      </Animated.Text>
    </View>
  );
};

export default {
  AnimatedSwatch,
  AnimatedCardHero,
  ConfettiBurst,
  AnimatedSuccessCheck,
  AnimatedProgressRing
};
