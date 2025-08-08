import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { CONFETTI_COLORS } from '../../../constants/shams';

interface ConfettiSuccessProps {
  onComplete?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ConfettiSuccess: React.FC<ConfettiSuccessProps> = ({ onComplete }) => {
  const confettiPieces = useRef(
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: new Animated.Value(Math.random() * screenWidth),
      y: new Animated.Value(-50),
      rotation: new Animated.Value(0),
      scale: new Animated.Value(1),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }))
  ).current;

  const checkmarkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Success haptic
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Animate checkmark
    Animated.spring(checkmarkScale, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Animate confetti
    const animations = confettiPieces.map((piece) => {
      return Animated.parallel([
        Animated.timing(piece.y, {
          toValue: screenHeight + 100,
          duration: 3000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotation, {
          toValue: Math.random() * 720 - 360,
          duration: 3000 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(piece.scale, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(piece.scale, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.parallel(animations).start();

    // Auto-complete after animation
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [confettiPieces, checkmarkScale, onComplete]);

  return (
    <View className="absolute inset-0 items-center justify-center">
      {/* Confetti */}
      {confettiPieces.map((piece) => (
        <Animated.View
          key={piece.id}
          style={{
            position: 'absolute',
            width: 8,
            height: 8,
            backgroundColor: piece.color,
            transform: [
              { translateX: piece.x },
              { translateY: piece.y },
              { rotate: piece.rotation.interpolate({
                inputRange: [0, 360],
                outputRange: ['0deg', '360deg'],
              }) },
              { scale: piece.scale },
            ],
          }}
        />
      ))}

      {/* Success Content */}
      <View className="bg-white rounded-3xl p-8 mx-8 items-center shadow-lg">
        {/* Animated Checkmark */}
        <Animated.View
          style={{
            transform: [{ scale: checkmarkScale }],
          }}
          className="w-16 h-16 bg-[#D4AF37] rounded-full items-center justify-center mb-4"
        >
          <Text className="text-white text-2xl font-bold">✓</Text>
        </Animated.View>

        <Text className="text-xl font-bold text-gray-800 mb-2">
          Order Complete
        </Text>
        <Text className="text-gray-600 text-center">
          Welcome to the Gold Club
        </Text>
      </View>
    </View>
  );
};

export default ConfettiSuccess;
