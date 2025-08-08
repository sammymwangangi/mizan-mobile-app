import React, { useRef } from 'react';
import { TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withTiming,
  withRepeat
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
// @ts-ignore
import ConfettiCannon from 'react-native-confetti-cannon';
import { ANIMATION_DURATIONS, CONFETTI_CONFIG } from '../../constants/qamar';

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
  color?: string;
}

export const AnimatedProgressRing: React.FC<AnimatedProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = '#7B5CFF'
}) => {
  const animatedProgress = useSharedValue(0);

  React.useEffect(() => {
    animatedProgress.value = withTiming(progress / 100, { duration: 500 });
  }, [progress, animatedProgress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const rStyle = useAnimatedStyle(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset
    };
  });

  return (
    <Animated.View style={{ width: size, height: size }}>
      {/* Background circle */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: '#F0F0F0'
        }}
      />
      
      {/* Progress circle */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent',
            transform: [{ rotate: '-90deg' }]
          },
          rStyle
        ]}
      />
      
      {/* Progress text */}
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Animated.Text
          style={{
            fontSize: size * 0.2,
            fontWeight: 'bold',
            color: '#374151'
          }}
        >
          {Math.round(progress)}%
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

export default {
  AnimatedSwatch,
  AnimatedCardHero,
  ConfettiBurst,
  AnimatedSuccessCheck,
  AnimatedProgressRing
};
