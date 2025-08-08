import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';

interface MintingProgressSheetProps {
  progress: number; // 0-100
  onComplete?: () => void;
}

const MintingProgressSheet: React.FC<MintingProgressSheetProps> = ({ 
  progress, 
  onComplete 
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const lastHapticProgress = useRef(0);

  useEffect(() => {
    // Animate progress ring
    Animated.timing(progressAnim, {
      toValue: progress / 100,
      duration: 500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Haptic feedback every 20%
    const currentStep = Math.floor(progress / 20);
    const lastStep = Math.floor(lastHapticProgress.current / 20);
    
    if (currentStep > lastStep) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    lastHapticProgress.current = progress;

    // Complete callback
    if (progress >= 100 && onComplete) {
      setTimeout(onComplete, 500);
    }
  }, [progress, onComplete, progressAnim]);

  const circumference = 2 * Math.PI * 45; // radius = 45

  return (
    <View className="bg-white rounded-t-3xl p-6" style={{ height: '60%' }}>
      {/* Handle */}
      <View className="w-12 h-1 bg-gray-300 rounded-full self-center mb-6" />
      
      {/* Progress Ring */}
      <View className="items-center mb-8">
        <View className="relative">
          <Svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle */}
            <Circle
              cx="60"
              cy="60"
              r="45"
              stroke="#F0F0F0"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <Animated.View>
              <Circle
                cx="60"
                cy="60"
                r="45"
                stroke="#D4AF37"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [circumference, 0],
                })}
                strokeLinecap="round"
              />
            </Animated.View>
          </Svg>
          
          {/* Progress Text */}
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-2xl font-bold text-gray-800">
              {Math.round(progress)}%
            </Text>
          </View>
        </View>
      </View>

      {/* Status Text */}
      <View className="items-center">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Minting card
        </Text>
        <Text className="text-gray-600 text-center">
          A little order, we're almost done
        </Text>
      </View>

      {/* Progress Steps */}
      <View className="mt-8 space-y-3">
        <ProgressStep 
          title="Verifying details" 
          completed={progress > 20} 
          active={progress <= 20} 
        />
        <ProgressStep 
          title="Processing payment" 
          completed={progress > 40} 
          active={progress > 20 && progress <= 40} 
        />
        <ProgressStep 
          title="Creating card" 
          completed={progress > 60} 
          active={progress > 40 && progress <= 60} 
        />
        <ProgressStep 
          title="Preparing delivery" 
          completed={progress > 80} 
          active={progress > 60 && progress <= 80} 
        />
        <ProgressStep 
          title="Finalizing order" 
          completed={progress > 95} 
          active={progress > 80} 
        />
      </View>
    </View>
  );
};

interface ProgressStepProps {
  title: string;
  completed: boolean;
  active: boolean;
}

const ProgressStep: React.FC<ProgressStepProps> = ({ title, completed, active }) => (
  <View className="flex-row items-center">
    <View className={`w-4 h-4 rounded-full mr-3 ${
      completed ? 'bg-[#D4AF37]' : active ? 'bg-blue-500' : 'bg-gray-300'
    }`}>
      {completed && (
        <View className="w-full h-full items-center justify-center">
          <Text className="text-white text-xs">✓</Text>
        </View>
      )}
    </View>
    <Text className={`flex-1 ${
      completed || active ? 'text-gray-800' : 'text-gray-500'
    }`}>
      {title}
    </Text>
  </View>
);

export default MintingProgressSheet;
